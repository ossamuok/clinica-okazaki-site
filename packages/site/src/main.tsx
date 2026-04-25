import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { MotionConfig } from "framer-motion";
import "./index.css";
import App from "./App";

const rootEl = document.getElementById("root")!;
const AppTree = (
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <MotionConfig reducedMotion="user">
          <App />
        </MotionConfig>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);

if (rootEl.hasChildNodes()) {
  hydrateRoot(rootEl, AppTree);
} else {
  createRoot(rootEl).render(AppTree);
}
