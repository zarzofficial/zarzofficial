import fs from "node:fs";
import path from "node:path";
import { renderToString } from "react-dom/server";
import { AppProviders } from "../src/app/AppProviders";
import { ServerApp } from "../src/app/ServerApp";

const docsDir = path.resolve(process.cwd(), "docs");

function collectHtmlFiles(directory: string, bucket: string[] = []) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "assets" || entry.name === "fonts") continue;
      collectHtmlFiles(absolutePath, bucket);
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".html")) {
      bucket.push(absolutePath);
    }
  }

  return bucket;
}

function fileToRoute(filePath: string) {
  const relativePath = path.relative(docsDir, filePath).replace(/\\/g, "/");

  if (relativePath === "index.html") return "/";
  if (relativePath.endsWith("/index.html")) {
    return `/${relativePath.slice(0, -"index.html".length - 1)}`;
  }

  return `/${relativePath}`;
}

function splitLeadingPreloads(markup: string) {
  const match = markup.match(/^((?:<link\b[^>]*?>)+)([\s\S]*)$/);
  if (!match) {
    return {
      preloads: "",
      content: markup,
    };
  }

  return {
    preloads: match[1],
    content: match[2],
  };
}

function injectIntoRoot(html: string, markup: string) {
  const rootStart = html.indexOf('<div id="root"');
  const headClose = html.indexOf("</head>");
  if (rootStart === -1) {
    throw new Error("Missing #root container in prerender target.");
  }

  if (headClose === -1) {
    throw new Error("Missing </head> in prerender target.");
  }

  const rootOpenEnd = html.indexOf(">", rootStart);
  const bodyClose = html.indexOf("</body>", rootOpenEnd);
  const rootClose = html.lastIndexOf("</div>", bodyClose);
  const { preloads, content } = splitLeadingPreloads(markup);

  if (rootOpenEnd === -1 || bodyClose === -1 || rootClose === -1) {
    throw new Error("Unable to locate root container boundaries.");
  }

  return [
    html.slice(0, headClose),
    preloads,
    html.slice(headClose, rootStart),
    '<div id="root" data-prerendered="true">',
    content,
    "</div>",
    html.slice(rootClose + "</div>".length),
  ].join("");
}

function prerenderRoute(route: string) {
  return renderToString(
    <AppProviders>
      <ServerApp location={route} />
    </AppProviders>,
  );
}

if (!fs.existsSync(docsDir)) {
  throw new Error(`Missing docs output at ${docsDir}`);
}

for (const htmlFile of collectHtmlFiles(docsDir)) {
  const route = fileToRoute(htmlFile);
  const sourceHtml = fs.readFileSync(htmlFile, "utf8");
  const routeMarkup = prerenderRoute(route);
  const nextHtml = injectIntoRoot(sourceHtml, routeMarkup);
  fs.writeFileSync(htmlFile, nextHtml);
}
