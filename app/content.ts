import { getPromiseState } from "reactiveweb/get-promise-state";

import type { ImageData } from "@responsive-image/core";

export interface Post {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  image?: string;
  imageMeta?: { attribution?: string; attributionLink?: string };
  tags?: string[];
  authors?: string[];
}

export interface Page {
  id: string;
  title: string;
}

export interface Tag {
  id: string;
  name: string;
  excerpt: string;
}

export interface Author {
  id: string;
  name: string;
  image?: string;
  website?: string;
  twitter?: string;
  github?: string;
  gitlab?: string;
  mastodon?: string;
  location?: string;
}

type Loaders = Record<string, () => Promise<string>>;

function byId<Item extends { id: string }>(modules: Record<string, Item>) {
  return new Map(Object.values(modules).map((item) => [item.id, item]));
}

/**
 * Keys in a glob are paths, and the id is the file name.
 */
async function loadHtml(loaders: Loaders, dir: string, id: string) {
  return (await loaders[`/${dir}/${id}.md`]?.()) ?? "";
}

const postBodies = import.meta.glob("/content/*.md", { import: "default" }) as Loaders;
const pageBodies = import.meta.glob("/page/*.md", { import: "default" }) as Loaders;

/**
 * These stay in public/, so that the URLs in the feed and in link previews do not change.
 */
const covers = import.meta.glob<ImageData>("/public/images/*.{jpg,jpeg,avif,webp}", {
  query: "?responsive",
  import: "default",
});

function loadCover(image?: string) {
  return image ? covers[`/public${image}`]?.() : undefined;
}

const postsById = byId(
  import.meta.glob<Post>("/content/*.md", { query: "?meta", import: "default", eager: true }),
);
const pagesById = byId(
  import.meta.glob<Page>("/page/*.md", { query: "?meta", import: "default", eager: true }),
);
const tagsById = byId(
  import.meta.glob<Tag>("/tag/*.md", { query: "?meta", import: "default", eager: true }),
);
const authorsById = byId(
  import.meta.glob<Author>("/author/*.md", { query: "?meta", import: "default", eager: true }),
);

export const posts = Array.from(postsById.values()).sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);

export const findPost = (id: string) => postsById.get(id);
export const findPage = (id: string) => pagesById.get(id);
export const findTag = (id: string) => tagsById.get(id);
export const findAuthor = (id: string) => authorsById.get(id);

export const postsTagged = (id: string) => posts.filter((post) => post.tags?.includes(id));
export const postsBy = (id: string) => posts.filter((post) => post.authors?.includes(id));

export const newerThan = (post: Post) => posts[posts.indexOf(post) - 1];
export const olderThan = (post: Post) => posts[posts.indexOf(post) + 1];

/**
 * getPromiseState needs the same promise each time, to return the same state.
 */
function once<Value>(load: (id: string) => Promise<Value>) {
  const promises = new Map<string, Promise<Value>>();

  return (id: string) => {
    if (!promises.has(id)) promises.set(id, load(id));

    return promises.get(id) as Promise<Value>;
  };
}

const loadPost = once(async (id) => ({
  cover: await loadCover(findPost(id)?.image),
  html: await loadHtml(postBodies, "content", id),
}));

const loadPage = once((id) => loadHtml(pageBodies, "page", id));

export const postBody = (id: string) => getPromiseState(loadPost(id));
export const pageBody = (id: string) => getPromiseState(loadPage(id));

/**
 * The first render must have the content, in the pre-render and in the browser.
 *
 * Glimmer can only rehydrate what the pre-render wrote in its first render.
 *
 * With a resolved promise, getPromiseState is sync.
 */
export async function preloadAll() {
  for (const { id } of posts) await preload(`/${id}`);
  for (const { id } of pagesById.values()) await preload(`/page/${id}`);
}

export function preload(pathname: string) {
  const path = pathname.replace(/^\/|\/$/g, "");
  const pageId = path.match(/^page\/(.+)$/)?.[1];

  if (pageId) {
    pageBody(pageId);

    return loadPage(pageId);
  }

  if (!findPost(path)) return;

  postBody(path);

  return loadPost(path);
}
