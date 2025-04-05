---
title: Ember has typesafe HTML 
image: /images/photo-1577404328109-121a7e888683.avif
imageMeta:
  attribution: "Michael Walter"
  attributionLink: https://unsplash.com/photos/gray-concrete-building-FhiShZ6eXVQ 
featured: true
authors:
  - nullvoxpopuli
date: Sat Apr 05 2025 12:18:50 GMT-0500 (Eastern Standard Time)
tags:
  - ember
  - javascript
---

Ember has had typesafe HTML for a while now. Details on getting it set up [are here on the Glint repo](https://github.com/typed-ember/glint/blob/main/GLINT_V2.md). 

tl;dr: install the pre-release version of the Glint extension and enable `@builtin typescript`.

We're using the pre-release version of Glint here because it provides a far superior editing than the currently released stable version of Glint. Glint V2 is powered by [Volar](https://volarjs.dev/) and lines up nicely with the [Polaris](https://emberjs.com/editions/polaris/) efforts to align with broader ecosystem tooling in a way that unblocks all experimentation while also still supporting older code so that large codebase have a path to the modern tooling and DX.

For neovim, I need to PR to the built in configs to make switching to the glint ts-plugin automatic, but here is what it looks like!

![image of href completion](/images/typesafe-html/href.png)
![image of href type error](/images/typesafe-html/href-error.png)
![image of aria atttribute completion](/images/typesafe-html/aria.png)
