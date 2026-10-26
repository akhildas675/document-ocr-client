
import { useState } from "react";
import ReactCrop, {
  type PercentCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface ImageCropProps {
  image: string;
  onCropComplete: (image: Blob) => void;
  onCancel?: () => void;
}

const INITIAL_CROP: PercentCrop = {
  unit: "%",
  x: 5,
  y: 5,
  width: 90,
  height: 90,
};

function ImageCrop({
  image,
  onCropComplete,
  onCancel,
}: ImageCropProps) {
  const imageRef = useState<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<PercentCrop>(INITIAL_CROP);
  const [busy, setBusy] = useState(false);

  async function handleCrop() {
    const img = imageRef[0];

    if (
      !img ||
      !img.complete ||
      !crop.width ||
      !crop.height ||
      busy
    ) {
      return;
    }

    setBusy(true);

    try {
      const scaleX = img.naturalWidth / 100;
      const scaleY = img.naturalHeight / 100;

      const sx = Math.max(0, crop.x * scaleX);
      const sy = Math.max(0, crop.y * scaleY);
      const sw = Math.min(img.naturalWidth - sx, crop.width * scaleX);
      const sh = Math.min(img.naturalHeight - sy, crop.height * scaleY);

      const canvas = document.createElement("canvas");
      canvas.width = Math.round(sw);
      canvas.height = Math.round(sh);

      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Unable to create crop canvas.");
      }

      context.drawImage(
        img,
        sx,
        sy,
        sw,
        sh,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (result) =>
            result
              ? resolve(result)
              : reject(new Error("Unable to crop image.")),
          "image/png"
        );
      });

      onCropComplete(blob);
    } catch (error) {
      console.error("Crop failed:", error);
      window.alert("Unable to crop the image. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="max-h-[65vh] overflow-auto rounded-lg bg-gray-100 p-2">
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          minWidth={5}
          minHeight={5}
        >
          <img
            ref={(element) => {
              imageRef[1](element);
            }}
            src={image}
            alt="Select the document area to crop"
            className="block max-h-[60vh] max-w-full object-contain"
          />
        </ReactCrop>
      </div>

      <p className="text-sm text-zinc-400">
        Drag the corners and edges to adjust the crop area precisely.
      </p>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleCrop}
          disabled={busy}
          className="rounded-lg bg-violet-500 px-4 py-2 text-white disabled:opacity-50"
        >
          {busy ? "Cropping..." : "Crop and Continue"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-zinc-200"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

export default ImageCrop;
