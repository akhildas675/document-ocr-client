import api from "../../../config/api";
import type { OcrResponse } from "../types";


class OcrService {
  async extractDocumentText(
    formData: FormData,
  ): Promise<OcrResponse> {
    const response = await api.post<OcrResponse>(
      "/api/ocr/parse",
      formData,
    );

    return response.data;
  }
}

export default new OcrService();
