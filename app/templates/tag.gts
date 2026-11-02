import { pageTitle } from "ember-page-title";

import { findTag, postsTagged } from "#app/content.ts";
import { Head } from "#components/head.gts";
import { NotFound } from "#components/not-found.gts";
import { PostList } from "#components/post-list.gts";

import type { TOC } from "@ember/component/template-only";

const path = (id: string) => `/tag/${id}`;

const Template: TOC<{ Args: { model: { id: string } } }> = <template>
  {{#let (findTag @model.id) as |tag|}}
    {{#if tag}}
      {{pageTitle tag.name}}

      <Head @title={{tag.name}} @description={{tag.excerpt}} @path={{path tag.id}} />

      <h1>{{tag.name}}</h1>
      {{#if tag.excerpt}}
        <p>{{tag.excerpt}}</p>
      {{/if}}

      <PostList @posts={{postsTagged tag.id}} />
    {{else}}
      <NotFound />
    {{/if}}
  {{/let}}
</template>;

export default Template;
