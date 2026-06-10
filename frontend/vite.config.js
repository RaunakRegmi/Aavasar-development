import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
export default defineConfig(function (_a) {
    var _b;
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), "");
    return {
        plugins: [react()],
        resolve: {
            alias: {
                "@": fileURLToPath(new URL("./src", import.meta.url)),
                "@app": fileURLToPath(new URL("./src/app", import.meta.url)),
                "@pages": fileURLToPath(new URL("./src/pages", import.meta.url)),
                "@features": fileURLToPath(new URL("./src/features", import.meta.url)),
                "@shared": fileURLToPath(new URL("./src/shared", import.meta.url)),
                "@styles": fileURLToPath(new URL("./src/styles", import.meta.url)),
            },
        },
        server: {
            port: Number((_b = env.VITE_DEV_PORT) !== null && _b !== void 0 ? _b : 5173),
            open: false,
            strictPort: false,
        },
        preview: {
            port: 4173,
        },
        build: {
            target: "es2022",
            sourcemap: true,
            rollupOptions: {
                output: {
                    manualChunks: {
                        react: ["react", "react-dom", "react-router-dom"],
                        query: ["@tanstack/react-query"],
                        icons: ["lucide-react"],
                        forms: ["react-hook-form", "zod"],
                    },
                },
            },
        },
    };
});
