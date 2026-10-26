
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

import type { OcrResponse } from "../types";
import ocrServices from "../services/ocr-services";
import Navbar from "../components/layout/navbar";
import ImageUploadCard from "../components/upload/image-upload.card";

function DashboardPage() {
  const [frontImage, setFrontImage] = useState<Blob | null>(null);
  const [backImage, setBackImage] = useState<Blob | null>(null);
  const [showSecondImage, setShowSecondImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OcrResponse | null>(null);

  function handleSecondImageToggle() {
    if (showSecondImage) {
      setBackImage(null);
    }

    setResult(null);
    setShowSecondImage((visible) => !visible);
  }

  async function handleExtractText() {
    if (!frontImage) {
      toast.error("Please upload and crop the first image.");
      return;
    }

    if (loading) return;

    const formData = new FormData();

    formData.append("frontImage", frontImage, "front.png");

    if (showSecondImage && backImage) {
      formData.append("backImage", backImage, "back.png");
    }

    const toastId = toast.loading("Extracting document text...");

    try {
      setLoading(true);
      setResult(null);

      const response = await ocrServices.extractDocumentText(formData);

      setResult(response);

      toast.success("Text extracted successfully!", {
        id: toastId,
      });
    } catch (err: unknown) {
      let message = "Unable to extract text. Please try again.";

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

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <section className="mx-auto mb-8 max-w-2xl text-center">
          <h1 className="mb-3 text-xs font-semibold uppercase tracking-widest text-violet-400 sm:text-sm">
            Document text extraction
          </h1>

      

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
            Upload a document, select the important area, and extract
            readable text.
          </p>
        </section>

        <section className="mx-auto max-w-3xl">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Your documents</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Upload one image or include a second side.
            </p>
          </div>

          <div className="space-y-4">
            <ImageUploadCard
              title="First image"
              description="Select and crop the main document image."
              required
              onImageCropped={(image) => {
                setFrontImage(image);
                setResult(null);
              }}
            />

            {showSecondImage && (
              <ImageUploadCard
                title="Second image"
                description="Select and crop the other side or page."
                onImageCropped={(image) => {
                  setBackImage(image);
                  setResult(null);
                }}
              />
            )}
          </div>

          <button
            type="button"
            onClick={handleSecondImageToggle}
            className="mt-4 text-sm font-medium text-violet-300 hover:text-violet-200"
          >
            {showSecondImage
              ? "− Remove second image"
              : "+ Add another image"}
          </button>

          <button
            type="button"
            onClick={handleExtractText}
            disabled={!frontImage || loading}
            className="mt-5 flex w-full items-center justify-center rounded-lg bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Extracting text..." : "Extract text →"}
          </button>

          {result && (
            <section className="mt-6 space-y-4">
              <h2 className="text-lg font-semibold">Extracted text</h2>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 sm:p-5">
                <h3 className="mb-2 text-sm font-medium text-zinc-300">
                  First image
                </h3>

                <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-6 text-zinc-100">
                  {result.frontText}
                </pre>
              </div>

              {result.backText != null && (
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 sm:p-5">
                  <h3 className="mb-2 text-sm font-medium text-zinc-300">
                    Second image
                  </h3>

                  <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-6 text-zinc-100">
                    {result.backText}
                  </pre>
                </div>
              )}
            </section>
          )}
        </section>
      </main>
    </div>
  );
}

export default DashboardPage;
