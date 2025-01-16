---
title: Design Systems in Ember
image: /images/clark-van-der-beken-P6jpTN3c8uY-unsplash.jpg
imageMeta:
  attribution: "Clark Van Der Beken"
  attributionLink: https://unsplash.com/photos/brown-concrete-building-P6jpTN3c8uY
featured: true
authors:
  - nullvoxpopuli
date: Thu Jan 16 2025 12:18:50 GMT-0500 (Eastern Standard Time)
tags:
  - ember
  - javascript
  - design
---

Design systems help you prototype apps faster, and focus on shipping, rather than re-inventing the wheel.

CSS frameworks a great way to start a project, but long-lived projects need interactivity to truly feel like an application. 

This post is a curation of libraries to help you get started with bootstrapping your app, or creating your own design system, so you don't need to go looking for things!
(and I'll try to keep it up to date as new libraries are published).

 
> NOTE: Some of what is in here is my opinion, and not necessarily representative of the opinions of others / groups I'm a member of. 


As of 2025, these are a good few maintained design systems, and here I've broken them up into some categories: 
The "Polaris" category can be used as a learning tool to see how folks should be writing ember _today_. 
There is "Pre-Polaris", which means that the design system is nearly Polaris, but missing one or two modern patterns to be considered Polaris.
Lastly, there is the "Needs Work" category, which is to concisely say that the design systems has a number of migrations to do before I would recommend someone look at the code for learning how to write modern Ember.

<style>
  /* blog theme uses the wrong default */
  p img {
    max-width: 100% !important;
  }
</style>

## Polaris 

- [Elastic EUI](https://github.com/prysmex/ember-eui/tree/master) » [Docs](https://ember-eui.vercel.app/) | [npm](https://www.npmjs.com/package/@ember-eui/core)

    ![screenshot of EUI](/images/design-systems/ember-eui.png)

    ```bash
    npm add @ember-eui/core 
    ```

    This design system from [Prysmex](https://www.prysmex.com/) is a fully modern, thorough, up to date design system.
    There are enough components to build whole products without creating any additional components.

- [Hokulea](https://github.com/hokulea/hokulea) » [Docs](https://hokulea.netlify.app/) | [npm](https://www.npmjs.com/package/@hokulea/ember) 

    ![screenshot of Hokulea](/images/design-systems/hokulea.png)

    ```bash
    npm add @hokulea/ember
    ```

    Hokulea is a fully modern _whimsical_ design system from [gossi](https://github.com/gossi) that demonstrates Storybook integration and workflows for documenting each component. This design system supports themeing, is research driven, and has enough components to build a real product without needing to write more components!

- [Frontile](https://github.com/josemarluedke/frontile) » [Docs](https://frontile.dev/) | [npm](https://www.npmjs.com/package/@frontile/buttons) 

    ![screenshot of Frontile](/images/design-systems/frontile.png)

    ```bash
    npm add @frontile/buttons @frontile/overlays # ... 
    ```

    This design system from [josemarluedke](https://github.com/josemarluedke) is a fully modern, thorough, up to date design system.
    There are enough components to build whole products without creating any additional components.

- [Carbon](https://github.com/IBM/carbon-components-ember) » [Docs](https://ibm.github.io/carbon-components-ember/) | [npm](https://www.npmjs.com/package/carbon-components-ember) 

    ![screenshot of Carbon](/images/design-systems/carbon.png)

    ```bash
    npm add carbon-components-ember
    ```

    This design system from [IBM](https://www.ibm.com/) is one of the more modern codebases, though, in poking around their documentation, I found a few CSS bugs. 
    They use TypeScript, gjs/gts, and the V2 Addon (native library) format.

## Pre-Polaris 

- [Helios](https://github.com/hashicorp/design-system) » [Docs](https://helios.hashicorp.design/) | [npm](https://www.npmjs.com/package/@hashicorp/design-system-components)

    ![screenshot of Helios](/images/design-systems/helios.png)
    
    ```bash
    npm add @hashicorp/design-system-components
    ```

    Helios is a design system by [Hashicorp](https://www.hashicorp.com/), so it is well funded and maintained, as well as made with influence from accessibility experts.
    However, my main critique is that it does not use the `gjs` or `gts` file format, making this design system "Pre-Polaris".

## Needs Work 

These are also "V1 Addons" -- which are node programs that your app runs during your app's build, and the node programs happen to emit browser JavaScript.
This is different from normal browser libraries (sometimes call "V2 Addons"), which are compiled when the library is published.

- [UI Kit](https://github.com/adfinis/ember-uikit) » [Docs](https://docs.adfinis.com/ember-uikit/) | [npm](https://www.npmjs.com/package/ember-uikit)

    ![screenshot of UI Kit](/images/design-systems/uikit.png)

    ```bash
    npm add ember-uikit
    ```

    This design system looks polished, but it provides no Types, is not a V2 Addon, and doesn't use any gjs or gts components -- however, this does not mean it's not a solid choice for bootstrapping a new project! If you're writing javascript, and don't want to read this design-system's code, this is a _fine_ option.


- [Bootstrap](https://www.ember-bootstrap.com/) » [Docs](https://www.ember-bootstrap.com/) | [npm](https://www.npmjs.com/package/ember-bootstrap)

    ![screenshot of Bootstrap](/images/design-systems/ember-bootstrap.png)

    ```bash
    npm add ember-bootstrap
    ```

    This library provides a good few interactive components where the [Bootstrap](https://getbootstrap.com/) CSS Framework would not be sufficient for building applications.
    This library is not a V2 Addon, does not use Types, and doesn't use any gjs or gts components.


- [Material Design](https://github.com/adopted-ember-addons/ember-paper) » [Docs](https://ember-paper.netlify.app/) | [npm](https://www.npmjs.com/package/ember-paper)

    ![screenshot of ember-paper](/images/design-systems/ember-paper.png)

    ```bash
    npm add ember-paper
    ```

    Material design is starting to look a little dated these days, but maintenance of this design system is still on-going. It provides no types, is not a V2 Addon, and doesn't use any gjs or gts components.



## Want to build your own?

Ember authors great ergonomics for creating design systems!

And to help build design systems _even_ faster, there a number of libraries that abstract away a lot of the menial things that you'd have to implement anyway on top of the platform (while deferring to the platform as often as possible ( as we all know: the best code is the code that isn't needed in the first place )) 

UI Primitives:
  - [ember-sortable](https://emberobserver.com/addons/ember-sortable) - primitives for sorting, drag & drop
  - [ember-primitives](https://ember-primitives.pages.dev/) - Styleless, Accessibility-focused primitives that help you build faster UIs. Not just components, but light/dark mode management, popover management, etc.
  - [ember-headless-table](https://github.com/CrowdStrike/ember-headless-table) - a plugin-based styleless way of building complex table UIs with sorting, column-reordering, etc
  - [ember-headless-form](https://github.com/CrowdStrike/ember-headless-form) - an Accessibility-focused way of taking the boilerplate out of highly-managed form experiences, including local errors, server errors, etc -- giving you the primitives, to expose powerful design-system forms with a great pit of success .
  - [ember-focus-trap](https://emberobserver.com/addons/ember-focus-trap) - element modifier for trapping focus within the element.

Utility Primitives:
  - [reactiveweb](https://reactive.nullvoxpopuli.com/) - low-level reactive utilities and reactive wrappers of common web APIs.
  - [ember-keyboard](https://emberobserver.com/addons/ember-keyboard) - easy key-combos.
  - [ember-concurrenty](https://emberobserver.com/addons/ember-concurrency) - easy concurrent behaviors, prevent users from submitting forms multiple times.
  - [ember-statechart-component](https://github.com/NullVoxPopuli/ember-statechart-component) - Use XState statecharts as components, allowing easy drop-in diagram-based logic implementation.

Testing and Documentation:

  - [@ember/test-waiters](https://emberobserver.com/addons/@ember/test-waiters) - tie async-behaviors to the settled state system, so users have an easy time with tests (no wait-for, etc).
  - [ember-a11y-testing](https://emberobserver.com/addons/ember-a11y-testing) - Add AXE accessibility testing to your automated tests.
  - [@universal-ember/test-support](https://github.com/universal-ember/test-support) - Additional common test utilities to use on top of those provided from [`@ember/test-helpers`](https://github.com/emberjs/ember-test-helpers) or [`testing-library`](https://testing-library.com/docs/dom-testing-library/intro)
  - [Kolay](https://github.com/universal-ember/kolay) - a runtime-rendered documentation framework allowing easy documentation of design systems, component libraries, all in a familiar markdown format. 
      - This is pre-alpha right now, so unless you want to help fix bugs, you may be more interested in:
        - [Docfy](https://docfy.dev/) 
        - [field-guide](https://github.com/empress/field-guide) 

Build Tools:

  - [@responsive-image/ember](https://emberobserver.com/addons/@responsive-image/ember) automatically create responsive optimized images and fast page loads -- part of [responsive-image](https://github.com/simonihmig/responsive-image) 


Other:

  - [Shepherd](https://github.com/RobbieTheWagner/ember-shepherd) - guided walkthroughts for introducing users to things


