import { defineConfig } from "vitest/config";
import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
export default defineConfig({
    plugins: [
        react(),
        legacy({
            targets: ["defaults", "iOS >= 12", "Safari >= 12"],
            modernPolyfills: true
        })
    ],
    build: {
        outDir: "build"
    },
    server: {
        port: 3000
    },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./src/test/setup.ts"
    }
});
