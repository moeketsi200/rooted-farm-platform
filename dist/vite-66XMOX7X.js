import express from 'express';
import fs, { readFileSync } from 'fs';
import path, { dirname } from 'path';
import { defineConfig, createLogger, createServer } from 'vite';
import react from '@vitejs/plugin-react';
import { TraceMap, originalPositionFor } from '@jridgewell/trace-mapping';
import { fileURLToPath } from 'url';
import { nanoid } from 'nanoid';

// server/vite.ts
var packageName = "runtime-error-plugin";
function viteRuntimeErrorOverlayPlugin(options) {
  return {
    name: packageName,
    apply(config, env) {
      return env.command === "serve" && !config.ssr;
    },
    transformIndexHtml() {
      return [
        {
          tag: "script",
          attrs: { type: "module" },
          children: CLIENT_SCRIPT
        }
      ];
    },
    configureServer(server) {
      server.ws.on(MESSAGE_TYPE, (data, client) => {
        const error = Object.assign(new Error(), data);
        if (!error.stack) {
          return;
        }
        const { stack, loc } = rewriteStacktrace(
          error.stack,
          server.moduleGraph
        );
        const err = {
          name: error.name,
          message: error.message,
          stack,
          loc,
          plugin: packageName
        };
        if (loc?.file) {
          err.id = loc?.file;
          const source = readFileSync(loc.file, "utf-8");
          err.frame = generateCodeFrame(source, {
            line: loc.line,
            column: loc.column - 1
          });
        }
        client.send({
          type: "error",
          err
        });
      });
    }
  };
}
var MESSAGE_TYPE = `${packageName}:error`;
var CLIENT_SCRIPT = `
import { createHotContext } from "/@vite/client";
const hot = createHotContext("/__dummy__${packageName}");

function sendError(error) {
  if (!(error instanceof Error)) {
    error = new Error("(unknown runtime error)");
  }
  const serialized = {
    message: error.message,
    stack: error.stack,
  };
  hot.send("${MESSAGE_TYPE}", serialized);
}

window.addEventListener("error", (evt) => {
  sendError(evt.error);
});

window.addEventListener("unhandledrejection", (evt) => {
  sendError(evt.reason);
});
`;
function cleanStack(stack) {
  return stack.split(/\n/g).filter((l) => /^\s*at/.test(l)).join("\n");
}
function rewriteStacktrace(stack, moduleGraph) {
  let loc = void 0;
  const rewrittenStack = cleanStack(stack).split("\n").map((line) => {
    return line.replace(
      /^ {4}at (?:(\S+?) )?\(?(?:https|http):\/\/[^\/]+(\/[^\s?]+).*:(\d+):(\d+)\)?$/,
      (input, varName, url, line2, column) => {
        if (!url) {
          return input;
        }
        const module = moduleGraph.urlToModuleMap.get(url);
        if (!module) {
          return "";
        }
        const rawSourceMap = module?.transformResult?.map;
        if (rawSourceMap) {
          const traced = new TraceMap(rawSourceMap);
          const pos = originalPositionFor(traced, {
            line: Number(line2),
            // stacktrace's column is 1-indexed, but sourcemap's one is 0-indexed
            column: Number(column) - 1
          });
          if (pos.source && pos.line >= 0 && pos.column >= 0) {
            line2 = pos.line;
            column = pos.column + 1;
          }
        }
        const trimmedVarName = varName?.trim();
        const sourceFile = module.file;
        const source = `${module.file}:${line2}:${column}`;
        if (sourceFile) {
          loc ?? (loc = {
            line: Number(line2),
            column: Number(column),
            file: sourceFile
          });
        }
        if (!trimmedVarName || trimmedVarName === "eval") {
          return `    at ${source}`;
        } else {
          return `    at ${trimmedVarName} ${source}`;
        }
      }
    );
  }).join("\n");
  return {
    stack: rewrittenStack,
    loc
  };
}
var splitRE = /\r?\n/g;
var range = 2;
function posToNumber(source, pos) {
  if (typeof pos === "number") {
    return pos;
  }
  const lines = source.split(splitRE);
  const { line, column } = pos;
  let start = 0;
  for (let i = 0; i < line - 1 && i < lines.length; i++) {
    start += lines[i].length + 1;
  }
  return start + column;
}
function generateCodeFrame(source, start = 0, end) {
  start = Math.max(posToNumber(source, start), 0);
  end = Math.min(
    end !== void 0 ? posToNumber(source, end) : start,
    source.length
  );
  const lines = source.split(splitRE);
  let count = 0;
  const res = [];
  for (let i = 0; i < lines.length; i++) {
    count += lines[i].length;
    if (count >= start) {
      for (let j = i - range; j <= i + range || end > count; j++) {
        if (j < 0 || j >= lines.length) {
          continue;
        }
        const line = j + 1;
        res.push(
          `${line}${" ".repeat(Math.max(3 - String(line).length, 0))}|  ${lines[j]}`
        );
        const lineLength = lines[j].length;
        if (j === i) {
          const pad = Math.max(start - (count - lineLength), 0);
          const length = Math.max(
            1,
            end > count ? lineLength - pad : end - start
          );
          res.push(`   |  ` + " ".repeat(pad) + "^".repeat(length));
        } else if (j > i) {
          if (end > count) {
            const length = Math.max(Math.min(end - count, lineLength), 1);
            res.push(`   |  ` + "^".repeat(length));
          }
          count += lineLength + 1;
        }
      }
      break;
    }
    count++;
  }
  return res.join("\n");
}
var __filename$1 = fileURLToPath(import.meta.url);
var __dirname$1 = dirname(__filename$1);
var vite_config_default = defineConfig({
  plugins: [react(), viteRuntimeErrorOverlayPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname$1, "client", "src"),
      "@shared": path.resolve(__dirname$1, "shared"),
      "@assets": path.resolve(__dirname$1, "client", "src", "assets")
    }
  },
  root: path.resolve(__dirname$1, "client"),
  build: {
    outDir: path.resolve(__dirname$1, "dist/public"),
    emptyOutDir: true
  }
});
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app) {
  const distPath = path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

export { log, serveStatic, setupVite };
//# sourceMappingURL=vite-66XMOX7X.js.map
//# sourceMappingURL=vite-66XMOX7X.js.map