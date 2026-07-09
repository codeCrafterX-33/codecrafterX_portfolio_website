import "dotenv/config";
import { clerkMiddleware } from "@clerk/express";
import express from "express";
import { v2 as cloudinary } from "cloudinary";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { requireAdmin } from "./auth";
import {
  checkContactRateLimit,
  getContactClientKeyFromRequest,
  parseContactSubmission,
  type ContactRateLimitStore,
} from "./contactGuard";
import {
  deletePortfolioImages,
  extractCloudinaryPublicId,
  getRemovedPortfolioImageUrls,
  isPortfolioPublicId,
  portfolioCloudinaryFolder,
} from "./cloudinaryCleanup";
import { prisma } from "./prisma";
import { parseProjectInput, projectSelect } from "./projects";

const app = express();
const isProduction = process.env.NODE_ENV === "production";
const port = Number(
  process.env.PORT ?? (isProduction ? 3000 : process.env.API_PORT ?? 8787),
);
const serverDirectory = dirname(fileURLToPath(import.meta.url));
const frontendDistPath = isProduction
  ? resolve(serverDirectory, "public")
  : resolve(serverDirectory, "../dist");
const contactRateLimitStore: ContactRateLimitStore = new Map();
const clerkPublishableKey =
  process.env.CLERK_PUBLISHABLE_KEY ?? process.env.VITE_CLERK_PUBLISHABLE_KEY;
const cloudinaryUploadPreset = "moThrift";
const emailLogoUrl =
  "https://res.cloudinary.com/dgc8vxmc2/image/upload/v1782158021/codecrafter_logo_veeln5.png";
const whatsappLogoUrl =
  "https://res.cloudinary.com/dgc8vxmc2/image/upload/v1782159168/whatsapp_icon_oaentw.avif";
const whatsappUrl =
  process.env.WHATSAPP_URL ??
  "https://wa.me/2349035466958?text=Hi%20Sopefoluwa%2C%20I%20came%20across%20your%20portfolio%20and%20I%27d%20like%20to%20discuss%20a%20project%20with%20you.";

if (!Number.isInteger(port) || port <= 0 || port > 65535) {
  throw new Error("PORT or API_PORT must be a valid TCP port.");
}

