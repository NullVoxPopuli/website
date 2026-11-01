import { ember } from "@nullvoxpopuli/ember-vite";
import { defineConfig } from "vite";
import { emberSsg } from "vite-ember-ssr/vite-plugin";

import { listRoutes } from "./lib/content.mjs";
import { blog } from "./lib/vite-plugin-blog.mjs";
import site from "./site.mjs";

const isTest = process.env.EMBER_ENV === "test";

export default defineConfig({
  plugins: [
    blog({ site }),
    ember(),
    !isTest && emberSsg({ routes: listRoutes(import.meta.dirname) }),
  ],
});
