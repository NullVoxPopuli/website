import { LinkTo } from "@ember/routing";

import { ResponsiveImage } from "@responsive-image/ember";
import { pageTitle } from "ember-page-title";

import { authorFor, type loadPost, tagFor } from "#app/content.ts";
import { PostDate } from "#components/date.gts";
import { Head } from "#components/head.gts";
import { Prose } from "#components/prose.gts";

import type { TOC } from "@ember/component/template-only";

const path = (id: string) => `/${id}`;
const authorName = (id: string) => authorFor(id)?.name;
const tagName = (id: string) => tagFor(id)?.name;

const Template: TOC<{ Args: { model: Awaited<ReturnType<typeof loadPost>> } }> = <template>
  {{#let @model.post as |post|}}
    {{pageTitle post.title}}

    <Head
      @title={{post.title}}
      @description={{post.excerpt}}
      @image={{post.image}}
      @path={{path post.id}}
      @type="article"
    />

    <article>
      <header class="post-header">
        <h1>{{post.title}}</h1>
        <p class="post-meta">
          <PostDate @date={{post.date}} />
          {{#each post.authors as |id|}}
            by
            <LinkTo @route="author" @model={{id}}>{{authorName id}}</LinkTo>
          {{/each}}
        </p>
      </header>

      {{#if @model.cover}}
        <figure class="post-image">
          <ResponsiveImage
            @src={{@model.cover}}
            @sizes="(min-width: 44rem) 44rem, 100vw"
            alt=""
            loading="eager"
            fetchpriority="high"
          />
          {{#if post.imageMeta.attribution}}
            <figcaption>
              Photo by
              <a href={{post.imageMeta.attributionLink}}>{{post.imageMeta.attribution}}</a>
            </figcaption>
          {{/if}}
        </figure>
      {{/if}}

      <Prose @html={{@model.html}} />

      {{#if post.tags}}
        <ul class="tag-list" aria-label="Tags">
          {{#each post.tags as |id|}}
            <li><LinkTo @route="tag" @model={{id}}>{{tagName id}}</LinkTo></li>
          {{/each}}
        </ul>
      {{/if}}
    </article>

    <nav class="post-nav" aria-label="More posts">
      {{#if @model.newer}}
        <LinkTo @route="post" @model={{@model.newer.id}}>← {{@model.newer.title}}</LinkTo>
      {{/if}}
      {{#if @model.older}}
        <LinkTo @route="post" @model={{@model.older.id}}>{{@model.older.title}} →</LinkTo>
      {{/if}}
    </nav>
  {{/let}}
</template>;

export default Template;
