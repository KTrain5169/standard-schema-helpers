import { defineConfig } from "vite-plus";

export default defineConfig({
  run: {
    cache: true,
    tasks: {
      build: "vp pack",
      dev: {
        command: "vp pack --watch",
        cache: false,
      },
      test: "vp test",
      check: "vp check",
    },
  },
  staged: {
    "*": "vp check --fix",
  },
  pack: {
    entry: ["src/index.ts", "src/json.ts", "src/standard.ts"],
    dts: {
      tsgo: true,
    },
    exports: true,
  },
  lint: {
    plugins: ["eslint", "import", "vitest", "oxc", "typescript", "promise", "jsdoc"],
    rules: {
      "vitest/no-disabled-tests": "allow",
    },
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {
    semi: true,
    singleQuote: false,
    jsxSingleQuote: false,
    trailingComma: "all",
  },
});
