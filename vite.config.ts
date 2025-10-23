import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const base = command === "serve" ? "/" : "/color-converter/";

  return {
    plugins: [react()],
    base: base,
    build: {
      outDir: "dist",
      assetsDir: "assets",
    },
  };
});
