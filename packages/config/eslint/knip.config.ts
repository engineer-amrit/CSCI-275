import { KnipConfig } from "knip";
import { getDeps } from "@utils/config";
import pkgs from "./package.json" with { type: "json" };

const { devDependencies } = pkgs;
const ignoreDependencies = getDeps({ ...devDependencies });
ignoreDependencies.push("eslint")
export default {
    ignoreDependencies,
    entry: ["./src/base.ts", "./src/node.ts", "./src/react.ts"],
    project: ["./src/**/*.ts"],
    ignoreBinaries: ["tsc", "knip"],
    ignoreExportsUsedInFile: true,
} satisfies KnipConfig