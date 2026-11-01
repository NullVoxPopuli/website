import { readFile } from "node:fs/promises";
import { basename, relative, sep } from "node:path";

import { Feed } from "feed";

import { CONTENT_DIRS, readAll } from "./content.mjs";
import { readMeta, renderFeed, renderPage } from "./markdown.mjs";

const META_QUERY = "?meta";

/**
 * Lets the app import the Markdown files.
 *
 *   /content/a.md?meta → the front matter and the excerpt
 *   /content/a.md      → the rendered HTML
 *
 * The two are separate so that the front page does not download every post.
 *
 * Also writes /rss.xml
 */
export function blog({ site }) {
  let root;

  function isContent(path) {
    return path.endsWith(".md") && CONTENT_DIRS.includes(relative(root, path).split(sep).at(0));
  }

  return {
    name: "blog",
    enforce: "pre",

    configResolved(config) {
      root = config.root;
    },

    async load(id) {
      const [path, query] = id.split("?");

      if (!isContent(path)) return;

      this.addWatchFile(path);

      const source = await readFile(path, "utf8");
      const value =
        query === META_QUERY.slice(1)
          ? { id: basename(path, ".md"), ...readMeta(source) }
          : await renderPage(source);

      return { code: `export default ${JSON.stringify(value)};`, moduleType: "js" };
    },

    async generateBundle() {
      if (this.environment.name !== "client") return;

      this.emitFile({
        type: "asset",
        fileName: "rss.xml",
        source: await renderRss(root, site),
      });
    },
  };
}

async function renderRss(root, site) {
  const posts = readAll(root, "content").sort((a, b) => new Date(b.date) - new Date(a.date));

  const feed = new Feed({
    title: site.title,
    description: site.description,
    id: site.host,
    link: site.host,
    copyright: site.title,
    updated: new Date(posts.at(0).date),
    feedLinks: { rss: `${site.host}/rss.xml` },
  });

  for (const post of posts) {
    const link = `${site.host}/${post.id}`;

    feed.addItem({
      title: post.title,
      link,
      date: new Date(post.date),
      description: post.excerpt,
      content: await renderFeed(post.source),
      category: (post.tags ?? []).map((name) => ({ name })),
      image: post.image ? `${site.host}${post.image}` : undefined,
    });
  }

  return feed.rss2();
}
