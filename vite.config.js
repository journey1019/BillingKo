import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"; // Node.js의 path 모듈

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // "@"를 "src" 디렉토리로 매핑
      "@mui/x-date-pickers": "@mui/x-date-pickers",
    },
  },
  server: {
    historyApiFallback: true, // History 모드 활성화
  },
});