if (isProduction && !existsSync(join(frontendDistPath, "index.html"))) {
  throw new Error(
    "Production frontend build is missing. Run `npm run build` before `npm start`.",
  );
}

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  next();
});

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const sendResendEmail = async ({
  label,
  apiKey,
  from,
  to,
  replyTo,
  subject,
  html,
  text,
}: {
  label: string;
  apiKey: string;
  from: string;
  to: string[];
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
}) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      ...(replyTo ? { reply_to: replyTo } : {}),
      subject,
      html,
      text,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Resend API error (${label}):`, response.status, errorText);
    throw new Error(
      errorText || `Resend request failed with status ${response.status}.`,
    );
  }

  const result = (await response.json().catch(() => null)) as {
    id?: string;
  } | null;
  console.info(`Resend email sent (${label}):`, result?.id ?? "no id returned");
};

if (clerkPublishableKey && !process.env.CLERK_PUBLISHABLE_KEY) {
  process.env.CLERK_PUBLISHABLE_KEY = clerkPublishableKey;
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const destroyPortfolioImages = async (imageUrls: string[]) => {
  if (!imageUrls.length) {
    return [];
  }

  if (
    !process.env.CLOUDINARY_API_SECRET ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_CLOUD_NAME
  ) {
    throw new Error("Cloudinary is not configured on the server.");
  }

  return deletePortfolioImages(imageUrls, (publicId) =>
    cloudinary.uploader.destroy(publicId, {
      invalidate: true,
      resource_type: "image",
    }),
  );
};

app.get("/api/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use(express.json({ limit: "2mb" }));
app.use("/api", (_req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});
app.use(clerkMiddleware({ publishableKey: clerkPublishableKey }));

app.post("/api/contact", async (req, res, next) => {
  try {
    const clientKey = getContactClientKeyFromRequest(req);
    const rateLimit = checkContactRateLimit(
      clientKey,
      contactRateLimitStore,
    );

    if (!rateLimit.allowed) {
      res
        .status(429)
        .set("Retry-After", String(rateLimit.retryAfterSeconds))
        .json({ error: "Too many messages. Please try again later." });
      return;
    }

    const submission = parseContactSubmission(req.body);

    if (!submission.ok) {
      res.status(submission.status).json({ error: submission.error });
      return;
    }

    const { name, email, message } = submission.data;

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const toEmail = process.env.RESEND_TO_EMAIL;

    if (!resendApiKey || !fromEmail || !toEmail) {
      res.status(500).json({
        error: "Resend is not configured on the server.",
      });
      return;
    }

    const logoUrl = emailLogoUrl;
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message);
    const replyMailto = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(
      `Re: Your message to CodeCrafterX`,
    )}`;
    const notificationSubject = `New contact form message from ${name}`;
    const notificationHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827; max-width: 680px; background: #f8fafc; padding: 24px;">
        <div style="background: #050505; border-radius: 18px 18px 0 0; padding: 24px;">
          <img src="${logoUrl}" alt="CodeCrafterX" style="display: block; width: 190px; max-width: 100%; margin-bottom: 22px;" />
          <p style="margin: 0 0 8px; color: #22c55e; font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;">New portfolio inquiry</p>
          <h2 style="margin: 0; color: #ffffff; font-size: 28px; line-height: 1.25;">A new client message just came in</h2>
        </div>
        <div style="background: #ffffff; border: 1px solid #e5e7eb; border-top: 0; border-radius: 0 0 18px 18px; padding: 24px;">
          <p style="margin: 0 0 18px; color: #4b5563;">
            Someone submitted the contact form on your portfolio. Their details are organized below so you can follow up quickly.
          </p>
          <div style="margin: 0 0 22px;">
            <div style="display: inline-block; width: 30%; min-width: 150px; margin: 0 10px 10px 0; padding: 14px; border: 1px solid #e5e7eb; border-radius: 12px; background: #f9fafb; vertical-align: top;">
              <p style="margin: 0 0 6px; color: #6b7280; font-size: 12px; font-weight: 700; text-transform: uppercase;">Name</p>
              <p style="margin: 0; color: #111827; font-weight: 700;">${safeName}</p>
            </div>
            <div style="display: inline-block; width: 58%; min-width: 220px; margin: 0 0 10px; padding: 14px; border: 1px solid #e5e7eb; border-radius: 12px; background: #f9fafb; vertical-align: top;">
              <p style="margin: 0 0 6px; color: #6b7280; font-size: 12px; font-weight: 700; text-transform: uppercase;">Email</p>
              <p style="margin: 0; color: #111827; font-weight: 700;">${safeEmail}</p>
            </div>
          </div>
          <div style="margin: 0 0 22px; padding: 18px; border-left: 4px solid #22c55e; border-radius: 12px; background: #f0fdf4;">
            <p style="margin: 0 0 10px; color: #14532d; font-size: 13px; font-weight: 700; text-transform: uppercase;">Message</p>
            <p style="margin: 0; color: #111827; white-space: pre-wrap;">${safeMessage}</p>
          </div>
          <a href="${replyMailto}" style="display: inline-block; padding: 12px 18px; border-radius: 10px; background: #22c55e; color: #ffffff; text-decoration: none; font-weight: 700;">
            Reply to client
          </a>
          <p style="margin: 18px 0 0; color: #6b7280; font-size: 13px;">
            Tip: you can also reply directly to this email because the submitted email is set as the reply-to address.
          </p>
        </div>
      </div>
    `;
    const notificationText = [
      "New portfolio inquiry",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      "Message:",
      message,
    ].join("\n");
    const clientSubject = "Thanks for reaching out to CodeCrafterX";
    const clientHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #111827; max-width: 640px;">
        <img src="${logoUrl}" alt="CodeCrafterX" style="display: block; width: 180px; max-width: 100%; margin-bottom: 24px;" />
        <h2 style="margin: 0 0 16px;">Thanks for reaching out, ${safeName}</h2>
        <p style="margin: 0 0 16px;">
          I have received your message and appreciate you taking the time to contact me.
        </p>
        <p style="margin: 0 0 16px;">
          I will review your message and get back to you within 24 hours with a thoughtful response.
        </p>
        <div style="margin: 24px 0; padding: 16px; border-left: 4px solid #22c55e; background: #f0fdf4;">
          <p style="margin: 0; font-weight: 700;">Your message</p>
          <p style="margin: 8px 0 0; white-space: pre-wrap;">${safeMessage}</p>
        </div>
        <div style="margin: 24px 0; padding: 18px; border: 1px solid #bbf7d0; border-radius: 12px; background: #f7fee7;">
          <p style="margin: 0 0 10px; font-weight: 700;">Prefer to continue on WhatsApp?</p>
          <p style="margin: 0 0 14px; color: #374151;">
            You can also reach me directly on WhatsApp for a quicker conversation.
          </p>
          <a href="${whatsappUrl}" style="display: inline-flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: 8px; background: #22c55e; color: #ffffff; text-decoration: none; font-weight: 700;">
            <img src="${whatsappLogoUrl}" alt="" style="display: inline-block; width: 20px; height: 20px; vertical-align: middle;" />
            Message me on WhatsApp
          </a>
        </div>
        <p style="margin: 0 0 4px;">Best regards,</p>
        <p style="margin: 0; font-weight: 700;">Sopefoluwa Bakare</p>
        <p style="margin: 4px 0 0; color: #4b5563;">CodeCrafterX</p>
      </div>
    `;
    const clientText = [
      `Thanks for reaching out, ${name}`,
      "",
      "I have received your message and appreciate you taking the time to contact me.",
      "I will review your message and get back to you within 24 hours with a thoughtful response.",
      "",
      "Your message:",
      message,
      "",
      `You can also reach me directly on WhatsApp: ${whatsappUrl}`,
      "",
      "Best regards,",
      "Sopefoluwa Bakare",
      "CodeCrafterX",
    ].join("\n");

    const emailResults = await Promise.allSettled([
      sendResendEmail({
        label: "owner notification",
        apiKey: resendApiKey,
        from: fromEmail,
        to: [toEmail],
        replyTo: email,
        subject: notificationSubject,
        html: notificationHtml,
        text: notificationText,
      }),
      sendResendEmail({
        label: "client confirmation",
        apiKey: resendApiKey,
        from: fromEmail,
        to: [email],
        replyTo: toEmail,
        subject: clientSubject,
        html: clientHtml,
        text: clientText,
      }),
    ]);

    const failedEmail = emailResults.find(
      (result): result is PromiseRejectedResult => result.status === "rejected",
    );

    if (failedEmail) {
      throw failedEmail.reason instanceof Error
        ? failedEmail.reason
        : new Error("One or more contact emails failed to send.");
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.get("/api/projects", async (_req, res, next) => {
  try {
    const projects = await prisma.project.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      select: projectSelect,
    });

    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
});

