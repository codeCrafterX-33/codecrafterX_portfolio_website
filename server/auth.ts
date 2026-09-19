import type { Request } from "express";
import { clerkClient, getAuth } from "@clerk/express";
import { HttpError } from "./httpError";

type ClerkRoleMetadata = {
  role?: string;
};

const isAdminRole = (value: unknown): value is ClerkRoleMetadata => {
  return Boolean(
    value &&
      typeof value === "object" &&
      "role" in value &&
      typeof (value as ClerkRoleMetadata).role === "string",
  );
};

export const hasAdminAccess = async (request: Request): Promise<boolean> => {
  const { userId } = getAuth(request);

  if (!userId) {
    return false;
  }

  const user = await clerkClient.users.getUser(userId);
  return isAdminRole(user.publicMetadata) && user.publicMetadata.role === "admin";
};

export const requireAdmin = async (request: Request) => {
  const { userId } = getAuth(request);

  if (!userId) {
    throw new HttpError(401, "Unauthorized.");
  }

  const user = await clerkClient.users.getUser(userId);
  if (user.publicMetadata.role !== "admin") {
    throw new HttpError(403, "Forbidden.");
  }
};
