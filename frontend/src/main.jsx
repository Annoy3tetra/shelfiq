import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";

import "./index.css";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            border: "1px solid #E2E8F0",
            borderRadius: "8px",
            boxShadow: "0 16px 40px rgba(15,23,42,0.12)",
            color: "#0F172A",
          },
        }}
      />
    </AuthProvider>
  </StrictMode>
);
