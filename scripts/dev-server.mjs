import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("../dist/", import.meta.url)));
const host = "127.0.0.1";
const startPort = Number(process.env.PORT || 5173);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8",
};

if (!existsSync(root)) {
  console.error("Le dossier dist est absent. Lance d'abord: npm run build");
  process.exit(1);
}

function resolveRequest(url = "/") {
  const cleanUrl = decodeURIComponent(url.split("?")[0] || "/");
  const requested = cleanUrl.endsWith("/") ? `${cleanUrl}index.html` : cleanUrl;
  const candidate = normalize(join(root, requested));

  if (!candidate.startsWith(root)) return null;
  if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;

  const htmlCandidate = `${candidate}.html`;
  if (existsSync(htmlCandidate) && statSync(htmlCandidate).isFile()) return htmlCandidate;

  const indexCandidate = join(candidate, "index.html");
  if (existsSync(indexCandidate) && statSync(indexCandidate).isFile()) return indexCandidate;

  return join(root, "index.html");
}

function createStaticServer() {
  return createServer((request, response) => {
    const filePath = resolveRequest(request.url);

    if (!filePath || !existsSync(filePath)) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    const ext = extname(filePath).toLowerCase();
    response.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
    });
    createReadStream(filePath).pipe(response);
  });
}

function listen(port) {
  const server = createStaticServer();

  server.once("error", (error) => {
    if (error.code === "EADDRINUSE" && port < startPort + 20) {
      listen(port + 1);
      return;
    }
    throw error;
  });

  server.listen(port, host, () => {
    console.log(`SahelSoft local: http://${host}:${port}`);
  });
}

listen(startPort);
