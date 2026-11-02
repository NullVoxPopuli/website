# website

The source of https://nullvoxpopuli.com: a static blog on Ember and Vite.

## Develop

```bash
pnpm install
pnpm start
```

## Write

- `content/` holds the posts. The file name is the URL.
- `page/` holds the pages at `/page/<name>`.
- `tag/` holds the tags. Each tag that a post uses needs a file here.
- `author/` holds the authors.
- `drafts/` is not published.

## Check

```bash
pnpm lint
pnpm test
pnpm test:output
```

## Build

`pnpm build` writes the site to `dist/`, with one HTML file for each URL and the feed at `/rss.xml`.
Each push to `master` deploys `dist/` to Cloudflare Pages.

## Image Hacks

Rotate image the correct way (some programs just add metadata instead of actually modifying the image)

```bash
file=emberconf-stage.jpg
exiftool -Orientation= $file
convert $file -rotate 180 $file
```
