import "dotenv/config";
import { clerkMiddleware } from "@clerk/express";
import express from "express";
import { v2 as cloudinary } from "cloudinary";
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
import { caseStudySelect, parseCaseStudyInput } from "./caseStudies";

const app = express();
const isProduction = process.env.NODE_ENV === "production";
const defaultPort = isProduction ? 5000 : Number(process.env.API_PORT || 8787);
const port = Number(process.env.PORT || defaultPort);
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
  "https://wa.me/2349035466958?text=Hi%codeCrafterX%2C%20I%20came%20across%20your%20portfolio%20and%20I%27d%20like%20to%20discuss%20a%20project%20with%20you.";
const allowedOrigins = new Set(
  [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://sopefoluwabakare.dev",
    "https://www.sopefoluwabakare.dev",
    ...(process.env.CLIENT_ORIGINS ?? "")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
  ].map((origin) => origin.replace(/\/$/, "")),
);

if (!Number.isInteger(port) || port <= 0 || port > 65535) {
  throw new Error("PORT or API_PORT must be a valid TCP port.");
}

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  next();
});
app.use((req, res, next) => {
  const origin = req.get("origin")?.replace(/\/$/, "");

  if (origin && allowedOrigins.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
});

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const normalizeEmailAddress = (value: string) =>
  value
    .trim()
    .replace(/^.*<([^>]+)>.*$/, "$1")
    .toLowerCase();

const formatSender = (email: string, name: string) => {
  const trimmedEmail = email.trim();
  const trimmedName = name.trim();

  if (!trimmedName || trimmedEmail.includes("<")) {
    return trimmedEmail;
  }

  const safeName = trimmedName.replace(/["<>]/g, "");
  return `${safeName} <${trimmedEmail}>`;
};

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
    signal: AbortSignal.timeout(15_000),
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
    const rateLimit = checkContactRateLimit(clientKey, contactRateLimitStore);

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
    const fromName = process.env.RESEND_FROM_NAME || "CodeCrafterX Portfolio";

    if (!resendApiKey || !fromEmail || !toEmail) {
      res.status(500).json({
        error: "Resend is not configured on the server.",
      });
      return;
    }

    if (normalizeEmailAddress(fromEmail) === normalizeEmailAddress(toEmail)) {
      console.warn(
        "RESEND_FROM_EMAIL and RESEND_TO_EMAIL are the same mailbox. Use a separate sender like portfolio@yourdomain for better deliverability.",
      );
    }

    const sender = formatSender(fromEmail, fromName);
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message);
    const replyMailto = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(
      "Re: Your message to CodeCrafterX",
    )}`;
    const notificationSubject = "New portfolio contact message";
    const notificationHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827; max-width: 640px;">
        <p style="margin: 0 0 14px;">A new message was submitted through the portfolio contact form.</p>
        <p style="margin: 0 0 6px;"><strong>Name:</strong> ${safeName}</p>
        <p style="margin: 0 0 18px;"><strong>Email:</strong> <a href="${replyMailto}" style="color: #047857;">${safeEmail}</a></p>
        <div style="border-left: 3px solid #22c55e; padding-left: 14px;">
          <p style="margin: 0 0 8px; font-weight: 700;">Message</p>
          <p style="margin: 0; white-space: pre-wrap;">${safeMessage}</p>
        </div>
        <p style="margin: 18px 0 0; color: #6b7280; font-size: 13px;">Use the linked email address above to reply to ${safeName}.</p>
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
    const clientSubject = "We received your message";
    const clientHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #111827; max-width: 620px;">
        <img src="${emailLogoUrl}" alt="CodeCrafterX" style="display: block; width: 180px; max-width: 100%; margin-bottom: 24px;" />
        <p style="margin: 0 0 16px;">Hi ${safeName},</p>
        <p style="margin: 0 0 16px;">I received your message and appreciate you taking the time to contact me.</p>
        <p style="margin: 0 0 16px;">I will review your message and get back to you within 24 hours.</p>
        <div style="margin: 22px 0; padding: 16px; border-left: 3px solid #22c55e; background: #f9fafb;">
          <p style="margin: 0; font-weight: 700;">Your message</p>
          <p style="margin: 8px 0 0; white-space: pre-wrap;">${safeMessage}</p>
        </div>
        <div style="margin: 24px 0; padding: 18px; border: 1px solid #bbf7d0; border-radius: 12px; background: #f7fee7;">
          <p style="margin: 0 0 10px; font-weight: 700;">Prefer to continue on WhatsApp?</p>
          <p style="margin: 0 0 14px; color: #374151;">You can also reach me directly on WhatsApp for a quicker conversation.</p>
          <a href="${whatsappUrl}" style="display: inline-block; padding: 10px 14px; border-radius: 8px; background: #22c55e; color: #ffffff; text-decoration: none; font-weight: 700;">
            <img src="${whatsappLogoUrl}" alt="" style="display: inline-block; width: 20px; height: 20px; vertical-align: middle; margin-right: 8px;" />
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
      "I received your message and appreciate you taking the time to contact me.",
      "I will review your message and get back to you within 24 hours.",
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

    const [ownerEmailResult, clientEmailResult] = await Promise.allSettled([
      sendResendEmail({
        label: "owner notification",
        apiKey: resendApiKey,
        from: sender,
        to: [toEmail],
        replyTo: email,
        subject: notificationSubject,
        html: notificationHtml,
        text: notificationText,
      }),
      sendResendEmail({
        label: "client confirmation",
        apiKey: resendApiKey,
        from: sender,
        to: [email],
        replyTo: toEmail,
        subject: clientSubject,
        html: clientHtml,
        text: clientText,
      }),
    ]);

    const failedEmails = [
      { label: "owner notification", result: ownerEmailResult },
      { label: "client confirmation", result: clientEmailResult },
    ].filter(
      (
        email,
      ): email is {
        label: string;
        result: PromiseRejectedResult;
      } => email.result.status === "rejected",
    );

    if (failedEmails.length > 0) {
      failedEmails.forEach(({ label, result }) => {
        console.error(
          `Required email failed (${label}):`,
          result.reason instanceof Error
            ? result.reason.message
            : result.reason,
        );
      });
      res.status(502).json({
        error:
          "Message could not be sent right now. Please try again in a moment or use WhatsApp.",
      });
      return;
    }

    res.status(200).json({ ok: true, confirmationSent: true });
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

app.get("/api/case-studies", async (_req, res, next) => {
  try {
    const [standaloneStudies, projectStudies] = await Promise.all([
      prisma.caseStudy.findMany({
        where: { published: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        select: caseStudySelect,
      }),
      prisma.project.findMany({
        where: { published: true, caseStudy: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        select: projectSelect,
      }),
    ]);

    const attachedStudies = projectStudies.map((project) => ({
      id: `project:${project.id}`,
      slug: `project-${project.slug}`,
      title: project.caseStudyTitle || project.title,
      company: project.caseStudyCompany || project.category,
      challenge: project.challenge || project.description,
      solution: project.solution || project.longDescription,
      results: project.results,
      techStack: project.techStack,
      images: project.images,
      liveUrl: project.liveUrl,
      published: project.published,
      sortOrder: project.sortOrder,
      projectSlug: project.slug,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    }));

    const studies = [
      ...standaloneStudies.map((study) => ({ ...study, projectSlug: null })),
      ...attachedStudies,
    ].sort(
      (left, right) =>
        left.sortOrder - right.sortOrder ||
        new Date(right.createdAt).getTime() -
          new Date(left.createdAt).getTime(),
    );

    res.status(200).json(studies);
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

app.get("/api/admin/case-studies", async (req, res, next) => {
  try {
    await requireAdmin(req);
    const studies = await prisma.caseStudy.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      select: caseStudySelect,
    });
    res.status(200).json(studies);
  } catch (error) {
    next(error);
  }
});

app.get("/api/admin/case-studies/:slug", async (req, res, next) => {
  try {
    await requireAdmin(req);
    const study = await prisma.caseStudy.findUnique({
      where: { slug: req.params.slug },
      select: caseStudySelect,
    });
    if (!study) {
      res.status(404).json({ error: "Case study not found." });
      return;
    }
    res.status(200).json(study);
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

app.post("/api/case-studies", async (req, res, next) => {
  try {
    await requireAdmin(req);
    const study = await prisma.caseStudy.create({
      data: parseCaseStudyInput(req.body),
      select: caseStudySelect,
    });
    res.status(201).json(study);
  } catch (error) {
    next(error);
  }
});

app.put("/api/case-studies/:slug", async (req, res, next) => {
  try {
    await requireAdmin(req);
    const data = parseCaseStudyInput(req.body);
    const existing = await prisma.caseStudy.findUnique({
      where: { slug: req.params.slug },
      select: { images: true },
    });
    if (!existing) {
      res.status(404).json({ error: "Case study not found." });
      return;
    }
    await destroyPortfolioImages(
      getRemovedPortfolioImageUrls(existing.images, data.images),
    );
    const study = await prisma.caseStudy.update({
      where: { slug: req.params.slug },
      data,
      select: caseStudySelect,
    });
    res.status(200).json(study);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/case-studies/:slug", async (req, res, next) => {
  try {
    await requireAdmin(req);
    const study = await prisma.caseStudy.findUnique({
      where: { slug: req.params.slug },
      select: { images: true },
    });
    if (!study) {
      res.status(404).json({ error: "Case study not found." });
      return;
    }
    await destroyPortfolioImages(study.images);
    await prisma.caseStudy.delete({ where: { slug: req.params.slug } });
    res.status(200).json({ ok: true });
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
  (
    error: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    void _next;
    const message = error instanceof Error ? error.message : "Request failed.";
    console.error("API request failed:", message);
    const status =
      message === "Unauthorized." ? 401 : message === "Forbidden." ? 403 : 400;
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
