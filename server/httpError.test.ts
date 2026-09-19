import assert from "node:assert/strict";
import { test } from "node:test";
import { Readable } from "node:stream";
import express from "express";
import { getHttpErrorStatus, HttpError } from "./httpError";

const parseJsonError = (body: string, limit = "2mb") =>
  new Promise<unknown>((resolve) => {
    const request = Readable.from([body]);
    Object.assign(request, {
      headers: {
        "content-type": "application/json",
        "content-length": String(Buffer.byteLength(body)),
      },
    });
    express.json({ limit })(
      request as express.Request,
      {} as express.Response,
      resolve,
    );
  });

test("malformed JSON keeps the Express 400 status", async () => {
  assert.equal(getHttpErrorStatus(await parseJsonError('{"broken":')), 400);
});

test("oversized JSON keeps the Express 413 status", async () => {
  assert.equal(getHttpErrorStatus(await parseJsonError('{"value":"large"}', "5b")), 413);
});

test("application errors retain their status; unexpected errors default to 500", () => {
  assert.equal(getHttpErrorStatus(new HttpError(401, "Unauthorized.")), 401);
  assert.equal(getHttpErrorStatus(new Error("Unexpected")), 500);
  for (const status of [200, 600, 400.5, "400", NaN]) {
    assert.equal(getHttpErrorStatus(Object.assign(new Error(), { status })), 500);
  }
  assert.equal(getHttpErrorStatus(null), 500);
});
