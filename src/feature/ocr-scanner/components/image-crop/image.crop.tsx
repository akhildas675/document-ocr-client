import { useRef, useState } from "react";
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
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [crop, setCrop] = useState<PercentCrop>(INITIAL_CROP);
  const [rotation, setRotation] = useState(0);
  const [busy, setBusy] = useState(false);

  function rotateLeft() {
    setRotation((current) => (current - 90 + 360) % 360);
    setCrop(INITIAL_CROP);
  }

  function rotateRight() {
    setRotation((current) => (current + 90) % 360);
    setCrop(INITIAL_CROP);
  }
  async function handleCrop() {
    const img = imageRef.current;

    if (
      !img ||
      !img.complete ||
      !img.naturalWidth ||
      !img.naturalHeight ||
      !crop.width ||
      !crop.height ||
      busy
    ) {
      return;
    }

    setBusy(true);

    try {
   
      const sourceCanvas = document.createElement("canvas");
      const sourceContext = sourceCanvas.getContext("2d");

      if (!sourceContext) {
        throw new Error("Unable to create image canvas.");
      }

      const angle = (rotation * Math.PI) / 180;
      const swapsDimensions = rotation === 90 || rotation === 270;

      sourceCanvas.width = swapsDimensions
        ? img.naturalHeight
        : img.naturalWidth;

      sourceCanvas.height = swapsDimensions
        ? img.naturalWidth
        : img.naturalHeight;

      sourceContext.translate(
        sourceCanvas.width / 2,
        sourceCanvas.height / 2
      );
      sourceContext.rotate(angle);

      sourceContext.drawImage(
        img,
        -img.naturalWidth / 2,
        -img.naturalHeight / 2
      );

 
      const sx = (crop.x / 100) * sourceCanvas.width;
      const sy = (crop.y / 100) * sourceCanvas.height;
      const sw = (crop.width / 100) * sourceCanvas.width;
      const sh = (crop.height / 100) * sourceCanvas.height;

      const outputCanvas = document.createElement("canvas");
      outputCanvas.width = Math.max(1, Math.round(sw));
      outputCanvas.height = Math.max(1, Math.round(sh));

      const outputContext = outputCanvas.getContext("2d");

      if (!outputContext) {
        throw new Error("Unable to create crop canvas.");
      }

      outputContext.drawImage(
        sourceCanvas,
        sx,
        sy,
        sw,
        sh,
        0,
        0,
        outputCanvas.width,
        outputCanvas.height
      );

      const blob = await new Promise<Blob>((resolve, reject) => {
        outputCanvas.toBlob(
          (result) => {
            if (result) resolve(result);
            else reject(new Error("Unable to crop image."));
          },
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
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={rotateLeft}
          disabled={busy}
          className="rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800 disabled:opacity-50"
        >
          ↶ Rotate left
        </button>

        <button
          type="button"
          onClick={rotateRight}
          disabled={busy}
          className="rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800 disabled:opacity-50"
        >
          ↷ Rotate right
        </button>
      </div>

      <div className="max-h-[65vh] overflow-auto rounded-lg bg-gray-100 p-2">
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          minWidth={5}
          minHeight={5}
        >
          <img
            ref={imageRef}
            src={image}
            alt="Rotate and crop the document image"
            style={{
              transform: `rotate(${rotation}deg)`,
              transformOrigin: "center center",
              maxWidth: "100%",
              maxHeight: "60vh",
              width: "auto",
              height: "auto",
              display: "block",
            }}
          />
        </ReactCrop>
      </div>

      <p className="text-sm text-zinc-400">
        Rotate the image until the text is upright, then adjust the crop area.
      </p>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleCrop}
          disabled={busy}
          className="rounded-lg bg-violet-500 px-4 py-2 text-white disabled:opacity-50"
        >
          {busy ? "Processing..." : "Crop and Continue"}
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