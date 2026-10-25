import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";

import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />

    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={10}
      containerStyle={{
        top: 20,
        right: 20,
      }}
      toastOptions={{
        duration: 3000,
        style: {
          background: "#18181b",
          color: "#f4f4f5",
          border: "1px solid #3f3f46",
          borderRadius: "12px",
          padding: "12px 16px",
          fontSize: "14px",
          maxWidth: "360px",
        },
        success: {
          iconTheme: {
            primary: "#22c55e",
            secondary: "#18181b",
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: "#ef4444",
            secondary: "#18181b",
          },
        },
        loading: {
          iconTheme: {
            primary: "#a78bfa",
            secondary: "#18181b",
          },
        },
      }}
    />
  </StrictMode>,
);