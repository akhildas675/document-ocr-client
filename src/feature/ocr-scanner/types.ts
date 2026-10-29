
export interface FrontImageDetails {
  name: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  aadhaarNumber: string | null;
}

export interface BackImageDetails {
  address: string | null;
  pinCode: string | null;
}

export interface AadhaarValidation {
  name: boolean;
  dateOfBirth: boolean;
  gender: boolean;
  aadhaarNumber: boolean;
  address: boolean;
  pinCode: boolean;
}

export interface OcrResponse {
  success: boolean;
  message: string;
  data: {
    frontImage: FrontImageDetails;
    backImage: BackImageDetails;
    validation: AadhaarValidation;
  };
}
