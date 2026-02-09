import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

const framerMotionEsDir = path.resolve(
  __dirname,
  "node_modules/framer-motion/dist/es"
);

// Resolve framer-motion internal .mjs paths so Vercel/Rollup can find them
function framerMotionResolvePlugin() {
  return {
    name: "framer-motion-resolve",
    resolveId(id: string, importer?: string) {
      if (!importer) return null;
      if (!id.startsWith(".") || !id.endsWith(".mjs")) return null;
      if (!importer.includes("framer-motion")) return null;
      const resolved = path.resolve(path.dirname(importer), id);
      if (resolved.startsWith(framerMotionEsDir)) return resolved;
      return null;
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    framerMotionResolvePlugin(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    dedupe: ["react", "react-dom", "framer-motion"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ["framer-motion"],
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-motion": ["framer-motion"],
          "vendor-charts": ["recharts"],
          "vendor-radix": [
            "@radix-ui/react-accordion",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-tabs",
            "@radix-ui/react-toast",
          ],
        },
      },
    },
    chunkSizeWarningLimit: 700,
  },
}));
