---
title: Where Do I Import X From
image: /images/photo-1517327236079-512484a512d7.avif
imageMeta:
  attribution: Tom Morel
  attributionLink: https://unsplash.com/photos/pathway-in-forest-8Q3Umbnr8DU
featured: true
authors:
  - nullvoxpopuli
date: Thu Jul 18 2024 11:14:31 GMT-0400 (Eastern Daylight Time)
tags:
  - ember 
  - javascript
---

# Where do I import the thing?


Ember has historically allowed access to everything in a global scope, like web-components. This proved confusing for developers, and Ember has moved to a more explicit, import-what-you-need approach, called "template-tag" -- more information on that here: https://guides.emberjs.com/release/components/template-tag-format/

A common thing I hear from folks is that they don't know where to import a component/modifier/helper from a particular addon, or maybe assume that because something isn't documented, they can't import the component/modifier/helper.

Good news:
_if it works in loose mode (the globals way)_, **the import is public API**.


Here is how you find them:

1. _open `node_modules/${libraryName}`_
    - if it doesn't exist, install `libraryName` / add to _your_ `package.json` 
2.  open the `package.json` of `libraryName`
    - does it have `exports`?
        - This _could_ look like this for types-providing projects:

            ```js 
            "exports": {
              ".": {
                "types": "./declarations/index.d.ts",
                "default": "./dist/index.js"
              },
              "./*": {
                "types": "./declarations/*.d.ts",
                "default": "./dist/*.js"
              },
              "./addon-main.js": "./addon-main.cjs"
            },
            ```
        - or it could look like this for non-types-providing projects 

            ```js 
            "exports": {
              ".": "./dist/index.js",
              "./*": "./dist/*.js",
              "./addon-main.js": "./addon-main.cjs"
            },
            ```

        Exports say if you import x from `library-name/${sub path specifier}`, the `exports` map will match to a file on disk. So you can look through the dist directory if `./*` is specified and see what all you can import. See [the docs](https://nodejs.org/api/packages.html#subpath-exports) for details.  
        For example, if you see a file in dist/components/foo.js (and given the above exports), you can import it at `library-name/components/foo`.  

        ----------------

        There is an intermediary step which _may_ or may not ever be relevant, due to how strongly folks follow conventions in with the library blueprints, but if there is an `ember-addon.app-js` key in the package.json -- this is the mapping of what is dumped in to the globals resolver, and is what is exposed to you pre-gjs/gts/template-tag. This config will looks something like this:  
        ```js
        "ember-addon": {
          "version": 2,
          "type": "addon",
          "main": "addon-main.cjs",
          "app-js": {
            "./components/foo.js": "./dist/some-other-folder/foo.js"
          }
        },
        ```
        In this scenario, instead of importing from `libraryName/components/foo`, you'd import from `libraryName/some-other-folder/foo`.  

        Once you find the file in `dist`, you're done.

  3. If the package.json you're looking at does not have an `exports` config, _and_ the library is an ember-addon (has `ember-addon` listed in `keywords`), this likely the older "v1 addon" format, which was convention-based, and didn't follow broader standards (as they didn't exist yet). _By convention_, you'll need to check the `app` folder for your components/modifiers/helpers, and see what those files define or re-export. You can then import what those files use.
    For example, if you find `app/components/foo.js` contains `export { default } from 'libraryName/some-other-folder/foo`, you can import from that same location. e.g.:

    ```js
    import theDefaultExport from 'libraryName/some-other-folder/foo';
    ```


This information is also available on the [ember-template-imports](https://github.com/ember-template-imports/ember-template-imports?tab=readme-ov-file#reference-import-external-helpers-modifiers-components) README.

## Don't know which library to start with?

you can find anything by searching in `node_modules`.

I like using [the_silver_searcher](https://github.com/ggreer/the_silver_searcher), but any search tool will work.

```bash 
❯ ag --unrestricted "<ResponsiveImage" --file-search-regex '.js$'
```

I use `--unrestricted` to search ignored files (`node_modules`), and `--file-search-regex` with `.js$`, because I want to exclude source-map files, `.js.map$` (I haven't learned how to read those).

So if I want to search for "ResponsiveImage" (a component that's used on this site), I don't get results in node_modules, but in my `dist` folder (my app's output) -- this means I need to try one of the other forms of which components can be referenced.

These are the possibilities for the direct name reference:
- `<PascalCase`, hoping that the component's JSDoc exists

    ```bash 
    ❯ ag --unrestricted "<ResponsiveImage" --file-search-regex '.js$'
    ```
- `class PascalCase` to find the file in JS 

    ```bash 
    ❯ ag --unrestricted "class ResponsiveImage" --file-search-regex '.js$'
    ```

But we can also search via file path:
- `kebab-case`
  
    ```bash 
    ❯ ag --unrestricted --filename-pattern 'responsive-image'
    ```

    using `--filename-pattern` allows us to search for file paths, and not the contents of the file. We might not know what is in a particular file.

  - or, if too many results, you can search with the extensions:
    - `kebab-case.js`
    - `kebab-case.ts`
    - `kebab-case.gjs`
    - `kebab-case.gts`
    - `kebab-case.hbs`
    - `kebab-case/index.js`
    - `kebab-case/index.ts`
    - `kebab-case/index.gjs`
    - `kebab-case/index.gts`
    - `kebab-case/index.hbs`

    All can be searched for all at once with this (which can still be far fewer results than with no extension):

    ```bash 
    ❯ ag --unrestricted --filename-pattern 'responsive-image(\/index)?\.(js|ts|hbs|gjs|gts)'
    ```


Feel like a lot of work to find which library something comes from? I think so, too.

This is why gjs/gts/template-tag is so nice, because you _just know_ exactly where something is coming from.

To try out gjs / `<template>` in your browser, check out this [interactive tutorial](https://tutorial.glimdown.com).
