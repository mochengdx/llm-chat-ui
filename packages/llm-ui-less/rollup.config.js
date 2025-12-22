import path from "path";
import { fileURLToPath } from "url";
import createBaseConfig from "../../rollup.config.base.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default createBaseConfig({
  input: path.resolve(__dirname, "src/index.ts"),
  output: [
    {
      file: path.resolve(__dirname, "dist/index.esm.js"),
      format: "esm",
      sourcemap: true
    },
    {
      file: path.resolve(__dirname, "dist/index.cjs.js"),
      format: "cjs",
      sourcemap: true
    }
  ],
  tsconfig: path.resolve(__dirname, "tsconfig.json")
});
