import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import createBaseConfig from "../../rollup.config.base.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const pkg = require("./package.json");

const baseExternal = ["react", "react-dom", "react/jsx-runtime", "react-dom/client"];
const deps = Object.keys(pkg.dependencies || {});
const peerDeps = Object.keys(pkg.peerDependencies || {});
const externalDeps = [...new Set([...baseExternal, ...deps, ...peerDeps])];

const external = (id) => externalDeps.some((dep) => id === dep || id.startsWith(`${dep}/`));

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
  tsconfig: path.resolve(__dirname, "tsconfig.json"),
  external
});
