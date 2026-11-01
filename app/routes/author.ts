import Route from "@ember/routing/route";

import { loadAuthor } from "#app/content.ts";

export default class AuthorRoute extends Route {
  model({ id }: { id: string }) {
    return loadAuthor(id);
  }
}
