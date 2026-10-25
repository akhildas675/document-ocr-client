export interface OcrResponse {
  success: boolean;
  message?: string;
  frontText: string;
  backText?: string;
}