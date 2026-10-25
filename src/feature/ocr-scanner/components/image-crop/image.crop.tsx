
import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";

interface ImageCropperProps {
  image: string;
  onCancel: () => void;
  onCropComplete: (croppedImage: Blob) => void;
}

interface CroppedArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

function createCroppedImage(
  imageSrc: string,
  crop: CroppedArea,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        reject(new Error("Could not create image canvas."));
        return;
      }

      canvas.width = Math.round(crop.width);
      canvas.height = Math.round(crop.height);

      context.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        canvas.width,
        canvas.height,
      );

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Could not crop the image."));
          }
        },
        "image/jpeg",
        0.92,
      );
    };

    image.onerror = () => {
      reject(new Error("Could not load the image."));
    };

    image.src = imageSrc;
  });
}

function ImageCropper({
  image,
  onCancel,
  onCropComplete,
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<CroppedArea | null>(null);
  const [error, setError] = useState("");
  const [isCropping, setIsCropping] = useState(false);

  const handleCropComplete = useCallback(
    (_croppedArea: unknown, croppedPixels: CroppedArea) => {
      setCroppedAreaPixels(croppedPixels);
    },
    [],
  );

  async function handleConfirmCrop() {
    if (!croppedAreaPixels || isCropping) return;

    try {
      setIsCropping(true);
      setError("");

      const blob = await createCroppedImage(image, croppedAreaPixels);
      onCropComplete(blob);
    } catch {
      setError("Unable to crop this image. Please try again.");
    } finally {
      setIsCropping(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative h-80 overflow-hidden rounded-xl bg-black">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          minZoom={1}
          maxZoom={4}
          aspect={undefined}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={handleCropComplete}
          restrictPosition={false}
          zoomWithScroll
          showGrid={false}
        />
      </div>

      <p className="text-xs text-zinc-500">
        Drag the image to position it. Use the mouse wheel or trackpad to zoom.
      </p>

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isCropping}
          className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleConfirmCrop}
          disabled={!croppedAreaPixels || isCropping}
          className="rounded-lg bg-violet-500 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isCropping ? "Cropping..." : "Confirm crop"}
        </button>
      </div>
    </div>
  );
}

export default ImageCropper;
