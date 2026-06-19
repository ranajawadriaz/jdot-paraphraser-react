import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

/**
 * Dev-only middleware that serves the same serverless handler used in
 * production (api/paraphrase.ts) so `npm run dev` works end-to-end without
 * needing the Vercel CLI. The Groq key is read from .env and stays on the
 * server side — it is never exposed to the browser bundle.
 */
function groqDevApi(): Plugin {
  return {
    name: "groq-dev-api",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith("/api/paraphrase")) return next();
        try {
          const mod = await server.ssrLoadModule("/api/paraphrase.ts");
          await mod.default(req, res);
        } catch (error) {
          server.config.logger.error(`[groq-dev-api] ${error}`);
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Local API handler crashed. Check the dev server logs." }));
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Make non-VITE_ vars (e.g. GROQ_API_KEY) available to the dev API handler.
  const env = loadEnv(mode, process.cwd(), "");
  if (env.GROQ_API_KEY) process.env.GROQ_API_KEY = env.GROQ_API_KEY;

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react(), groqDevApi()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
