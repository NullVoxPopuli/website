import Route from "@ember/routing/route";

import { posts } from "#app/content.ts";

export default class IndexRoute extends Route {
  model() {
    return { posts };
  }
}
