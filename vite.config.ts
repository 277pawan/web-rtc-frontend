import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // <-- ADD THIS

export default defineConfig({
  plugins: [react()],
});
