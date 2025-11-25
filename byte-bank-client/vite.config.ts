import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
    const isProd = mode === "production";

    return {
        plugins: [react()],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
                // 🔥 Key part: dynamic environment alias
                "./environments/environment": path.resolve(
                    __dirname,
                    isProd
                        ? "src/environments/environment.production.ts"
                        : "src/environments/environment.ts"
                ),
            },
        },

        build: {
            outDir: "dist",
            target: "es2018",
            // use terser in prod for fine-grained control (esbuild is default & faster)
            minify: isProd ? "terser" : false,
            sourcemap: isProd ? false : true,
            cssCodeSplit: true,
            assetsInlineLimit: 4096, // 4kb - inline smaller assets
            brotliSize: true,
            chunkSizeWarningLimit: 1500, // increase if you have large chunks

            terserOptions: isProd
                ? {
                      compress: {
                          drop_console: true,
                          drop_debugger: true,
                      },
                      format: {
                          comments: false,
                      },
                  }
                : undefined,
        },

        optimizeDeps: {
            // include any libs that need pre-bundling
            include: [],
            // exclude: [], // exclude problematic packages if needed
        },
    };
});
