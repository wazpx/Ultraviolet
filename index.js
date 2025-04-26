import express from "express";
import { createBareServer } from "@tomphttp/bare-server-node";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { readFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import http from "http";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const bare = createBareServer("/bare/");
const server = http.createServer();

// ✅ Correct public folder usage
app.use(express.static(join(__dirname, "public")));

// ✅ Optional: UV client assets (remove if not using UV front-end)
app.use("/uv/", express.static(uvPath));

// ✅ Root route for index.html
app.get("/", async (req, res) => {
  const html = await readFile(join(__dirname, "public", "index.html"), "utf-8");
  res.send(html);
});

// ✅ Bare routing
server.on("request", (req, res) => {
  if (bare.shouldRoute(req)) return bare.routeRequest(req, res);
  app(req, res);
});

server.on("upgrade", (req, socket, head) => {
  if (bare.shouldRoute(req)) return bare.routeUpgrade(req, socket, head);
});

server.listen(process.env.UV_PORT || 8080, () => {
  console.log("✅ Ultraviolet is running.");
});
