import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@styled-system": resolve(__dirname, "styled-system"),
    },
  },
  plugins: [
    react(),
    dts({
      include: ["src/**/*"],
      exclude: ["**/*.stories.tsx", "**/*.test.tsx"],
    }),
  ],
  build: {
    sourcemap: true,
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        preset: resolve(__dirname, "src/preset.ts"),
      },
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "@radix-ui/react-slot",
        "@floating-ui/react-dom",
        "@pandacss/dev",
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
      },
    },
  },
});
