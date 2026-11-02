import { LinkTo } from "@ember/routing";

import { PostDate } from "./date.gts";

import type { TOC } from "@ember/component/template-only";
import type { Post } from "#app/content.ts";

export const PostList: TOC<{ Args: { posts: Post[] } }> = <template>
  <ol class="post-list">
    {{#each @posts key="id" as |post|}}
      <li>
        <PostDate @date={{post.date}} />
        <h2><LinkTo @route="post" @model={{post.id}}>{{post.title}}</LinkTo></h2>
        <p>{{post.excerpt}}…</p>
      </li>
    {{/each}}
  </ol>
</template>;
