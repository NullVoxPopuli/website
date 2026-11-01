import { LinkTo } from "@ember/routing";

import { pageTitle } from "ember-page-title";

import site from "#site";

<template>
  {{pageTitle site.title}}

  <header class="site-header">
    <LinkTo @route="index" class="site-title">{{site.title}}</LinkTo>
    <nav aria-label="Site">
      {{#each site.navigation as |item|}}
        <LinkTo @route="page" @model={{item.page}}>{{item.label}}</LinkTo>
      {{/each}}
      <a href="/rss.xml">RSS</a>
    </nav>
  </header>

  <main>
    {{outlet}}
  </main>
</template>
