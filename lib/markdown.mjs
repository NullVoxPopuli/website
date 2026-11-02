import rehypeShiki from "@shikijs/rehype";
import { toString } from "mdast-util-to-string";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { VFile } from "vfile";
import { visit } from "unist-util-visit";
import { matter } from "vfile-matter";

const EXCERPT_WORDS = 33;

function remarkMatter() {
  return (_tree, file) => {
    matter(file);
  };
}

/**
 * The click handler for these buttons is in app/components/prose.gts
 */
function rehypeCopyButton() {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "pre" || !parent) return;

      parent.children[index] = {
        type: "element",
        tagName: "div",
        properties: { className: ["code-block"] },
        children: [
          {
            type: "element",
            tagName: "button",
            properties: { type: "button", className: ["copy"] },
            children: [{ type: "text", value: "Copy" }],
          },
          node,
        ],
      };

      return index + 1;
    });
  };
}

function base() {
  return unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkMatter)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw);
}

/**
 * Feed readers do not run our CSS or JS,
 * so the feed gets the document without the page furniture.
 */
const feedProcessor = base().use(rehypeStringify).freeze();

const pageProcessor = base()
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings, {
    behavior: "append",
    properties: { className: ["heading-link"], ariaHidden: "true", tabIndex: -1 },
    content: { type: "text", value: "#" },
  })
  .use(rehypeShiki, {
    themes: { light: "github-light-high-contrast", dark: "catppuccin-mocha" },
    defaultColor: "light-dark()",
    defaultLanguage: "text",
    fallbackLanguage: "text",
    lazy: true,
  })
  .use(rehypeCopyButton)
  .use(rehypeStringify)
  .freeze();

const metaProcessor = unified().use(remarkParse).use(remarkFrontmatter).use(remarkGfm).freeze();

export async function renderPage(markdown) {
  return String(await pageProcessor.process(markdown));
}

export async function renderFeed(markdown) {
  return String(await feedProcessor.process(markdown));
}

/**
 * Only paragraphs count towards the excerpt.
 * Code and inline HTML do not read well as a summary.
 */
export function readMeta(markdown) {
  const file = new VFile(markdown);

  matter(file);

  const tree = metaProcessor().parse(file);
  const paragraphs = tree.children.filter((node) => node.type === "paragraph");
  const words = paragraphs
    .map((node) => toString(node))
    .join(" ")
    .split(/\s+/);

  return { ...file.data.matter, excerpt: words.slice(0, EXCERPT_WORDS).join(" ") };
}
