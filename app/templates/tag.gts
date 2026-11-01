import { pageTitle } from "ember-page-title";

import { Head } from "#components/head.gts";
import { PostList } from "#components/post-list.gts";

import type { TOC } from "@ember/component/template-only";
import type { loadTag } from "#app/content.ts";

const path = (id: string) => `/tag/${id}`;

const Template: TOC<{ Args: { model: ReturnType<typeof loadTag> } }> = <template>
  {{pageTitle @model.tag.name}}

  <Head
    @title={{@model.tag.name}}
    @description={{@model.tag.excerpt}}
    @path={{path @model.tag.id}}
  />

  <h1>{{@model.tag.name}}</h1>
  {{#if @model.tag.excerpt}}
    <p>{{@model.tag.excerpt}}</p>
  {{/if}}

  <PostList @posts={{@model.posts}} />
</template>;

export default Template;
