import { LinkTo } from "@ember/routing";

import { ResponsiveImage } from "@responsive-image/ember";
import { pageTitle } from "ember-page-title";

import { findAuthor, findPost, findTag, newerThan, olderThan, postBody } from "#app/content.ts";
import { PostDate } from "#components/date.gts";
import { Head } from "#components/head.gts";
import { NotFound } from "#components/not-found.gts";
import { Prose } from "#components/prose.gts";

import type { TOC } from "@ember/component/template-only";

const path = (id: string) => `/${id}`;
const authorName = (id: string) => findAuthor(id)?.name;
const tagName = (id: string) => findTag(id)?.name;

const Template: TOC<{ Args: { model: { id: string } } }> = <template>
  {{#let (findPost @model.id) as |post|}}
    {{#if post}}
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

        {{#let (postBody post.id) as |body|}}
          {{#if body.resolved.cover}}
            <figure class="post-image">
              <ResponsiveImage
                @src={{body.resolved.cover}}
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

          {{#if body.resolved.html}}
            <Prose @html={{body.resolved.html}} />
          {{/if}}
        {{/let}}

        {{#if post.tags}}
          <ul class="tag-list" aria-label="Tags">
            {{#each post.tags as |id|}}
              <li><LinkTo @route="tag" @model={{id}}>{{tagName id}}</LinkTo></li>
            {{/each}}
          </ul>
        {{/if}}
      </article>

      <nav class="post-nav" aria-label="More posts">
        {{#let (newerThan post) as |newer|}}
          {{#if newer}}
            <LinkTo @route="post" @model={{newer.id}}>← {{newer.title}}</LinkTo>
          {{/if}}
        {{/let}}
        {{#let (olderThan post) as |older|}}
          {{#if older}}
            <LinkTo @route="post" @model={{older.id}}>{{older.title}} →</LinkTo>
          {{/if}}
        {{/let}}
      </nav>
    {{else}}
      <NotFound />
    {{/if}}
  {{/let}}
</template>;

export default Template;
