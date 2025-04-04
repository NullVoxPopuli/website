---
title: Sites and Projects
image:
imageMeta:
  attribution:
  attributionLink:
featured: true
authors:
  - nullvoxpopuli
date: Sun Jan 07 2024 11:13:54 GMT-0500 (Eastern Standard Time)
tags: [] 

---

Here is a list of docs, sites, and apps that I work on.

## [limber](https://limber.glimdown.com)

REPL / playground for writing demos, docs, reproductions all with Ember/Glimmer.

## [tutorial](https://tutorial.glimdown.com)

Interactive tutorial, built on [limber](https://limber.glimdown.com), for teaching programming patterns, concepts, reactivity, and techniques for everything someone could do within a file in Ember/Glimmer.

## [majors](https://majors.nullvoxpopuli.com)

Graphs dependency usage grouped by major release, revealing adoption and ecosystem health surrounding any particular dependency.

## [is my green your green?](https://ismycolor.nullvoxpopuli.com/)

Tests your color perception and shows you how you measure against the numerical representations of all colors. Defaults to blue vs green, but can be configured for any pair of colors.

## [turborepo summaryfile analyzer](https://turbo.nullvoxpopuli.com/)

Analyzes the summary.json file that [turborepo](https://github.com/vercel/turbo/) outputs to help visualize the task blockers, and also reveals CPU bottlenecks (for example when the CPU is too busy to pick up a task)

## [markdown table viewer](http://markdown-table.nullvoxpopuli.com/?file=https://raw.githubusercontent.com/NullVoxPopuli/disk-perf-git-and-pnpm/refs/heads/main/README.md)

Renders tables present in linked markdown documents via the `?file=` query param. Provides filtering and sorting, etc

## [ember-inspector](https://ember-inspector.nullvoxpopuli.com/)

Status of the latest release of ember-inspector.

## [ember-wordle](https://ember-wordle.pages.dev)

Hard-mode version of the game, Wordle.

## NPM Libraries

This list is non-exhaustive, and only includes that which has separate sites deployed for docs.

For an exhaustive list, see my [npm page](https://www.npmjs.com/~nullvoxpopuli).

### [ember-primitives](https://ember-primitives.pages.dev)

headless / stylessless, a11y focused implementations of components and patterns to help make building apps faster.

### [ember-resources](https://ember-resources.nullvoxpopuli.com/)

API Reference for [ember-resources](https://github.com/NullVoxPopuli/ember-resources/tree/main/docs)

### [reactiveweb](https://reactive.nullvoxpopuli.com/)

Collection of utilities for helping applications be more reactive.

### [@universal-ember/preem](https://preem-docs-app.vercel.app)

Eventual home of the design system I'm making.

### [Kolay](https://github.com/universal-ember/kolay)

Docs system that I use for highly dynamic and interactive docs. Uses [typedoc](https://typedoc.org/) for api reference docs.

### [ember-jsqr](https://nullvoxpopuli.github.io/ember-jsqr/)

Component for scanning QR codes with lazy loading.

### [Glimmer + `<template>` for highlight.js](https://hljs-glimmer.nullvoxpopuli.com/?)

Syntax Highlighting for [highlight.js](https://highlightjs.org/)

### [Glimmer for prismjs](https://prismjs-glimmer.nullvoxpopuli.com/)

Syntax Highlighting for [prism.js](https://prismjs.com/)

## NPM Tools

### [y-which](https://github.com/NullVoxPopuli/y-which)

For debugging which version of a dependency is resolveable from directories. Helpful with investigating issues with peerDependencies

### [node-confirm](https://github.com/NullVoxPopuli/node-confirm)

For helping with interactive CLIs, prompts the user if they are sure.

### [turbo-daemon](https://github.com/NullVoxPopuli/turbo-daemon)

Allows you to run a [turborepo](https://turbo.build/repo/) server locally as a daemon, for connecting to remote storage (such as S3) -- helpful when you're on a team where developers have their own S3 accounts.

### [salvatore](https://github.com/NullVoxPopuli/salvatore)

Daemon and Pidfile manager allowing you to idempotently start daemons in tooling.

### [dependency-maintainers](https://github.com/NullVoxPopuli/dependency-maintainers)

List who maintains your dependencies.

### [how-many-deps](https://github.com/NullVoxPopuli/how-many-deps)

Counts how many deps you have in your (mono)repo

### [are-my-build-deps-out-of-date](https://github.com/NullVoxPopuli/are-my-build-deps-out-of-date)

Scans your reachable dependencies and tells you if any dependencies known to be for building / emitting javascript are out of date.

### [ember-apply](https://ember-apply.pages.dev/)

Collection of monorepo management and script-aiding utilities for managing docs automation as well as codemodding and monorepo maintenance.
