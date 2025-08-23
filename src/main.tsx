import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Obtén el elemento de forma segura
const rootElement = document.getElementById("root");

// Verifica SI el elemento existe antes de renderizar
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
} else {
  console.error("Failed to find the root element. Check your index.html file.");
}
