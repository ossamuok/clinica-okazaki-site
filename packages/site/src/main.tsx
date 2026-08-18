import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { MotionConfig } from "framer-motion";
import "./index.css";
import App from "./App";
import { WhatsAppPickerProvider } from "./components/WhatsAppPicker";

const rootEl = document.getElementById("root")!;
const AppTree = (
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <MotionConfig reducedMotion="user">
          <WhatsAppPickerProvider>
            <App />
          </WhatsAppPickerProvider>
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
