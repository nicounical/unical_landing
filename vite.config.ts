import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  // En el build de revisión las rutas son relativas para poder alojarlo en cualquier subruta.
  base: mode === "preview" ? "./" : "/",
  server: { host: "::", port: 8080 },
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/gsap")) return "gsap";
          if (id.includes("node_modules/lenis")) return "lenis";
        },
      },
    },
  },
}));
