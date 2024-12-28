import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom", "react-router-dom", "@tanstack/react-query"],
            ui: [
              "@radix-ui/react-dialog",
              "@radix-ui/react-popover",
              "@radix-ui/react-slot"
            ]
          }
        }
      }
    },
    define: {
      "process.env": env
    }
  };
});
