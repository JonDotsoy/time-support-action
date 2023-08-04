import type { RollupOptions } from "rollup";
import typescript from "@rollup/plugin-typescript";

const config: RollupOptions = {
  plugins: [typescript()],
  external: [],
  input: {
    action: "action.ts",
    index: "index.ts",
  },
  output: {
    format: "cjs",
    sourcemap: true,
    dir: ".",
  },
};

export default config;
