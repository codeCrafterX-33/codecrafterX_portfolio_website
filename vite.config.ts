import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

const apiPort = process.env.API_PORT ?? "8787";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three", "@react-three/fiber", "@react-three/drei"],
          gsap: ["gsap", "@gsap/react"],
          router: ["react-router-dom"],
        },
      },
    },
  },
  server: {
    allowedHosts: ["carinulate-unevilly-rubin.ngrok-free.dev"],
    proxy: {
      "/api": {
        target: `http://localhost:${apiPort}`,
        changeOrigin: true,
      },
    },
    hmr: {
      overlay: true, // or false depending on your needs
    },
  },
});
