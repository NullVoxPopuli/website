import site from "#site";

import type { TOC } from "@ember/component/template-only";

const description = (text?: string) => text || site.description;
const absolute = (path?: string) => (path ? `${site.host}${path}` : undefined);
const head = () => document.head;

const OpenGraph: TOC<{ Args: { property: string; content?: string } }> = <template>
  {{! @glint-expect-error The types for meta do not include RDFa attributes }}
  <meta property={{@property}} content={{@content}} />
</template>;

/**
 * Crawlers and link previews read these tags from the pre-rendered HTML.
 */
export const Head: TOC<{
  Args: { title?: string; description?: string; image?: string; path: string; type?: string };
}> = <template>
  {{#in-element (head) insertBefore=null}}
    <meta name="description" content={{description @description}} />
    <link rel="canonical" href="{{site.host}}{{@path}}" />
    <OpenGraph @property="og:site_name" @content={{site.title}} />
    <OpenGraph @property="og:title" @content={{if @title @title site.title}} />
    <OpenGraph @property="og:description" @content={{description @description}} />
    <OpenGraph @property="og:url" @content="{{site.host}}{{@path}}" />
    <OpenGraph @property="og:type" @content={{if @type @type "website"}} />
    <meta name="twitter:site" content="@{{site.twitter}}" />
    {{#if @image}}
      <OpenGraph @property="og:image" @content={{absolute @image}} />
      <meta name="twitter:card" content="summary_large_image" />
    {{else}}
      <meta name="twitter:card" content="summary" />
    {{/if}}
  {{/in-element}}
</template>;
