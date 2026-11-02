import { globSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";

import { readMeta } from "./markdown.mjs";

export const CONTENT_DIRS = ["content", "page", "tag", "author"];

function idOf(path) {
  return basename(path).replace(/\.md$/, "");
}

export function readAll(root, dir) {
  return globSync("*.md", { cwd: join(root, dir) }).map((path) => {
    const source = readFileSync(join(root, dir, path), "utf8");

    return { id: idOf(path), source, ...readMeta(source) };
  });
}

/**
 * A tag without a file has no name to show.
 */
function assertTagsExist(root, posts) {
  const known = new Set(readAll(root, "tag").map((tag) => tag.id));

  for (const post of posts) {
    for (const tag of post.tags ?? []) {
      if (!known.has(tag)) {
        throw new Error(`${post.id} uses the tag "${tag}", but tag/${tag}.md does not exist`);
      }
    }
  }
}

/**
 * Every URL that gets a pre-rendered HTML file.
 *
 * In the format that vite-ember-ssr expects: no leading slash.
 */
export function listRoutes(root) {
  const posts = readAll(root, "content");

  assertTagsExist(root, posts);

  const routes = ["index"];

  for (const post of posts) routes.push(post.id);
  for (const page of readAll(root, "page")) routes.push(`page/${page.id}`);
  for (const author of readAll(root, "author")) routes.push(`author/${author.id}`);
  for (const tag of new Set(posts.flatMap((post) => post.tags ?? []))) routes.push(`tag/${tag}`);

  return routes;
}
