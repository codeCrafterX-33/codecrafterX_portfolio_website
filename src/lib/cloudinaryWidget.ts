import { apiUrl } from "./projectsApi";

type CloudinaryConfigResponse = {
  cloudName: string;
  folder: string;
  uploadPreset: string;
};

type CloudinaryUploadInfo = {
  secure_url?: string;
  [key: string]: unknown;
};

type CloudinaryWidgetResult = {
  event: string;
  info?: {
    secure_url?: string;
    files?: Array<{ uploadInfo?: CloudinaryUploadInfo }>;
    [key: string]: unknown;
  };
};

type CloudinaryWidgetInstance = {
  open: () => void;
  close: () => void;
  destroy: () => void;
};

declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        options: Record<string, unknown>,
        callback: (error: unknown, result: CloudinaryWidgetResult) => void,
      ) => CloudinaryWidgetInstance;
    };
  }
}

let widgetScriptPromise: Promise<void> | null = null;

export const loadCloudinaryWidget = () => {
  if (window.cloudinary) {
    return Promise.resolve();
  }

  if (widgetScriptPromise) {
    return widgetScriptPromise;
  }

  widgetScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-cloudinary-widget="true"]',
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => {
        reject(new Error("Unable to load Cloudinary widget."));
      });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://upload-widget.cloudinary.com/global/all.js";
    script.async = true;
    script.defer = true;
    script.dataset.cloudinaryWidget = "true";
    script.onload = () => resolve();
    script.onerror = () => {
      widgetScriptPromise = null;
      reject(new Error("Unable to load Cloudinary widget."));
    };
    document.head.appendChild(script);
  });

  return widgetScriptPromise;
};

export const fetchCloudinaryConfig = async (
): Promise<CloudinaryConfigResponse> => {
  const response = await fetch(apiUrl("/api/cloudinary/config"));

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error ?? "Unable to load Cloudinary config.");
  }

  return response.json() as Promise<CloudinaryConfigResponse>;
};

export type {
  CloudinaryConfigResponse,
  CloudinaryWidgetInstance,
  CloudinaryWidgetResult,
};
