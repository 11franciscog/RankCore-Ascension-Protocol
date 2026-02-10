import base44 from "@base44/vite-plugin"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { fileURLToPath, URL } from "node:url"

export default defineConfig({
  plugins: [
    base44({
      legacySDKImports: process.env.BASE44_LEGACY_SDK_IMPORTS === "true",
      hmrNotifier: true,
      navigationNotifier: true,
      visualEditAgent: true,
    }),
    react(),
  ],

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  server: {
    host: "localhost",
    port: 5173,
  },
})
