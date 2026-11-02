import { pageTitle } from "ember-page-title";

import { findPage, pageBody } from "#app/content.ts";
import { Head } from "#components/head.gts";
import { NotFound } from "#components/not-found.gts";
import { Prose } from "#components/prose.gts";

import type { TOC } from "@ember/component/template-only";

const path = (id: string) => `/page/${id}`;

const Template: TOC<{ Args: { model: { id: string } } }> = <template>
  {{#let (findPage @model.id) as |page|}}
    {{#if page}}
      {{pageTitle page.title}}

      <Head @title={{page.title}} @path={{path page.id}} />

      <article>
        <h1>{{page.title}}</h1>

        {{#let (pageBody page.id) as |body|}}
          {{#if body.resolved}}
            <Prose @html={{body.resolved}} />
          {{/if}}
        {{/let}}
      </article>
    {{else}}
      <NotFound />
    {{/if}}
  {{/let}}
</template>;

export default Template;
