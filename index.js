import express from "express";
import { createBareServer } from "@tomphttp/bare-server-node";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { readFile } from "fs/promises";
import { join } from "path";
import http from "http";

const app = express();
const bare = createBareServer("/bare/");
const server = http.createServer();

app.use(express.static("static"));

app.get("/", async (req, res) => {
  const html = await readFile(join("static", "index.html"), "utf-8");
  res.send(html);
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
