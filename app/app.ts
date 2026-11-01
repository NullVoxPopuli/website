import "./styles/app.css";

import Application from "@ember/application";

import PageTitleService from "ember-page-title/services/page-title";

export default class App extends Application {
  modules = {
    ...import.meta.glob("./router.*", { eager: true }),
    ...import.meta.glob("./routes/**/*", { eager: true }),
    ...import.meta.glob("./templates/**/*", { eager: true }),
    "./services/page-title": PageTitleService,
  };
}
