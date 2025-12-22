/* eslint-disable @typescript-eslint/no-require-imports */
import fs from "fs";
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const fs = require("fs");

import rollupBase from "./rollup.config.base.js";
// import dts from "rollup-plugin-dts";
// import pkg from "./package.json";
const extensions = [".ts", ".tsx", ".js", ".jsx"];

// const isProduction = process.env.NODE_ENV === "production";

const external = [
  "react",
  "react-dom",
  "react/jsx-runtime",
  "react-dom/client",
  "three",
  "@babel/core",
  "@rollup/plugin-node-resolve"
  // Add any other external dependencies here
];

const dontCompiles = [];

const pkgsRoot = path.join(__dirname, "packages");
const pkgs = fs
  .readdirSync(pkgsRoot)
  .filter((dir) => !dontCompiles.includes(dir))
  .map((dir) => path.join(pkgsRoot, dir))
  .filter((dir) => fs.statSync(dir).isDirectory())
  .map((location) => {
    return {
      location: location,
      pkgJson: require(path.resolve(location, "package.json"))
    };
  });

function makeRollupConfigForPkg(pkg) {
  const pkgDeps = Object.keys(pkg.pkgJson.dependencies || {});
  const pkgPeerDeps = Object.keys(pkg.pkgJson.peerDependencies || {});
  // Combine global externals with package-specific dependencies
  const allExternals = [...new Set([...external, ...pkgDeps, ...pkgPeerDeps])];

  return rollupBase({
    input: path.resolve(pkg.location, "src/index.ts"),
    output: [
      {
        // dir:  path.resolve(pkg.location, "dist"),
        file: path.resolve(pkg.location, "dist/index.esm.js"),
        format: "esm",
        sourcemap: true
      },
      {
        //  dir:  path.resolve(pkg.location, "dist"),
        file: path.resolve(pkg.location, "dist/index.cjs.js"),
        format: "cjs",
        sourcemap: true
      }
    ],
    tsconfig: path.resolve(pkg.location, "tsconfig.json"),
    // Use a function to match package names and their subpaths
    external: (id) => allExternals.some((dep) => id === dep || id.startsWith(`${dep}/`)),
    extensions
    // declarationDir: path.resolve(pkg.location, "types")
  });
}

if (process.env.NODE_ENV !== "production") {
  console.log("Building packages:", pkgs.map((p) => p.pkgJson.name).join(", "));
}

export default pkgs.map((pkg) => makeRollupConfigForPkg(pkg));
