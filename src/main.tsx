import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
// Tipografías autoalojadas (sin peticiones a Google: mejor LCP y RGPD)
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/poppins/latin-600.css";
import "@fontsource/poppins/latin-700.css";
import "@fontsource/poppins/latin-800.css";
import "@fontsource/poppins/latin-900.css";
import "@fontsource/poppins/latin-800-italic.css";
import "./styles/base.css";

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
