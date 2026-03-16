import { defineConfig } from "@pandacss/dev";
import { gremlinPreset } from "./src/preset";

export default defineConfig({
  preflight: true,
  presets: [gremlinPreset],
  include: ["./src/**/*.{ts,tsx}"],
  exclude: [],
  outdir: "styled-system",
});
