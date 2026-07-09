import type { Request } from "express";

export const CONTACT_NAME_MAX_LENGTH = 80;
export const CONTACT_EMAIL_MAX_LENGTH = 254;
export const CONTACT_MESSAGE_MAX_LENGTH = 3000;
export const CONTACT_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
export const CONTACT_RATE_LIMIT_MAX_REQUESTS = 5;

type ContactSubmission = {
  name: string;
  email: string;
  message: string;
};

type ContactParseResult =
  | { ok: true; data: ContactSubmission }
  | { ok: false; status: number; error: string };

type ContactRateLimitEntry = {
  count: number;
  resetAt: number;
};

export type ContactRateLimitStore = Map<string, ContactRateLimitEntry>;

const text = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const isValidEmail = (value: string) => {
  if (value.length > CONTACT_EMAIL_MAX_LENGTH) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

export const parseContactSubmission = (body: unknown): ContactParseResult => {
  const payload = body && typeof body === "object" ? body : {};
  const name = text((payload as { name?: unknown }).name);
  const email = text((payload as { email?: unknown }).email).toLowerCase();
  const message = text((payload as { message?: unknown }).message);
  const honeypot = text((payload as { company?: unknown }).company);

  if (honeypot) {
    return { ok: false, status: 400, error: "Message could not be sent." };
  }

  if (!name || !email || !message) {
    return {
      ok: false,
      status: 400,
      error: "Name, email, and message are required.",
    };
  }

  if (name.length > CONTACT_NAME_MAX_LENGTH) {
    return {
      ok: false,
      status: 400,
      error: `Name must be ${CONTACT_NAME_MAX_LENGTH} characters or fewer.`,
    };
  }

  if (!isValidEmail(email)) {
    return { ok: false, status: 400, error: "Enter a valid email address." };
  }

  if (message.length > CONTACT_MESSAGE_MAX_LENGTH) {
    return {
      ok: false,
      status: 400,
      error: `Message must be ${CONTACT_MESSAGE_MAX_LENGTH} characters or fewer.`,
    };
  }

  return { ok: true, data: { name, email, message } };
};

export const getContactClientKey = (
  forwardedFor: string | string[] | undefined,
  fallbackIp: string | undefined,
) => {
  const forwardedValue = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : forwardedFor;
  const firstForwardedIp = forwardedValue?.split(",")[0]?.trim();

  return firstForwardedIp || fallbackIp || "unknown";
};

export const getContactClientKeyFromRequest = (request: Request) =>
  getContactClientKey(request.headers["x-forwarded-for"], request.ip);

export const checkContactRateLimit = (
  clientKey: string,
  store: ContactRateLimitStore,
  now = Date.now(),
) => {
  const current = store.get(clientKey);

  if (!current || current.resetAt <= now) {
    store.set(clientKey, {
      count: 1,
      resetAt: now + CONTACT_RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (current.count >= CONTACT_RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000),
    };
  }

  current.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
};
