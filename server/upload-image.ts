import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// For some platforms (e.g., Next.js) disabling body parsing may be required.
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Allow", "POST");
    res.end("Method not allowed");
    return;
  }

  try {
    // Basic admin authorization check
    const auth = req.headers?.authorization;
    if (!auth || auth !== `Bearer ${process.env.ADMIN_TOKEN}`) {
      res.statusCode = 401;
      res.json({ error: "Unauthorized" });
      return;
    }

    const form = new formidable.IncomingForm({ multiples: false });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.statusCode = 500;
        res.json({ error: "Failed to parse form data" });
        return;
      }

      const file = (files && (files.file as any)) || null;
      const path = file?.filepath || file?.path || file?.filePath || null;

      if (!path) {
        res.statusCode = 400;
        res.json({ error: "No file uploaded" });
        return;
      }

      try {
        const result = await cloudinary.uploader.upload(path, {
          folder: "projects",
        });

        res.statusCode = 200;
        res.json({ url: result.secure_url });
      } catch (uploadErr: any) {
        res.statusCode = 500;
        res.json({ error: uploadErr?.message || "Upload failed" });
      }
    });
  } catch (e: any) {
    res.statusCode = 500;
    res.json({ error: e?.message || "Server error" });
  }
}
