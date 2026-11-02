import { pageTitle } from "ember-page-title";

import { findAuthor, postsBy } from "#app/content.ts";
import { Head } from "#components/head.gts";
import { NotFound } from "#components/not-found.gts";
import { PostList } from "#components/post-list.gts";

import type { TOC } from "@ember/component/template-only";

const path = (id: string) => `/author/${id}`;
const twitter = (name: string) => `https://twitter.com/${name}`;

const Template: TOC<{ Args: { model: { id: string } } }> = <template>
  {{#let (findAuthor @model.id) as |author|}}
    {{#if author}}
      {{pageTitle author.name}}

      <Head @title={{author.name}} @image={{author.image}} @path={{path author.id}} />

      <header class="author">
        {{#if author.image}}
          <img src={{author.image}} alt="" width="96" height="96" />
        {{/if}}
        <div>
          <h1>{{author.name}}</h1>
          <p class="author-links">
            {{#if author.github}}<a href={{author.github}}>GitHub</a>{{/if}}
            {{#if author.gitlab}}<a href={{author.gitlab}}>GitLab</a>{{/if}}
            {{#if author.mastodon}}<a href={{author.mastodon}} rel="me">Mastodon</a>{{/if}}
            {{#if author.twitter}}<a href={{twitter author.twitter}}>Twitter</a>{{/if}}
          </p>
        </div>
      </header>

      <PostList @posts={{postsBy author.id}} />
    {{else}}
      <NotFound />
    {{/if}}
  {{/let}}
</template>;

export default Template;
