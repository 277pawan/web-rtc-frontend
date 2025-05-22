import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // <-- ADD THIS

export default defineConfig({
  plugins: [react()], // <-- AND THIS

  server: {
    host: true,
    allowedHosts: ["2c7b-122-186-71-238.ngrok-free.app"],
  },
});
