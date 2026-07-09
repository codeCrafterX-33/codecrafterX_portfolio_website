export const portfolioCloudinaryFolder = "codeCrafterX_portfolio";

type CloudinaryDestroyResult = {
  result?: string;
};

type DestroyImage = (
  publicId: string,
) => Promise<CloudinaryDestroyResult>;

export const extractCloudinaryPublicId = (imageUrl: string) => {
  try {
    const parsedUrl = new URL(imageUrl);
    const uploadPath = "/image/upload/";
    const uploadIndex = parsedUrl.pathname.indexOf(uploadPath);

    if (uploadIndex === -1) {
      return null;
    }

    const assetPath = parsedUrl.pathname.slice(uploadIndex + uploadPath.length);
    const segments = assetPath.split("/").filter(Boolean);
    const versionIndex = segments.findIndex((segment) => /^v\d+$/.test(segment));
    const publicIdSegments =
      versionIndex >= 0 ? segments.slice(versionIndex + 1) : segments;

    if (!publicIdSegments.length) {
      return null;
    }

    return decodeURIComponent(
      publicIdSegments.join("/").replace(/\.[^.]+$/, ""),
    );
  } catch {
    return null;
  }
};

export const isPortfolioPublicId = (publicId: string) =>
  publicId.startsWith(`${portfolioCloudinaryFolder}/`);

export const getRemovedPortfolioImageUrls = (
  previousImages: string[],
  nextImages: string[],
) => {
  const nextImageSet = new Set(nextImages);

  return Array.from(
    new Set(
      previousImages.filter((imageUrl) => {
        if (nextImageSet.has(imageUrl)) {
          return false;
        }

        const publicId = extractCloudinaryPublicId(imageUrl);
        return Boolean(publicId && isPortfolioPublicId(publicId));
      }),
    ),
  );
};

export const deletePortfolioImages = async (
  imageUrls: string[],
  destroyImage: DestroyImage,
) => {
  const publicIds = Array.from(
    new Set(
      imageUrls
        .map(extractCloudinaryPublicId)
        .filter(
          (publicId): publicId is string =>
            Boolean(publicId) && isPortfolioPublicId(publicId),
        ),
    ),
  );

  await Promise.all(
    publicIds.map(async (publicId) => {
      const result = await destroyImage(publicId);

      if (result.result !== "ok" && result.result !== "not found") {
        throw new Error(
          `Cloudinary delete failed for ${publicId} with result: ${
            result.result ?? "unknown"
          }`,
        );
      }
    }),
  );

  return publicIds;
};
