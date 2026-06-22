import { ImagePlus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchCloudinaryConfig,
  loadCloudinaryWidget,
  type CloudinaryWidgetInstance,
  type CloudinaryWidgetResult,
} from "../lib/cloudinaryWidget";

type ImageUploadProps = {
  value: string[];
  disabled?: boolean;
  single?: boolean;
  multiple?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void | Promise<void>;
  onUploadSuccess?: (value: string) => Promise<void> | void;
  onError?: (message: string) => void;
};

const ImageUpload = ({
  value,
  disabled,
  single,
  multiple,
  onChange,
  onRemove,
  onUploadSuccess,
  onError,
}: ImageUploadProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const widgetRef = useRef<CloudinaryWidgetInstance | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setIsMounted(true);
    }, 0);

    return () => {
      window.clearTimeout(timeout);
      widgetRef.current?.destroy();
      widgetRef.current = null;
    };
  }, []);

  const allowMultiple = multiple ?? !single;
  const isUploadDisabled = disabled || isUploading || (!allowMultiple && value.length > 0);

  const openWidget = useCallback(async () => {
    try {
      setIsUploading(true);
      const [config] = await Promise.all([
        fetchCloudinaryConfig(),
        loadCloudinaryWidget(),
      ]);

      const widget = window.cloudinary?.createUploadWidget(
        {
          cloudName: config.cloudName,
          uploadPreset: config.uploadPreset,
          folder: config.folder,
          multiple: allowMultiple,
          resourceType: "image",
          sources: ["local", "url", "camera"],
          maxFiles: allowMultiple ? 10 : 1,
        },
        (_error: unknown, result: CloudinaryWidgetResult) => {
          if (result.event === "success") {
            const uploadedUrl = result.info?.secure_url;
            if (uploadedUrl) {
              onChange(uploadedUrl);
              void onUploadSuccess?.(uploadedUrl);
            }
          }

          if (result.event === "queues-end" || result.event === "close") {
            setIsUploading(false);
            widgetRef.current = null;
          }
        },
      );

      if (!widget) {
        throw new Error("Unable to open Cloudinary widget.");
      }

      widgetRef.current = widget;
      widget.open();
    } catch (error) {
      setIsUploading(false);
      onError?.(
        error instanceof Error ? error.message : "Unable to upload images.",
      );
    }
  }, [allowMultiple, onChange, onError, onUploadSuccess]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-w-0 space-y-3">
      <button
        type="button"
        onClick={() => void openWidget()}
        disabled={isUploadDisabled}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800 transition hover:border-emerald-500 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200 dark:hover:bg-emerald-500/20"
      >
        <ImagePlus size={14} />
        {isUploading ? "Opening Cloudinary..." : "Upload with Cloudinary"}
      </button>

      {value.length > 0 && (
        <div className="grid min-w-0 gap-3 sm:grid-cols-2">
          {value.map((url) => (
            <div
              key={url}
              className="min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-zinc-900"
            >
              <div className="relative aspect-video bg-slate-100 dark:bg-zinc-800">
                <img
                  src={url}
                  alt="Project upload preview"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex min-w-0 items-center justify-between gap-3 p-3">
                <span className="min-w-0 truncate text-xs font-semibold text-slate-500 dark:text-gray-400">
                  {url}
                </span>
                <button
                  type="button"
                  onClick={() => void onRemove(url)}
                  className="inline-flex shrink-0 items-center justify-center rounded-full bg-red-600 p-2 !text-white transition hover:bg-red-700"
                  aria-label="Remove uploaded image"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
