import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { requireAdmin } from "../server/projects";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed." });
  }

  try {
    const body = request.body as HandleUploadBody;

    if (body.type !== "blob.upload-completed") {
      requireAdmin(request.headers.authorization);
    }

    const result = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
        maximumSizeInBytes: 10 * 1024 * 1024,
        addRandomSuffix: true,
      }),
    });

    return response.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    const status = message === "Unauthorized." ? 401 : 400;
    return response.status(status).json({ error: message });
  }
}
