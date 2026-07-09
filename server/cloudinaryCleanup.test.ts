import assert from "node:assert/strict";
import { test } from "node:test";
import {
  deletePortfolioImages,
  extractCloudinaryPublicId,
  getRemovedPortfolioImageUrls,
} from "./cloudinaryCleanup";

test("extractCloudinaryPublicId extracts versioned portfolio image IDs", () => {
  assert.equal(
    extractCloudinaryPublicId(
      "https://res.cloudinary.com/demo/image/upload/v123/codeCrafterX_portfolio/project-image.jpg",
    ),
    "codeCrafterX_portfolio/project-image",
  );
});

test("getRemovedPortfolioImageUrls returns only removed portfolio images", () => {
  const retained =
    "https://res.cloudinary.com/demo/image/upload/v1/codeCrafterX_portfolio/retained.jpg";
  const removed =
    "https://res.cloudinary.com/demo/image/upload/v1/codeCrafterX_portfolio/removed.jpg";
  const external = "https://images.example.com/external.jpg";

  assert.deepEqual(
    getRemovedPortfolioImageUrls(
      [retained, removed, external],
      [retained, "https://images.example.com/replacement.jpg"],
    ),
    [removed],
  );
});

test("deletePortfolioImages deletes each unique portfolio asset", async () => {
  const deleted: string[] = [];
  const image =
    "https://res.cloudinary.com/demo/image/upload/v1/codeCrafterX_portfolio/project.jpg";

  const publicIds = await deletePortfolioImages(
    [image, image, "https://images.example.com/external.jpg"],
    async (publicId) => {
      deleted.push(publicId);
      return { result: "ok" };
    },
  );

  assert.deepEqual(deleted, ["codeCrafterX_portfolio/project"]);
  assert.deepEqual(publicIds, ["codeCrafterX_portfolio/project"]);
});

test("deletePortfolioImages rejects unexpected Cloudinary results", async () => {
  const image =
    "https://res.cloudinary.com/demo/image/upload/v1/codeCrafterX_portfolio/project.jpg";

  await assert.rejects(
    deletePortfolioImages([image], async () => ({ result: "error" })),
    /Cloudinary delete failed/,
  );
});
