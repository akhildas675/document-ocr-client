# Document OCR Frontend

A responsive web application built with React, TypeScript, and Vite for uploading document images and displaying OCR-extracted information.

## Features

- Upload front and back document images.
- Preview and replace uploaded images.
- Process images through the backend OCR API.
- Display extracted information in an organized layout.
- Provide loading and error feedback.
- Responsive user interface.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios

## Installation

```bash
git clone <frontend-repository-url>
cd document-ocr-frontend
npm install
```

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Update the URL according to your backend configuration.

## Run Locally

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Project Status

Developed as part of a machine task to demonstrate document image uploads and OCR result presentation.
