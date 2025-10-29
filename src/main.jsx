// src/main.jsx (modifica el tuyo)
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./components/dashboard.css";
import { AuthProvider } from "./context/AuthContext";

// 🧩 Versión sin StrictMode (para evitar doble render en desarrollo)
ReactDOM.createRoot(document.getElementById("root")).render(
 // <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  // </React.StrictMode>
);