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
function loadHtml(loaders: Loaders, dir: string, id: string) {
  return loaders[`/${dir}/${id}.md`]?.() ?? "";
}

const postBodies = import.meta.glob("/content/*.md", { import: "default" }) as Loaders;
const pageBodies = import.meta.glob("/page/*.md", { import: "default" }) as Loaders;

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

export class NotFound extends Error {}

function find<Item>(items: Map<string, Item>, id: string) {
  const item = items.get(id);

  if (!item) throw new NotFound(`Nothing at ${id}`);

  return item;
}

export const tagFor = (id: string) => tagsById.get(id);
export const authorFor = (id: string) => authorsById.get(id);

export async function loadPost(id: string) {
  const post = find(postsById, id);
  const index = posts.indexOf(post);

  return {
    post,
    html: await loadHtml(postBodies, "content", id),
    newer: posts[index - 1],
    older: posts[index + 1],
  };
}

export async function loadPage(id: string) {
  return { page: find(pagesById, id), html: await loadHtml(pageBodies, "page", id) };
}

export function loadTag(id: string) {
  return {
    tag: find(tagsById, id),
    posts: posts.filter((post) => post.tags?.includes(id)),
  };
}

export function loadAuthor(id: string) {
  return {
    author: find(authorsById, id),
    posts: posts.filter((post) => post.authors?.includes(id)),
  };
}
