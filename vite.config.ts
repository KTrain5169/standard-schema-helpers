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
    dts: {
      tsgo: true,
    },
    exports: true,
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {},
});
