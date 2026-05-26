import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"
import { devApiMiddleware } from "./server/devApiMiddleware.js"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  Object.assign(process.env, env)

  return {
    plugins: [
      react(),
      {
        name: "dev-api-proxy",
        configureServer(server) {
          server.middlewares.use(devApiMiddleware())
        },
      },
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})
