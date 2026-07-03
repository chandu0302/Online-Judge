import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "online-judge-m6vtxwo6z-chandu0302.vercel.app",
        changeOrigin: true,
      },
    },
  },
});
