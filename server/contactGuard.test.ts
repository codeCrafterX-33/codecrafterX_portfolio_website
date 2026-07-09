import assert from "node:assert/strict";
import { test } from "node:test";
import {
  CONTACT_RATE_LIMIT_MAX_REQUESTS,
  CONTACT_RATE_LIMIT_WINDOW_MS,
  checkContactRateLimit,
  getContactClientKey,
  parseContactSubmission,
} from "./contactGuard";

test("parseContactSubmission accepts a valid contact payload", () => {
  assert.deepEqual(
    parseContactSubmission({
      name: " Sope ",
      email: "HELLO@Example.com ",
      message: " I need a website. ",
      company: "",
    }),
    {
      ok: true,
      data: {
        name: "Sope",
        email: "hello@example.com",
        message: "I need a website.",
      },
    },
  );
});

test("parseContactSubmission rejects invalid email addresses", () => {
  assert.deepEqual(
    parseContactSubmission({
      name: "Sope",
      email: "not-an-email",
      message: "Hello there",
      company: "",
    }),
    {
      ok: false,
      status: 400,
      error: "Enter a valid email address.",
    },
  );
});

test("parseContactSubmission rejects overlong contact fields", () => {
  assert.deepEqual(
    parseContactSubmission({
      name: "A".repeat(81),
      email: "hello@example.com",
      message: "Hello there",
      company: "",
    }),
    {
      ok: false,
      status: 400,
      error: "Name must be 80 characters or fewer.",
    },
  );

  assert.deepEqual(
    parseContactSubmission({
      name: "Sope",
      email: "hello@example.com",
      message: "A".repeat(3001),
      company: "",
    }),
    {
      ok: false,
      status: 400,
      error: "Message must be 3000 characters or fewer.",
    },
  );
});

test("parseContactSubmission rejects filled honeypot fields as bots", () => {
  assert.deepEqual(
    parseContactSubmission({
      name: "Sope",
      email: "hello@example.com",
      message: "Hello there",
      company: "Bot Corp",
    }),
    {
      ok: false,
      status: 400,
      error: "Message could not be sent.",
    },
  );
});

test("checkContactRateLimit blocks clients after the request limit", () => {
  const hits = new Map<string, { count: number; resetAt: number }>();
  const now = 1_700_000_000_000;

  for (let index = 0; index < CONTACT_RATE_LIMIT_MAX_REQUESTS; index += 1) {
    const result = checkContactRateLimit("127.0.0.1", hits, now);
    assert.equal(result.allowed, true);
  }

  const blocked = checkContactRateLimit("127.0.0.1", hits, now);
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.retryAfterSeconds, CONTACT_RATE_LIMIT_WINDOW_MS / 1000);

  const reset = checkContactRateLimit(
    "127.0.0.1",
    hits,
    now + CONTACT_RATE_LIMIT_WINDOW_MS + 1,
  );
  assert.equal(reset.allowed, true);
});

test("getContactClientKey prefers the first forwarded IP", () => {
  assert.equal(
    getContactClientKey("203.0.113.10, 70.41.3.18", "127.0.0.1"),
    "203.0.113.10",
  );
});
