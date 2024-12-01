import { defineConfig } from "rolldown"

export default defineConfig({
  input: "./src/index.ts",
  treeshake: true,
  platform: "node",
  output: {
    dir: "./",
    file: "index.js",
    format: "esm",
    minify: true
  }
})