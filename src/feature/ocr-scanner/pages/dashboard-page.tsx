
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

import type { OcrResponse } from "../types";
import Navbar from "../components/layout/navbar";
import ImageUploadCard from "../components/upload/image-upload.card";
import aadhaarServices from "../services/aadhaar-services";

function DashboardPage() {
  const [frontImage, setFrontImage] = useState<Blob | null>(null);
  const [backImage, setBackImage] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OcrResponse | null>(null);

  async function handleExtractText() {
    if (!frontImage || !backImage) {
      toast.error("Please upload and crop both Aadhaar sides.");
      return;
    }

    if (loading) return;

    const formData = new FormData();
    formData.append("frontImage", frontImage, "front.png");
    formData.append("backImage", backImage, "back.png");

    const toastId = toast.loading("Extracting Aadhaar details...");

    try {
      setLoading(true);
      setResult(null);

      const response =
        await aadhaarServices.extractDocumentText(formData);

      setResult(response);

      toast.success(
        response.message || "Aadhaar details extracted successfully.",
        { id: toastId }
      );
    } catch (err: unknown) {
      let message = "Unable to extract Aadhaar details. Please try again.";

      if (axios.isAxiosError(err)) {
        message =
          err.response?.data?.message ??
          (err.request
            ? "Unable to connect to the server."
            : err.message || message);
      } else if (err instanceof Error) {
        message = err.message;
      }

      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  const data = result?.data;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
        <section className="mx-auto mb-6 max-w-xl text-center">
          <h1 className="text-xs font-semibold uppercase tracking-widest text-violet-400 sm:text-sm">
            Aadhaar information extraction
          </h1>

          <p className="mx-auto mt-2 text-sm leading-5 text-zinc-400">
            Upload both sides of your Aadhaar card to extract the available
            details.
          </p>
        </section>

        {/* Upload boxes: left and right */}
        <section className="mx-auto max-w-4xl">
          <div className="mb-3">
            <h2 className="text-base font-semibold">Upload Aadhaar images</h2>
            <p className="mt-1 text-xs text-zinc-400">
              Both front and back images are required.
            </p>
          </div>

          <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
            <ImageUploadCard
              title="Front side"
              description="Upload and crop the front side."
              required
              onImageCropped={(image) => {
                setFrontImage(image);
                setResult(null);
              }}
            />

            <ImageUploadCard
              title="Back side"
              description="Upload and crop the back side."
              required
              onImageCropped={(image) => {
                setBackImage(image);
                setResult(null);
              }}
            />
          </div>

          {/* Centered button below both upload boxes */}
          <div className="mt-5 flex justify-center">
            <button
              type="button"
              onClick={handleExtractText}
              disabled={!frontImage || !backImage || loading}
              className="w-full rounded-lg bg-violet-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-64"
            >
              {loading
                ? "Extracting details..."
                : "Extract Aadhaar Details →"}
            </button>
          </div>
        </section>

        {/* Extracted details below the upload section */}
        {data && (
          <section className="mx-auto mt-8 max-w-4xl">
            <div className="mb-4">
              <h2 className="text-base font-semibold">Extracted details</h2>
              <p className="mt-1 text-xs text-zinc-400">
                Review the details. OCR results may contain errors.
              </p>
            </div>

            <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
                <h3 className="mb-3 text-sm font-semibold">Front side</h3>

                <div className="space-y-3">
                  <DetailRow label="Name" value={data.frontImage.name} />
                  <DetailRow
                    label="Date of birth"
                    value={data.frontImage.dateOfBirth}
                  />
                  <DetailRow label="Gender" value={data.frontImage.gender} />
                  <DetailRow
                    label="Aadhaar number"
                    value={data.frontImage.aadhaarNumber}
                  />
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
                <h3 className="mb-3 text-sm font-semibold">Back side</h3>

                <div className="space-y-3">
                  <DetailRow label="Address" value={data.backImage.address} />
                  <DetailRow label="PIN code" value={data.backImage.pinCode} />
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

interface DetailRowProps {
  label: string;
  value: string | null;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="grid grid-cols-[105px_minmax(0,1fr)] gap-3 border-b border-zinc-800 pb-2 last:border-0 last:pb-0">
      <span className="text-xs text-zinc-400">{label}</span>
      <span className="break-words text-sm text-zinc-100">
        {value || "Not detected"}
      </span>
    </div>
  );
}

export default DashboardPage;
