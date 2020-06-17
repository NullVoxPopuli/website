---
title: "React Response: Hot Loading"
image: /images/timothy-meinberg-206976-unsplash.jpg
imageMeta:
  attribution:
  attributionLink: https://unsplash.com/photos/xqV9QdGOSas
featured: true
authors:
  - nullvoxpopuli
date: Sat Jun 01 2019 17:10:54 GMT-0400 (Eastern Daylight Time)
tags:
  - ember
  - react
---

# React Response: Setting up Hot Module Replacement

Partially due to the fact that I find coming up with things to write about somewhat difficult, I've been seeking articles from the React community to rewrite for Ember (primarily [on twitter](https://twitter.com/nullvoxpopuli/status/1134602455088619521)). This'll help the searchability of common patterns people may be familiar with when coming from React, or any other ecosystem which also has a similar nomenclature.

My hope for this series is only two things:
 - Improve the perception of Ember with respect to modern features and behavior
 - Show how conventions and architectural patterns can make everyone's lives easier.


In response to [Setting Up Webpack for React and Hot Module Replacement](https://thoughtbot.com/blog/setting-up-webpack-for-react-and-hot-module-replacement) (by thoughtbot), as proposed by [@j_mcnally](https://twitter.com/j_mcnally/status/1134844414256386048), I'll be going through the article in chunks as there are correlations with how all of what is explained could be done in an ember project.
The article is broken out into a few short sections:

1. Initializing a project

2. Setting up webpack

    a. Basic configuration

    b. Adding loaders

 3. Writing React components

    a. Adding an index page

 4. Setting up the webpack dev server

    a. Hot module replacement

It's a short article, and the first half is setting up the project -- so, if you have a terminal shell ready and are all setup for javascript development, feel free to run the following command to instantiate your project, and we can skip parts `1`, `2`, `2a`, `2b`, `3a` and `4` (we'll get to `4a shortly`).

Note: if all you care about is how to do Hot module replacement, feel free to [skip ahead](#hmr)

```bash
npx ember-cli new hmr-demo -b @ember/octane-app-blueprint
```

Depending on your familiarity with ember, it may seem like this _isn't enough_ to set up a project. Well, my friends, with the power of conventions and agreed upon tooling, the above command bundles all the above setup steps so that you don't need to care about them when making apps.  Sure, if you enjoy tweaking webpack configs to try to squeeze out more loading performance or reduce bundle size in a variety of ways, that's fine -- but for _being productive in feature development_, it's not something that needs to be repeated for every project -- even in the React world, and especially at my previous company [DeveloperTown](http://developertown.com/) (a consultancy), configuration files were copied and pasted between projects.

Next up, let's look at writing components in Ember -- by rewriting the "Greeting" component from the thoughtbot article.

```bash
yarn ember g component greeting
```
This creates 3 files as shown in this screenshot of the terminal output:
![the output from running yarn ember g component greeting](/images/post-2019-06-generate-greeting-component.png)

While the generate component command gives you 3 files, you don't _need_ each of them. The generate command gives you those files so that, for most components, you have the availability to quickly open and edit, without having to create the files yourselves and implement the boilerplate.


in `app/templates/components/greeting.hbs`, we'll type out a little template that says Hello to whatever name we pass in. We can ignore the greeting.js and greeting-test.js files for now.
```handlebars
<div class='greeting'>
  Hello, {{@name}}!
</div>
```


Inside of `app/templates/application.hbs`, the entrypoint to rendering our application, we need to render our `Greeting` component.

```handlebars
<Greeting @name="Kerrigan" />

{{outlet}}
```

A note about the syntax used here, if coming from React, or any other ecosystem, the `@` used when invoking a component signifies that the key-value pair is an argument, and not an attribute, such as `class` or `data-test` would be. This allows for some nice API design when building UI components where you want to give control of attribute values to the caller. For more information on this, see [@pzuraq](https://twitter.com/pzuraq)'s blog post on [Angle Brackets and Named Arguments](https://www.pzuraq.com/coming-soon-in-ember-octane-part-2-angle-brackets-and-named-arguments/)


<span id='hmr' />
## Hot module replacement

There is a package called [ember-ast-hot-load](https://github.com/lifeart/ember-ast-hot-load) which will do all of the hot module replacement for us. This enables us to maintain the greater application state while we work on individual components. We don't need to wait for the entire app to rebuild, or the page to refresh. This greatly benefits our development feedback loop by reducing wait time.

To install the package, we can run:

```bash
yarn ember install ember-ast-hot-load
```

Now we'll want to start our development server with

```bash
yarn start
```


To see the speed that hot module replacement gives you, let's modify the greeting component by wrapping the text in an `h1` tag.


in `app/templates/components/greeting.hbs`:
```handlebars
<div class='greeting'>
  <h1>Hello, {{@name}}!</h1>
</div>
```

When you save the file you'll see the page update automatically without a page reload. If you don't believe it, feel free to remove the ember-ast-hot-load package from package.json and restart the dev server.


That's it!

<hr />

tl;dr:

```bash
yarn ember install ember-ast-hot-load
```

done.

## Want More Information?
 - [Getting started (general)](https://guides.emberjs.com/release/getting-started/quick-start/)
 - [Templates in Ember](https://guides.emberjs.com/release/templates/handlebars-basics/)
 - [Components](https://guides.emberjs.com/release/components/defining-a-component/)
 - [Addons and Dependencies](https://guides.emberjs.com/release/addons-and-dependencies/managing-dependencies/)
 - [Ember for React Developers](https://emberatlas.gitbook.io/emberatlas/learning/coming-from-another-ecosystem/ember-for-react-developers#component-patterns)