app.get("/api/projects/:slug", async (req, res, next) => {
  try {
    const project = await prisma.project.findUnique({
      where: { slug: req.params.slug },
      select: projectSelect,
    });

    if (!project || !project.published) {
      res.status(404).json({ error: "Project not found." });
      return;
    }

    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
});

app.get("/api/cloudinary/config", (_req, res) => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    res.status(500).json({
      error: "CLOUDINARY_CLOUD_NAME is not configured on the server.",
    });
    return;
  }

  res.status(200).json({
    cloudName,
        folder: portfolioCloudinaryFolder,
    uploadPreset: cloudinaryUploadPreset,
  });
});

app.post("/api/cloudinary/signature", async (req, res, next) => {
  try {
    await requireAdmin(req);

    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

    if (!apiSecret || !apiKey || !cloudName) {
      res.status(500).json({
        error: "Cloudinary is not configured on the server.",
      });
      return;
    }

    const requestParams =
      req.body && typeof req.body === "object" ? req.body.paramsToSign : {};
    const requestTimestamp =
      requestParams &&
      typeof requestParams === "object" &&
      typeof requestParams.timestamp === "number"
        ? requestParams.timestamp
        : Math.floor(Date.now() / 1000);
    const paramsToSign = {
      ...(requestParams && typeof requestParams === "object"
        ? requestParams
        : {}),
      folder: portfolioCloudinaryFolder,
      timestamp: requestTimestamp,
    } as Record<string, string | number | boolean>;
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      apiSecret,
    );

    res.status(200).json({
      signature,
      timestamp: requestTimestamp,
      uploadSignatureTimestamp: requestTimestamp,
      apiKey,
      folder: portfolioCloudinaryFolder,
    });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/cloudinary/image", async (req, res, next) => {
  try {
    await requireAdmin(req);

    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const imageUrl =
      typeof req.body?.imageUrl === "string" ? req.body.imageUrl.trim() : "";
    const publicId =
      typeof req.body?.publicId === "string" && req.body.publicId.trim()
        ? req.body.publicId.trim()
        : imageUrl
          ? extractCloudinaryPublicId(imageUrl)
          : null;

    if (!apiSecret || !apiKey || !cloudName) {
      res.status(500).json({
        error: "Cloudinary is not configured on the server.",
      });
      return;
    }

    if (!publicId) {
      res.status(400).json({
        error: "A valid Cloudinary image URL or public ID is required.",
      });
      return;
    }

    if (!isPortfolioPublicId(publicId)) {
      res.status(400).json({
        error: "Only portfolio Cloudinary images can be deleted.",
      });
      return;
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
      resource_type: "image",
    });

    if (result.result !== "ok" && result.result !== "not found") {
      res.status(502).json({
        error: `Cloudinary delete failed with result: ${result.result}`,
      });
      return;
    }

    res.status(200).json({ ok: true, publicId, result });
  } catch (error) {
    next(error);
  }
});

