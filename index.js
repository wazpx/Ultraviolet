import express from "express";
import { createBareServer } from "@tomphttp/bare-server-node";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { join } from "path";
import { fileURLToPath } from "url";
import http from "http";

const __dirname = join(fileURLToPath(import.meta.url), "..");

const app = express();
const bare = createBareServer("/bare/");
const server = http.createServer();

// Serve UV client files (if you're using the UV front-end)
app.use("/uv/", express.static(uvPath));

// Serve static files from "public" folder
app.use(express.static(join(__dirname, "public")));

// Optional fallback to index.html (like if user refreshes on client-side route)
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, "public", "index.html"));
});

server.on("request", (req, res) => {
  if (bare.shouldRoute(req)) return bare.routeRequest(req, res);
  app(req, res);
});

server.on("upgrade", (req, socket, head) => {
  if (bare.shouldRoute(req)) return bare.routeUpgrade(req, socket, head);
});

server.listen(process.env.UV_PORT || 8080, () => {
  console.log("Ultraviolet is running.");
});
