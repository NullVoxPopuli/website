import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { listRoutes } from "../../lib/content.mjs";

const root = join(import.meta.dirname, "../..");
const dist = join(root, "dist");
const read = (path) => readFileSync(join(dist, path), "utf8");

const htmlPath = (route) => (route === "index" ? "index.html" : `${route}/index.html`);

test("each route has pre-rendered content", () => {
  for (const route of listRoutes(root)) {
    assert.match(read(htmlPath(route)), /<main>[\s\S]*<(h1|h2)/, route);
  }
});

test("pre-rendered posts have a title and meta tags", () => {
  const html = read("2024-04-24-signals/index.html");

  assert.match(html, /<title>What do TC39 Signals mean for you, specifically\?/);
  assert.match(html, /<meta property="og:image" content="https:\/\/nullvoxpopuli.com\/images\//);
  assert.match(
    html,
    /<link rel="canonical" href="https:\/\/nullvoxpopuli.com\/2024-04-24-signals"/,
  );
});

test("the feed keeps the permalinks of each post", () => {
  const rss = read("rss.xml");
  const posts = listRoutes(root).filter((route) => /^\d{4}-|^avoiding/.test(route));

  assert.equal(rss.match(/<item>/g).length, posts.length);

  for (const post of posts) {
    assert.ok(
      rss.includes(`<guid isPermaLink="true">https://nullvoxpopuli.com/${post}</guid>`),
      post,
    );
  }
});

test("the 404 page exists", () => {
  assert.ok(existsSync(join(dist, "404.html")));
});
