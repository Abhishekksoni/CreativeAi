import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/auth": {
        target: "http://localhost:8000",  // Your backend server
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
