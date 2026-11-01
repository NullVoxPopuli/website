import { pageTitle } from "ember-page-title";

import { Head } from "#components/head.gts";
import { Prose } from "#components/prose.gts";

import type { TOC } from "@ember/component/template-only";
import type { loadPage } from "#app/content.ts";

const path = (id: string) => `/page/${id}`;

const Template: TOC<{ Args: { model: Awaited<ReturnType<typeof loadPage>> } }> = <template>
  {{pageTitle @model.page.title}}

  <Head @title={{@model.page.title}} @path={{path @model.page.id}} />

  <article>
    <h1>{{@model.page.title}}</h1>
    <Prose @html={{@model.html}} />
  </article>
</template>;

export default Template;
