import Application from '@ember/application';

import loadInitializers from 'ember-load-initializers';
import { setup } from 'ember-prism';
import Resolver from 'ember-resolver';
import config from 'website/config/environment';

setup();

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);
