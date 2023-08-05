import type { RollupOptions } from "rollup";
import typescript from "@rollup/plugin-typescript";

const config: RollupOptions = {
  plugins: [typescript({
    target: "es2015",
  })],
  external: [],
  input: ["action.ts", "index.ts", "append-supported-tags.ts", "fill-document.ts"],
  output: {
    format: "cjs",
    sourcemap: true,
    dir: ".",
  },
};

export default config;
