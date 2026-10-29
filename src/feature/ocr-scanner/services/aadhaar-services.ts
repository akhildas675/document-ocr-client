
import api from "../../../config/api";
import {
  AADHAAR_ROUTE,
  BASE_ROUTE,
} from "../../../constant/routes.constant";
import type { OcrResponse } from "../types";

class AadhaarService {
  async extractDocumentText(
    formData: FormData
  ): Promise<OcrResponse> {
    const response = await api.post<OcrResponse>(
      `${BASE_ROUTE.BASE}${AADHAAR_ROUTE.UPLOAD_IMAGE}`,
      formData
    );

    return response.data;
  }
}

export default new AadhaarService();
