import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "path";
import { defineConfig } from "vite";

// Mantivemos seus plugins originais
const plugins = [react(), tailwindcss()];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),

  // 👇 AQUI ESTÁ A MÁGICA: Define que o código fonte mora em "client"
  root: path.resolve(import.meta.dirname, "client"),

  publicDir: path.resolve(import.meta.dirname, "client", "public"),

  build: {
    // 👇 AJUSTE IMPORTANTE: Mudei de 'dist/public' para apenas 'dist'
    // Isso facilita para a Vercel achar o site pronto.
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    host: true,
    allowedHosts: ["localhost", "127.0.0.1"],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
