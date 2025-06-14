import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { configDefaults, defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    open: true,
    port: 3000,
    strictPort: true,
  },
  test: {
    globals: true,
    include: ["./src/*.test.(ts|tsx)", "storybook.test.tsx"],
    exclude: [
      ...configDefaults.exclude,
      "**/node_modules/**",
      "**/dist/**",
      "**/cypress/**",
      "**/.{idea,git,cache,output,temp}/**",
      "./src/config/**",
      "*.config.js",
      "**/storybook-static/**",
    ],
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      reporter: ["text", "lcov"],
      provider: "v8",
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "./src/config/**",
        "*.config.js",
        "**/storybook-static/**",
        "src/vite-env.d.ts",
        ".storybook",
        "**/**.types.ts",
        "**/**.constant.ts",
      ],
    },
    snapshotFormat: { escapeString: true, printBasicPrototype: true },
  },
  plugins: [
    react(),
    svgr({
      svgrOptions: { exportType: "named", ref: true, svgo: false, titleProp: true },
      include: "**/*.svg",
    }),
  ],
});
