import { LinkTo } from "@ember/routing";

import { pageTitle } from "ember-page-title";

import site from "#site";

<template>
  {{pageTitle site.title}}

  <header class="site-header">
    <LinkTo @route="index" class="site-title">
      <svg class="site-mark" viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
        <defs>
          <linearGradient id="carapace" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#c3a5ff" />
            <stop offset="1" stop-color="#5f4494" />
          </linearGradient>
        </defs>
        <path
          fill="url(#carapace)"
          d="M16 1Q18 7 22 9Q27 8 31 5Q28 11 26 16Q28 21 31 27Q27 24 22 23Q18 25 16 31Q14 25 10 23Q5 24 1 27Q4 21 6 16Q4 11 1 5Q5 8 10 9Q14 7 16 1Z"
        />
        <path fill="#1b1220" d="M16 9Q24 16 16 23Q8 16 16 9Z" />
        <path class="site-mark-pupil" d="M16 11Q18 16 16 21Q14 16 16 11Z" />
      </svg>
      {{site.title}}
    </LinkTo>
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
