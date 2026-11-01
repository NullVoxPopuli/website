import Route from "@ember/routing/route";

import { loadPage } from "#app/content.ts";

export default class PageRoute extends Route {
  model({ id }: { id: string }) {
    return loadPage(id);
  }
}
