import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { TempoDevtools } from "tempo-devtools";

// Initialize Tempo Devtools
TempoDevtools.init();

// Get the root element and render the App
const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App />);
} else {
  console.error("Root element not found");
}
