import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../../server/prisma";
import { parseProjectInput, projectSelect, requireAdmin } from "../../server/projects";

const getSlug = (queryValue: string | string[] | undefined) =>
  Array.isArray(queryValue) ? queryValue[0] : queryValue;

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const slug = getSlug(request.query.slug);

  if (!slug) {
    return response.status(400).json({ error: "Project slug is required." });
  }

  try {
    if (request.method === "GET") {
      const project = await prisma.project.findUnique({
        where: { slug },
        select: projectSelect,
      });

      if (!project || !project.published) {
        return response.status(404).json({ error: "Project not found." });
      }

      return response.status(200).json(project);
    }

    if (request.method === "PUT") {
      requireAdmin(request.headers.authorization);
      const data = parseProjectInput(request.body);
      const project = await prisma.project.update({
        where: { slug },
        data,
        select: projectSelect,
      });

      return response.status(200).json(project);
    }

    if (request.method === "DELETE") {
      requireAdmin(request.headers.authorization);
      await prisma.project.delete({ where: { slug } });
      return response.status(200).json({ ok: true });
    }

    response.setHeader("Allow", "GET, PUT, DELETE");
    return response.status(405).json({ error: "Method not allowed." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed.";
    const status = message === "Unauthorized." ? 401 : 400;
    return response.status(status).json({ error: message });
  }
}
