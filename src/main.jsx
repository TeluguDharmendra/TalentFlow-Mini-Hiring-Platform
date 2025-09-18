import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AppProvider } from "./contexts/AppContext.jsx";
import "./index.css";

// Enable MSW (Mock Service Worker) only in development
async function startMockWorker() {
  if (import.meta.env.MODE !== "development") return;

  try {
    const { worker } = await import("./mocks/browser.js");
    await worker.start({
      onUnhandledRequest: "bypass", // Ignore requests without handlers
    });
    console.log("✅ Mock Service Worker started");
  } catch (err) {
    console.error("❌ Failed to start Mock Service Worker:", err);
  }
}

// Initialize the app
async function initApp() {
  await startMockWorker();

  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error("❌ Root element #root not found in index.html");
    return;
  }

  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter>
        <AppProvider>
          <App />
        </AppProvider>
      </BrowserRouter>
    </StrictMode>
  );
}

initApp();

