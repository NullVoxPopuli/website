import Route from "@ember/routing/route";

import { loadPost } from "#app/content.ts";

export default class PostRoute extends Route {
  model({ id }: { id: string }) {
    return loadPost(id);
  }
}
