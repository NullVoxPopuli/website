import Route from "@ember/routing/route";

import { loadTag } from "#app/content.ts";

export default class TagRoute extends Route {
  model({ id }: { id: string }) {
    return loadTag(id);
  }
}
