// src/App.tsx

import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { router } from "./app/router";

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#1e293b",
            borderRadius: "12px",
            padding: "16px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            fontSize: "14px",
            fontWeight: "500",
          },
          success: {
            iconTheme: {
              primary: "#4CAF50",
              secondary: "#fff",
            },
            style: {
              borderLeft: "4px solid #4CAF50",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
            style: {
              borderLeft: "4px solid #ef4444",
            },
          },
        }}
      />

      <RouterProvider router={router} />
    </>
  );
}