app.get("/api/admin/projects", async (_req, res, next) => {
  try {
    await requireAdmin(_req);
    const projects = await prisma.project.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      select: projectSelect,
    });

    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
});

app.get("/api/admin/projects/:slug", async (req, res, next) => {
  try {
    await requireAdmin(req);
    const project = await prisma.project.findUnique({
      where: { slug: req.params.slug },
      select: projectSelect,
    });

    if (!project) {
      res.status(404).json({ error: "Project not found." });
      return;
    }

    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
});

app.post("/api/projects", async (req, res, next) => {
  try {
    await requireAdmin(req);
    const data = parseProjectInput(req.body);
    const project = await prisma.project.create({
      data,
      select: projectSelect,
    });

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
});

app.put("/api/projects/:slug", async (req, res, next) => {
  try {
    await requireAdmin(req);
    const data = parseProjectInput(req.body);
    const existingProject = await prisma.project.findUnique({
      where: { slug: req.params.slug },
      select: { images: true },
    });

    if (!existingProject) {
      res.status(404).json({ error: "Project not found." });
      return;
    }

    const removedImages = getRemovedPortfolioImageUrls(
      existingProject.images,
      data.images,
    );
    await destroyPortfolioImages(removedImages);

    const project = await prisma.project.update({
      where: { slug: req.params.slug },
      data,
      select: projectSelect,
    });

    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/projects/:slug", async (req, res, next) => {
  try {
    await requireAdmin(req);
    const project = await prisma.project.findUnique({
      where: { slug: req.params.slug },
      select: { images: true },
    });

    if (!project) {
      res.status(404).json({ error: "Project not found." });
      return;
    }

    await destroyPortfolioImages(project.images);
    await prisma.project.delete({ where: { slug: req.params.slug } });
    res.status(200).json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.use("/api", (_req, res) => {
  res.status(404).json({ error: "API route not found." });
});

app.use(
  "/assets",
  express.static(join(frontendDistPath, "assets"), {
    immutable: true,
    maxAge: "1y",
  }),
);
app.use(
  express.static(frontendDistPath, {
    index: false,
    maxAge: "1h",
  }),
);

app.get("*", (_req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  res.sendFile(join(frontendDistPath, "index.html"));
});

app.use(
  (
    error: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    void _next;
    const message = error instanceof Error ? error.message : "Request failed.";
    const status =
      message === "Unauthorized."
        ? 401
        : message === "Forbidden."
          ? 403
          : 400;
    res.status(status).json({ error: message });
  },
);

const server = app.listen(port, "0.0.0.0", () => {
  console.log(`Portfolio server running on port ${port}`);
});

let isShuttingDown = false;

const shutdown = (signal: NodeJS.Signals) => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  console.log(`${signal} received. Shutting down gracefully.`);

  const forceShutdownTimer = setTimeout(() => {
    console.error("Graceful shutdown timed out.");
    process.exit(1);
  }, 10_000);
  forceShutdownTimer.unref();

  server.close(async (error) => {
    clearTimeout(forceShutdownTimer);
    await prisma.$disconnect();

    if (error) {
      console.error("Server shutdown failed:", error);
      process.exit(1);
    }

    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
