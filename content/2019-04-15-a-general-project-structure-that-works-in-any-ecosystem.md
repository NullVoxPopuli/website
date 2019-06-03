---
title: A General Project Structure That Works in Any Ecosystem
image: /images/robert-wagner-388370-unsplash.jpg
imageMeta:
  attribution:
  attributionLink:
featured: true
authors:
  - nullvoxpopuli
date: Mon Apr 15 2019 06:44:47 GMT-0400 (Eastern Daylight Time)
tags:
  - javascript
  - architecture
  - frontend
  - ember
  - react
  - angular
  - vue
  - project-structure
  - files
  - file-system
---


To quote another article on a similar topic:

> the ideal structure is the one that allows you to move around your code with the least amount of effort.

> --- [_The 100% correct way to structure a React app..._](https://hackernoon.com/the-100-correct-way-to-structure-a-react-app-or-why-theres-no-such-thing-3ede534ef1ed)

Why worry about folder/file structure at all? It seems like a difficult problem to solve. When there are no restrictions, almost everyone has a different idea of how 'things' should be named, and where they should live. In order to get everyone on the same page to achieve maximum project consistency, a structure should be agreed upon beforehand.


[There](https://reactjs.org/docs/faq-structure.html) [are](https://daveceddia.com/react-project-structure/) [many](https://levelup.gitconnected.com/structure-your-react-redux-project-for-scalability-and-maintainability-618ad82e32b7) [topics](https://survivejs.com/react/advanced-techniques/structuring-react-projects/) [on](https://hackernoon.com/the-100-correct-way-to-structure-a-react-app-or-why-theres-no-such-thing-3ede534ef1ed) [file](https://blog.bitsrc.io/structuring-a-react-project-a-definitive-guide-ac9a754df5eb) [structure](https://medium.com/@alexmngn/how-to-better-organize-your-react-applications-2fd3ea1920f1). [None](https://medium.com/ottofellercom/how-to-structure-large-react-apps-440b0e012d80) [of](https://redux.js.org/faq/codestructure) [them](https://labs.mlssoccer.com/a-javascript-project-structure-i-can-finally-live-with-52b778041b72) [agree](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#folders-by-feature-structure). [Some](https://gist.github.com/tracker1/59f2c13044315f88bee9) [may](https://www.oreilly.com/library/view/maintainable-javascript/9781449328092/ch13.html) [have](https://wecodetheweb.com/2015/05/28/how-to-structure-your-front-end-application/) [some](https://itnext.io/how-to-structure-a-vue-js-project-29e4ddc1aeeb) [similar](https://kamranahmed.info/blog/2014/08/07/how-to-structure-your-javascript/) [concepts](https://css-tricks.com/how-do-you-structure-javascript-the-module-pattern-edition/). [Some](https://lostechies.com/derickbailey/2012/02/02/javascript-file-folder-structures-just-pick-one/) [may](http://cassandrawilcox.me/setting-up-a-node-js-project-with-npm/) [be](https://neutrinojs.org/project-layout.html) [too](https://guide.meteor.com/structure.html) [relaxed](https://www.sitepoint.com/anatomy-of-a-modern-javascript-application/) [to](https://vuejs-templates.github.io/webpack/structure.html) [be](https://www.sohamkamani.com/blog/2015/08/21/frontend/) [worth](https://scotch.io/tutorials/angularjs-best-practices-directory-structure)[while](http://read.humanjavascript.com/ch04-organizing-your-code.html). [Ultimately](https://engineering.opsgenie.com/how-to-organize-react-files-before-its-messed-up-c85387f691be), [when](https://www.bignerdranch.com/blog/javascript-project-configuration/) [faced](https://en.bem.info/methodology/filestructure/) [with](https://www.toptal.com/meteor/improving-project-structure-meteor-framework) [the](https://www.reddit.com/r/reactjs/comments/8ogngn/what_is_the_most_efficient_folder_structure_for_a/) [choice](https://github.com/aurelia/framework/blob/master/doc/article/drafts/Aurelia%20Project%20Structure.md) [of](https://tech.offgrid-electric.com/domain-directory-structure-for-react-apps-why-its-worth-trying-b3855ee77a1e) [where](https://www.nylas.com/blog/structuring-a-complex-react-redux-project) [to](https://blog.usejournal.com/folder-structure-in-react-apps-c2ae8974d21f) [put](https://expertise.jetruby.com/how-to-properly-structure-your-react-applications-5609ad3f2ee6) [a](http://react-file-structure.surge.sh/) [file](https://geeks.uniplaces.com/how-to-keep-your-ember-js-project-clean-and-well-structured-fbff040274de), [everyone's](https://deaddesk.top/choosing-the-proper-redux-project-structure/) [preference](https://mdbootstrap.com/angular/angular-project-structure/) [seems](http://jamesknelson.com/cruv-react-project-structure/) [to](https://www.c-sharpcorner.com/blogs/folder-structure-of-angular-5-project) [be](https://www.academind.com/learn/vue-js/nuxt-js-tutorial-introduction/folders-files/) [a](https://medium.freecodecamp.org/feature-u-cf3277b11318) [little](https://quasar-framework.org/guide/app-directory-structure.html) [different](http://react-file-structure.surge.sh/).




So, how is _this_ article going to be any different? My goal is to define a set of criteria for which we can assess a folder/file structure, and then to describe a reasonable start to a structure that can work as a base for any single-page-app in any ecosystem -- React, Vue, Angular, or Ember.


Firstly, let's define the criteria that we'll assess structures with.
1. Users should be able to maintain their apps without worrying about the structure of their imports inhibiting them from making changes.
2. Related files should be discoverable, such that a user does not need to hunt for a file should they not be using TypeScript (where you'd be able to use "Go to definition"
3. Related files should be accessible, such that a user can easily locate a related file without having any IDE features (i.e.: browsing on github).
4. Users should have reasonable context at any level within their project hierarchy. Flattening out too much _is_ overwhelming and reduces the ability to maintain, discover, and access.
5. Refactoring sections of the project should be easy. When moving a directory to a new location, the internal behavior should remain functional.
6. The right way and place to add a new thing should be obvious and a structure should not allow for unnecessary decisions.
7. Tests and styles should be co-located along side components.
8. Avoid the infamous "titlebar problem", where a bunch of files all named the same can't be differentiated in the editor (though, a lot of this is editor-based)
9. The structure should not impose limitations that would prevent technical advancement -- such as the addition of [code-splitting](https://survivejs.com/webpack/building/code-splitting/) to a project that does not yet have it.



## The general-enough-to-work-for-all-apps-layout:

Note that any combination of `{folder-name}/component.js,template.hbs` should be synonymous with:
 - React: `{folder-name}/index.jsx,display.jsx`
 - Vue: `{folder-name}/index.vue,display.vue`
 - Angular: `{folder-name}/component.js,template.html`
 - Ember: `{folder-name}/component.js,template.hbs`
 - etc

Also, note in these examples are shorthand, and some projects (particularly Angular projects), like to be _very_ explicit with naming, such as `ComponentName/ComponentName.Component.js`.

```
src
├── data
├── redux-store
├── ui
│   ├── components
│   │   └── list-paginator
│   │       ├── paginator-control
│   │       │   ├── component.js
│   │       │   └── template.hbs
│   │       ├── component.js
│   │       ├── integration-test.js
│   │       └── template.hbs
│   ├── routes
│   │   ├── login
│   │   │   ├── acceptance-test.js
│   │   │   ├── route.js
│   │   │   └── template.hbs
│   │   └── post
│   │       ├── -components
│   │       │   └── post-viewer
│   │       │       ├── component.js
│   │       │       └── template.hbs
│   │       ├── edit
│   │       │   ├── -components
│   │       │   │   ├── post-editor
│   │       │   │   │   ├── calculate-post-title.js
│   │       │   │   │   ├── component.js
│   │       │   │   │   └── template.hbs
│   │       │   │   ├── route.js
│   │       │   │   └── template.hbs
│   │       │   ├── route.js
│   │       │   └── template.hbs
│   │       ├── route.js
│   │       └── template.hbs
│   ├── styles
│   │   └── app.scss
│   └── index.html
└── utils
    └── md5.js
```

Going though the folders from top to bottom, because dev.to doesn't allow inline links without code fences... (a great feature of one of [prism.js'](https://prismjs.com/) plugins.

### `src`

Most of this will focus on the `src` directory, as any other top-level folder or file tends to be more project or ecosystem specific, and may not generally translate to projects cross-ecosystem. Some examples of those folders that may not translate due to project-specific or build-configuration-specific reasons are: `app/`, `tests/`, `vendor/`, `public/`, `config/`, `translations/`, etc.

### `src/data`

This directory is intended for all api-related data interactions and representations. In an app where you have the model-adapter-serializer pattern, you may want additional folders within `src/data` such as `models` or `transforms`, depending on how much normalization you desire within your application. This is why it doesn't necessarily make sense to have anything named more specific or vague.

### `src/redux-store`

If using redux, most guides and tutorials just use the same `store`, which can be ambiguous, since `store` is a construct used by any library that maintains a cache of data. So not only in [Redux](https://redux.js.org/api/store), but also in [Orbit.js](http://orbitjs.com/v0.15/guide/#Orbit-primitives), and [ember-data](https://guides.emberjs.com/release/models/#toc_the-store-and-a-single-source-of-truth).

For more info on app-level state management, [See this article comparing state mangement in both React and Ember](https://www.developertown.com/react-vs-ember-part-2-state-management/)


### `src/ui`

The entirety of anything that directly affects the display should go in the `ui` folder. This includes styles, components, and routes. The user interface can exist independent of data, application state, and utilities.

### `src/ui/routes`

Most single page apps are using some sort of router, and therefor the UI is entirely route based. What components display are determined by what routes are active. Due to this coupling of display, and consequently, behavior with the browser URL, it should only be natural to divide up your app by the natural route boundaries. Splitting the UI by route also lends itself to straight-forward code-splitting on the route boundaries.

### `src/ui/routes/{route-name}/-components`

In a [recent React project](https://github.com/sillsdev/appbuilder-portal/tree/33f2ada4c2601d6586ca89b934f83dae0d44e5b0/source/SIL.AppBuilder.Portal.Frontend/src/data), I've tried to omit the route-level private components directory, but it's lead to confusion between what is intended for the route, and what is there to support what is rendered on the route.  I had originally omitted the `-components` directory thinking that if I/my team just use the right folders, [things wouldn't be so bad](https://github.com/sillsdev/appbuilder-portal/tree/ee84202aa0717191c03a12f51c5542cfb02222c5/source/SIL.AppBuilder.Portal.Frontend/src/ui/routes/project).

An example of a page where you'd want nested routes separate from your components is tabbed navigation:

```
posts/post
├── view/
├── comment-moderation/
├── publishing-options/
│   ├── -components/
│   │    ├── confirm-publish-modal.jsx
│   │    └── social-media-blast-options.jsx
│   └── index.jsx
└── edit/
    ├── -components/
    └── index.jsx

```

This structure, unlike the above link (_[things wouldn't be so bad](https://github.com/sillsdev/appbuilder-portal/tree/ee84202aa0717191c03a12f51c5542cfb02222c5/source/SIL.AppBuilder.Portal.Frontend/src/ui/routes/project)_), this has a clear, explicit separation of components and route-specific components.  In the [linked react app](https://github.com/sillsdev/appbuilder-portal/tree/ee84202aa0717191c03a12f51c5542cfb02222c5/source/SIL.AppBuilder.Portal.Frontend/src/ui/routes/project), I've also been playing with keeping local-only higher-order components (HoCs) at the top route-level due to their one-time use nature -- though, in this particular app, [commonly-used](https://github.com/sillsdev/appbuilder-portal/blob/ee84202aa0717191c03a12f51c5542cfb02222c5/source/SIL.AppBuilder.Portal.Frontend/src/ui/routes/project-directory/index.tsx#L96) HoCs are moved to the data directory. I'm still kind of playing around with the idea, but the HoC locations are more specific to the functional single-page-apps such as those that would be react-based.



One criteria to use to know if your structure is heading in the right direction is how often you end up using `../` or `../../` in your import paths.  Using upwards reverse relative paths violates our `Goal #5` stating that any subtree can change location and the functionality of the contents should remain in a working state. The above example should not inherently have any reverse-relative pathing.

An example violating `Goal #5`:

```
posts/post
├── view/
├── comment-moderation/
├── publishing-options/
│   └── index.jsx
├── confirm-publish-modal.jsx
├── social-media-blast-options.jsx
└── edit/
    └── index.jsx
```

Here, `publishing-options` files must use `../` to access the components defined at the parent level.



### `src/utils`

Any functions, classes, or utilities should live in `src/utils`. These files should be purely unit testable, as they should have no app dependencies. This includes things like string format conversion, auth0 wrappers, `fetch` abstractions, etc.

### Overall

Let's revisit our goals, and look out how this proposed layout meets each one:

**1)** _Users should be able to maintain their apps without worrying about the structure of their imports inhibiting them from making changes._

Achieving this goal is mostly through simply having _any_ documented convention that can be referenced later. There are currently no general static analysis tools to help out with _enforcing_ a structure -- though, there is one tool for one of the major frameworks that dictates structure. (See _Implementation_ below)


**2)** _Related files should be discoverable, such that a user does not need to hunt for a file should they not be using TypeScript (where you'd be able to use "Go to definition"_

By having related files next to each other in this layout, everything is contextual by nature. If someone is a heavy file-tree/project-tree browser, they'll have an easy time navigating and discovering what they're working on and what is involved.


**3)** _Related files should be accessible, such that a user can easily locate a related file without having any IDE features (i.e.: browsing on github)._

This is related to (2), but more enforces co-location. When browsing files quickly online, without editor or typescript features, it's convenient to be able to click through as few web pages as possible to view related components.


**4)** _Users should see have reasonable context at any level within their project hierarchy. Flattening out too much _is_ overwhelming and reduces the ability to maintain, discover, and access._

By having a nested structure by route, any component that is only used in one place will by contextually co-located to its usage. This keeps the amount of large flat folders to a minimum, and allows for understand the greater design of the app without having to follow references everywhere.  Sibling folders are to be treated as complete unrelated (adopted?).


**5)** _Refactoring sections of the project should be easy. When moving a directory to a new location, the internal behavior should remain functional._

I hope this one is self-explanatory, but this folder/file structure allows for drag-and-drop refactoring where any folder moved should have all of its internal tests still passing.


**6)** _The right way and place to add a new thing should be obvious and a structure should not allow for unnecessary decisions._

This, in part, relies on both documentation and programmatic enforcement. The structure follows a strict set of rules that can be easily learned. For example, when using this folder/file stricture, by default, things should be going in `-components` folders as you build out a route. For more inspiration on what kind of rules there could be, read about [The Octane layout (formally Module Unification)](https://github.com/emberjs/rfcs/blob/master/text/0143-module-unification.md)


**7)** _Tests and styles should be co-located along side components._

Instead of in a top-level `tests/` directory, tests can be contextually located with the thing that they are testing. This works for unit, integration, and acceptance tests. There will, of course, be exceptions to this, where you may be testing something app-wide and it has no specific context -- for those situations, I tend to just put tests in `tests/acceptance/` (if they are acceptance tests).


**8)** _Avoid the infamous "titlebar problem", where a bunch of files all named the same can't be differentiated in the editor (though, a lot of this is editor-based)_

The tab problem _shouldn't_ be a thing in modern editors

(neo)Vim: ![tabs vim](https://thepracticaldev.s3.amazonaws.com/i/owfnzb4fkonys4uoex7t.png)
VSCode: ![tabs vscode](https://thepracticaldev.s3.amazonaws.com/i/bi4upaoiypp4vsxuaano.png)
Atom: ![tabs atom](https://thepracticaldev.s3.amazonaws.com/i/2cb0ut4lwxfqn4pnc689.png)


**9)** _The structure should not impose limitations that would prevent technical advancement -- such as the addition of [code-splitting](https://survivejs.com/webpack/building/code-splitting/) to a project that does not yet have it._

Because the files locations can be fitted to a rule, (i.e: `src/${collection}/${namespace}/${name}/${type}`), we can programatically crawl across the project and experiment with 'conventions', or compile scss without importing into the javascript, or invoke some transform on a particular sub-tree of the project.

A more concrete / real-world example (in user-space), by having the files split apart by route, we allow the file system to know our natural route/code-splitting boundaries -- which makes for a much easier implementation of code-splitting.



## Implementation

1. How do you get everyone on the same page when anything can go?
2. How do you achieve consistency between developers?
3. How do you remember where something _should_ go?
4. How do you manage imports with all these file trees?


For 1 through 3, the only answer for most projects is in-depth code reviews. After the first few established routes, it'll get easier to maintain. But it is inevitably a manual process, as most ecosystems do not have a way to programatically enforce conventions.

For managing imports, the best thing to do is to set up absolute aliases to common entry points.

For example:
```
    "paths": {
      "project-name/*: ["."],
      "@data/*": ["src/data/*"],
      "@models/*": ["src/data/models/*"],
      "@ui/*": ["src/ui/*"],
      "@components/*": ["src/ui/components/*],
      "@env": ["src/env.ts"],
      "tests/*": [ "tests/*" ],
      "*": ["types/*"],
```

This does mean that if you have deeply nested components, your import paths may be long, but they are easy to `grep` for, and you'll have an easier time moving subtrees around since there are no relative paths to worry about breaking.


An example of a React app implementing most of the criteria outline in this post: [Example React App](https://github.com/sillsdev/appbuilder-portal/tree/33f2ada4c2601d6586ca89b934f83dae0d44e5b0/source/SIL.AppBuilder.Portal.Frontend/src/data)



However, in Ember, there is a [resolver](https://github.com/ember-cli/ember-resolver).  The resolver defines a set of rules for finding things and contextually discovering components, routes, data models, etc. There are a set of conventions that allow the resolver to find things in app-space, so that you don't need to worry about importing them. There is a reference, the resolver looks up the reference, and the thing stubbed in.

Something unique about ember, is that it has a bunch of build-time optimizations that the other ecosystems don't have. This is powered by broccoli, where you can transform parts of your app file tree during the build process. Ember uses this to swap out lookups with the actual reference to a component (for example, could be other things). Broccoli is also used to swap out simple helpers such as `{{fa-icon}}` with the rendered html during build so that the bundle can be smaller.

To read more about ember's resolver, feel free to checkout [DockYard's article, "Understanding Ember's resolver"](https://dockyard.com/blog/2016/09/14/understanding-ember-s-resolver)
To read more about Broccoli, Oli Griffith has an _amazing_ [guide / tutorial on it](http://www.oligriffiths.com/broccolijs/)


An example of this structure can be found here:
[emberclear at gitlab](https://gitlab.com/NullVoxPopuli/emberclear/tree/master/packages/frontend) (this is the code for [emberclear.io](https://emberclear.io), one of my side projects).


[The Octane Layout's](https://github.com/emberjs/rfcs/blob/master/text/0143-module-unification.md) folder structure satisfies nearly all use cases. And the majority of this post represents a subset of the ideas from the The Octane Layout's RFC.

Note that the Octane layout is not yet released. It's coming early 2019, along with the release [Ember Octane](https://github.com/tomdale/rfcs/blob/2018-roadmap/text/0000-roadmap-2018.md)


Would I say that this in _the_ layout people should use? maybe. There is some breathing room between what I've outlined for all js ecosystems to use and what the Octane layout dictates for ember-specific apps. Ultimately, if you are in an ecosystem where you have to decide how to lay things out, just keep the guidelines in mind as your placing files around, or copy everything here -- but with some tweaks. Ultimately, you need to do what is best for your team. Personally, with React, I feel *close*. Maybe there is a tool that could be written for non-ember projects that helps guide structure. Like a linter, but for file locations.
