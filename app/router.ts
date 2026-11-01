import EmbroiderRouter from "@embroider/router";

import config from "#config";

export default class Router extends EmbroiderRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route("post", { path: "/:id" });
  this.route("page", { path: "/page/:id" });
  this.route("tag", { path: "/tag/:id" });
  this.route("author", { path: "/author/:id" });
  this.route("not-found", { path: "/*path" });
});
