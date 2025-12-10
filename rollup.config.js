import fs from "fs";
import path from "path";

// const fs = require("fs");

import rollupBase from './rollup.config.base.js';
// import dts from "rollup-plugin-dts";
// import pkg from "./package.json";
const extensions = [".ts", ".tsx", ".js", ".jsx"];

// const isProduction = process.env.NODE_ENV === "production";

const external = [
  "react",
  "react-dom",
  "three",
  "@babel/core",
  "@rollup/plugin-node-resolve"
  // Add any other external dependencies here
];

const dontCompiles = [
];

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
      external,
      extensions,
      // declarationDir: path.resolve(pkg.location, "types")
    });
  }

  if(process.env.NODE_ENV !== 'production'){
    console.log("Building packages:", pkgs.map(p => p.pkgJson.name).join(", "));
  }

export default pkgs.map((pkg) => makeRollupConfigForPkg(pkg));

