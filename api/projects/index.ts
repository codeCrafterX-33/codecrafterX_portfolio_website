import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../../server/prisma";
import { parseProjectInput, projectSelect, requireAdmin } from "../../server/projects";

const hasValidAdminToken = (authorizationHeader?: string) =>
  Boolean(
    process.env.ADMIN_TOKEN &&
      authorizationHeader === `Bearer ${process.env.ADMIN_TOKEN}`,
  );

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  try {
    if (request.method === "GET") {
      const isAdmin = hasValidAdminToken(request.headers.authorization);
      const projects = await prisma.project.findMany({
        where: isAdmin ? undefined : { published: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        select: projectSelect,
      });

      return response.status(200).json(projects);
    }

    if (request.method === "POST") {
      requireAdmin(request.headers.authorization);
      const data = parseProjectInput(request.body);
      const project = await prisma.project.create({
        data,
        select: projectSelect,
      });

      return response.status(201).json(project);
    }

    response.setHeader("Allow", "GET, POST");
    return response.status(405).json({ error: "Method not allowed." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed.";
    const status = message === "Unauthorized." ? 401 : 400;
    return response.status(status).json({ error: message });
  }
}
