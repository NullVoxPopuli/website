import Route from "@ember/routing/route";

import { NotFound } from "#app/content.ts";

export default class NotFoundRoute extends Route {
  model({ path }: { path: string }) {
    throw new NotFound(`Nothing at ${path}`);
  }
}
