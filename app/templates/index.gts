import { Head } from "#components/head.gts";
import { PostList } from "#components/post-list.gts";
import site from "#site";

import type { TOC } from "@ember/component/template-only";
import type { Post } from "#app/content.ts";

const Template: TOC<{ Args: { model: { posts: Post[] } } }> = <template>
  <Head @path="/" />

  <h1 class="site-description">{{site.description}}</h1>

  <PostList @posts={{@model.posts}} />
</template>;

export default Template;
