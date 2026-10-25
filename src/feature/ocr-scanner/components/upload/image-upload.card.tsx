
import { useState } from "react";
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
        reject(new Error("Unable to read the image."));
      }
    };

    reader.onerror = () => {
      reject(new Error("Unable to read the image."));
    };

    reader.readAsDataURL(file);
  });
}

function ImageUploadCard({
  title,
  description,
  required = false,
  onImageCropped,
}: ImageUploadCardProps) {
  const [cropUrl, setCropUrl] = useState<string | null>(null);
  const [croppedFile, setCroppedFile] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const selectedFile = event.target.files?.[0];
    event.target.value = "";

    if (!selectedFile) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

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

      const imageDataUrl = await readImageAsDataUrl(selectedFile);

      setCroppedFile(null);
      setPreviewUrl(null);
      setCropUrl(imageDataUrl);
      onImageCropped(null);
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
    toast.success("Image removed.");
  }

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium text-zinc-100">{title}</h3>
          <p className="mt-1 text-sm text-zinc-500">{description}</p>
        </div>

        <span className="rounded-full border border-zinc-700 px-2.5 py-1 text-xs text-zinc-400">
          {required ? "Required" : "Optional"}
        </span>
      </div>

      {cropUrl ? (
        <ImageCrop
          image={cropUrl}
          onCancel={handleCancelCrop}
          onCropComplete={handleCropComplete}
        />
      ) : previewUrl && croppedFile ? (
        <div>
          <img
            src={previewUrl}
            alt="Preview of cropped document"
            className="max-h-64 w-full rounded-xl object-contain"
          />

          <div className="mt-4 flex items-center justify-between gap-3">
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
          className={`flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-950/60 p-8 text-center ${
            isReading
              ? "cursor-wait opacity-60"
              : "cursor-pointer hover:border-violet-400/60"
          }`}
        >
          <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 text-2xl text-violet-300">
            +
          </span>

          <span className="font-medium text-zinc-200">
            {isReading ? "Reading image..." : "Choose an image"}
          </span>

          <span className="mt-2 text-sm text-zinc-500">
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
