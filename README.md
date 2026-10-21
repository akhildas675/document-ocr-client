# Document OCR Frontend

A responsive document-processing web application built with **React, TypeScript, Vite, and Tailwind CSS**. It allows users to upload document images, preview them, submit them for OCR processing, and view the extracted information.

The frontend is designed for document OCR workflows, with Aadhaar card recognition as the initial use case.

## Features

- **Document Upload:** Upload front and back images of a document.
- **Image Preview:** Preview selected images before processing.
- **Image Management:** Replace or remove selected images.
- **OCR Processing:** Send images to the backend API for text extraction.
- **Structured Results:** Display extracted information in an organized layout.
- **Loading and Error States:** Provide feedback during processing and when requests fail.
- **Responsive UI:** Support desktop and mobile screen sizes.
- **Type Safety:** Use TypeScript for safer development and maintainable code.

> Features are implemented progressively. This README describes the intended application functionality; only mark features as complete after testing them.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- ESLint

## Project Structure

```text
document-ocr-frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ImageUploader.tsx
│   │   ├── ImagePreview.tsx
│   │   ├── OcrResults.tsx
│   │   └── LoadingState.tsx
│   ├── pages/
│   │   └── HomePage.tsx
│   ├── services/
│   │   └── ocrService.ts
│   ├── types/
│   │   └── ocr.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── .gitignore
├── eslint.config.js
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

*Note: The structure above represents the planned organization. Add files as the application is developed.*

## Prerequisites

Install the following before running the project:

- Node.js (LTS version recommended)
- npm
- Git
- A running instance of the backend API

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/document-ocr-frontend.git
cd document-ocr-frontend
```

Replace `YOUR_USERNAME` with your GitHub username.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Change the URL to match your backend configuration.

Do not place API secrets, service-account credentials, or private keys in frontend environment variables. Variables prefixed with `VITE_` can be exposed in the browser.

### 4. Start the development server

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually `http://localhost:5173`.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and build the production application |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build locally |

## Backend Integration

The frontend communicates with the Document OCR API.

**Expected endpoint**

`POST /api/ocr/parse`

**Request format:** `multipart/form-data`

| Field | Type | Description |
|---|---|---|
| `frontImage` | File | Front-side document image |
| `backImage` | File | Back-side document image |

The backend processes the uploaded images and returns extracted text and structured data.

The endpoint and response format must match the actual backend implementation.

## Error Handling

The frontend should handle:

- Missing required images
- Unsupported file types
- Files exceeding the configured size limit
- Network errors and server failures
- OCR processing failures
- Empty or incomplete OCR results

Extracted information should be reviewed when OCR confidence is low or fields are missing.

## Testing

Before submitting, verify the following:

- Both images can be uploaded and previewed.
- Images can be replaced or removed.
- The processing action calls the backend.
- Loading and error states work correctly.
- OCR results are displayed correctly.
- The application works on desktop and mobile.
- The production build completes successfully.

Run the available checks:

```bash
npm run lint
npm run build
```

## Production Build

Create an optimized production build:

```bash
npm run build
```

The generated files will be available in the `dist/` directory.

To preview the build locally:

```bash
npm run preview
```

## Deployment

Deploy the frontend using a suitable static hosting provider, such as Vercel or Netlify.

Configure the production environment variable:

```env
VITE_API_BASE_URL=https://YOUR_BACKEND_DOMAIN/api
```

Replace the placeholder with your deployed backend URL. Ensure that the backend allows requests from the deployed frontend origin.

## Security and Privacy

- Do not expose backend credentials in frontend code.
- Avoid storing uploaded identity documents unnecessarily.
- Use fictional or redacted images during development and demonstrations.
- Do not log sensitive extracted document information.
- Do not claim document authenticity verification unless that capability has been implemented and tested.

## Future Improvements

- Support additional document types.
- Improve extracted-field presentation and review.
- Add image-quality validation.
- Add accessibility improvements.
- Add automated frontend tests.

## License

Add a license if you intend to distribute or reuse this project publicly.
