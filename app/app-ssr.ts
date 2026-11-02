import App from "./app.ts";
import { preloadAll } from "./content.ts";

export { settled } from "@ember/test-helpers";

await preloadAll();

export function createSsrApp() {
  return App.create({ autoboot: false });
}
