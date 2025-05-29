import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // <-- ADD THIS

export default defineConfig({
  plugins: [react()], // <-- AND THIS

  server: {
    host: true,
    allowedHosts: ["https://bvideo-caller.vercel.app/"],
  },
});
