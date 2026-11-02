import { bootRehydrated } from "vite-ember-ssr/client";

import config from "#config";

import Application from "./app.ts";
import { preload } from "./content.ts";

await preload(window.location.pathname);

bootRehydrated(Application, config);
