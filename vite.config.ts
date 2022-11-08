import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: ["ES2020"],
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "ES2020",
    },
  },
});
