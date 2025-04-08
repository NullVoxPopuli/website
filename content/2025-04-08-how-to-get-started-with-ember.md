---
title: How to get started with Ember 
image: /images/photo-1649234173443-1a9ab382f599.avif
imageMeta:
  attribution: "Abhinav Chitkela"
  attributionLink: https://unsplash.com/photos/a-red-fire-hydrant-mounted-to-the-side-of-a-building-DTUNQTpATy0 
featured: true
authors:
  - nullvoxpopuli
date: Tue Apr 8 2025 08:22:45 GMT-0400 (Eastern Daylight Time)
tags:
  - new
  - ember
---

# How to get started with Ember

For questions / concerns / updates, feel free to ask in:

* The [Official Ember Discord](https://discord.gg/emberjs)
* My [Personal Discord](http://discord.gg/cTvtmJhFNY)

_While you may use ember for your frontend application, most of the code you will encounter is non-ember aka “just javascript”. Learning ember will allow you to quickly get to shipping or debugging features for non-company-specific problems._

_The goal is for the framework to stay out of your way_. If you feel any resistance to doing your work, **regardless of the cause**, please let me know.

## Where to get started

* Already know another framework?
    * Compare component-patterns between Ember Polaris and other frameworks 
        * [React](https://component-party.dev/compare/emberPolaris-vs-react), [Solid](https://component-party.dev/compare/emberPolaris-vs-solid), 
        * [Vue 3](https://component-party.dev/compare/emberPolaris-vs-vue3), [Vue 2](https://component-party.dev/compare/emberPolaris-vs-vue2)
        * [Svelte 5](https://component-party.dev/compare/emberPolaris-vs-svelte5), [Svelte 4](https://component-party.dev/compare/emberPolaris-vs-svelte4)
        * [Lit](https://component-party.dev/compare/emberPolaris-vs-lit)
        * [Angular Renaissance](https://component-party.dev/compare/emberPolaris-vs-angularRenaissance), [Angular](https://component-party.dev/compare/emberPolaris-vs-angular)
        * [Ember Octane](https://component-party.dev/compare/emberPolaris-vs-emberOctane)
* Tutorials
    * how-to and [interactive guide](https://tutorial.glimdown.com/)
    * full and [official tutorial and walkthrough](https://guides.emberjs.com/release/tutorial/part-1/), which guides you through building a real application 
* AI Chat
    * There is a [custom GPT in the ChatGPT marketplace](https://chatgpt.com/g/g-NlX2z2g6H-ember-assistant)     trained on ember knowledge - it’s able to convert between frameworks, so if you don’t like tutorials or prefer to learn by trial and error, you may want to start here.
(It’s important to use this over general trained AI, this custom GPT has been told to favor newer patterns instead of older patterns)
* Guided documentation:
    * Guides on many topics for developing apps on [the official website](https://guides.emberjs.com/release/components/)

If you want to take a step back and learn things how the framework has organized, you may want to start on this page: [The official Learn Ember](https://emberjs.com/learn/ ) page.

## Once you have some familiarity 

* Reference documentation
    * [Runtime Framework APIs](https://api.emberjs.com/ember/release)
    * [Data / warp-drive APIs](https://api.emberjs.com/ember-data/release/modules/ember-data-overview?show=inherited)
        * [Newer concepts](https://github.com/emberjs/data/tree/main/guides) 


* Messin’ around
    * [Online REPL](https://limber.glimdown.com/edit?c=JYWwDg9gTgLgBAYQuCA7Apq%2BAzKy4DkAAgOYA2oI6UA9AMbKQZYEDcAUKJLHAN5wwoAQzoBrdABM4AXzi58xcpWo1BI0cFQk2nFD35oZcvCEJF0IAEYqQECcGzBqO9ugAe3eBPTYhAVzJ4OjIhAGdQuAARCwg4dxhMCQikFGZ4XnY4OCI1MUk4AH0GPyw4AF44AAYOTLgSdCCIEpgACgBKPlqssgbjZABlGGghevK4MCEoUPQASSwWsgg6ITJB4fqAOnqYGYSQFoJiljaOgH5Tqo4srKgGvyhUAQALYFCNoqbSgB8vvpA14SjH6XWrSWrTRrNFoANxWfnQHQy1zgi2WqyGgPQGwhuwsByOMAIABo4LCyPC4Ocqm0rtcYC83h9mmMyfDaWDapo6LcqKUKu1ygA%2BZ6vDYEuAAagqAEYalkADx7MAhBKCrpweVgQUATSacCeQmh6DgwWAeSk9ONlj8MCGj14vHpooJ0lkMFA6De8poWvY6vl1tthhgAE8wOgygAiQN2yN8XiGSOmsRxp1vLk8zAwV2ChAUMTemNoNUK1QWZVCVXsMFAA&format=gjs) - fast way to “just try stuff”
    * Stackblitz - a little slower due to running a whole dev environment in your browser, but most like the local dev experience for default ember apps.
        * [Ember (JavaScript)](https://stackblitz.com/fork/github/ember-cli/editor-output/tree/stackblitz-app-output?title=Ember%20Starter)
        * [Ember (TypeScript)](https://stackblitz.com/fork/github/ember-cli/editor-output/tree/stackblitz-app-output-typescript?title=Ember%20TypeScript%20Starter)

## Vocab

* [_vite_](https://vite.dev/) - the build tool we use — which has many contributors and is leading the JavaScript ecosystem in local build performance
* [_embroider_](https://github.com/embroider-build/embroider/) - the set of tools we use for adapting pre-spec JS to spec-compliant JavaScript  
This is what enables our > 10 year old, multi-million line project to run in vite without a major migration / rewrite, enabling parallel shipping and maintenance.
* _tracked properties_ - what ember calls its wrapper around Signals.  
* _addon_ - alias for “library” 
* [_webpack_](https://webpack.js.org/) - older and slower build tool that we’re migrating away from (or will already have migrated away from by the time you read this)
* _broccoli_ - older and slower build tool that we’re migrating away from (or will already have migrated away from by the time you read this)

