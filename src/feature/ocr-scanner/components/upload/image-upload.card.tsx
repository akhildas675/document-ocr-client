
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import ImageCrop from "../image-crop/image.crop";

interface ImageUploadCardProps {
  title: string;
  description: string;
  required?: boolean;
  onImageCropped: (image: Blob | null) => void;
}

function readImageAsDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Unable to read image."));
      }
    };

    reader.onerror = () => reject(new Error("Unable to read image."));
    reader.readAsDataURL(file);
  });
}

function ImageUploadCard({
  title,
  description,
  onImageCropped,
}: ImageUploadCardProps) {
  const [cropUrl, setCropUrl] = useState<string | null>(null);
  const [croppedFile, setCroppedFile] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    return () => {
      if (cropUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(cropUrl);
      }

      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [cropUrl, previewUrl]);

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile = event.target.files?.[0];
    event.target.value = "";

    if (!selectedFile) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error("Select a JPEG, PNG, or WebP image.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("The image must be 5 MB or smaller.");
      return;
    }

    try {
      setIsReading(true);

      // Release the previous cropped image from the dashboard.
      onImageCropped(null);

      const imageDataUrl = await readImageAsDataUrl(selectedFile);

      setCroppedFile(null);
      setPreviewUrl(null);
      setCropUrl(imageDataUrl);
    } catch {
      toast.error("Unable to read the selected image.");
    } finally {
      setIsReading(false);
    }
  }

  async function handleCropComplete(image: Blob) {
    try {
      const imageDataUrl = await readImageAsDataUrl(image);

      setCroppedFile(image);
      setPreviewUrl(imageDataUrl);
      setCropUrl(null);

      onImageCropped(image);
      toast.success("Image cropped successfully.");
    } catch {
      toast.error("Unable to prepare the cropped image.");
    }
  }

  function handleCancelCrop() {
    setCropUrl(null);
  }

  function handleRemove() {
    setCropUrl(null);
    setCroppedFile(null);
    setPreviewUrl(null);
    onImageCropped(null);
  }

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-100">
            {title}
          </h3>
          <p className="mt-1 text-sm text-zinc-400">
            {description}
          </p>
        </div>

        
      </div>

      {cropUrl ? (
        <ImageCrop
          image={cropUrl}
          onCropComplete={handleCropComplete}
          onCancel={handleCancelCrop}
        />
      ) : previewUrl && croppedFile ? (
        <div>
          <img
            src={previewUrl}
            alt="Cropped document preview"
            className="mx-auto max-h-64 w-full rounded-lg bg-zinc-950 object-contain"
          />

          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-sm text-emerald-400">
              Cropped image ready
            </p>

            <button
              type="button"
              onClick={handleRemove}
              className="text-sm text-violet-300 hover:text-violet-200"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <label
          className={`flex min-h-36 flex-col items-center justify-center rounded-lg border border-dashed border-zinc-700 bg-zinc-950/60 p-6 text-center transition ${
            isReading
              ? "cursor-wait opacity-60"
              : "cursor-pointer hover:border-violet-400/60"
          }`}
        >
          <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-xl text-violet-300">
            +
          </span>

          <span className="text-sm font-medium text-zinc-200">
            {isReading ? "Reading image..." : "Choose an image"}
          </span>

          <span className="mt-1 text-xs text-zinc-400">
            JPEG, PNG, or WebP · Maximum 5 MB
          </span>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={isReading}
            className="sr-only"
          />
        </label>
      )}
    </section>
  );
}

export default ImageUploadCard;
