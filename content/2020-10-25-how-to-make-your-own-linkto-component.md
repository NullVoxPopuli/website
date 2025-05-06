---
title: How to Make Your Own LinkTo Component
image:
imageMeta:
  attribution:
  attributionLink:
featured: true
authors:
  - nullvoxpopuli
date: Sun Oct 25 2020 09:55:36 GMT-0400 (Eastern Daylight Time)
tags:
  - new
---

# How to make your own LinkTo component

Good luck on your new post!

Finished Code & Demo: https://codesandbox.io/s/custom-link-component-dgbxl?file=/app/components/link.hbs

Upcoming changes to `<LinkTo>` from [RFC 391](https://github.com/emberjs/rfcs/blob/master/text/0391-router-helpers.md)
> In the past, only HTMLAnchorElements that were produced by {{link-to}}s would produce a transition when a user clicked on them. This RFC changes to the global EventDispatcher to allow for any HTMLAnchorElement with a valid root relative href to cause a transition. This will allow for us to not only allows us to support use cases like the ones described in the motivation, it makes teaching easier since people who know HTML don't need know an Ember specific API to participate in routing transitions.

