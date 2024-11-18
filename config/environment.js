'use strict';

module.exports = function (environment) {
  let ENV = {
    modulePrefix: 'website',
    environment,
    rootURL: '/',
    locationType: 'auto',

    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      },
    },

    // ember-cli-showdown
    showdown: {
      flavor: 'github',
      tables: true,
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    blog: {
      title: 'NullVoxPopuli',
      description: 'a blog about technology',
      twitter: 'nullvoxpopuli',
      // description: `
      //   null: a keyword indicating that something has no value.\n
      //   vox populi: the voice of the people
      // `,
      // coverImage: '/images/blog-cover.jpg',

      navigation: [
        {
          label: 'Home',
          route: 'index',
        },
        {
          label: 'Projects',
          route: 'page',
          id: 'sites',
        },
        {
          label: 'Links & Socials',
          route: 'page',
          id: 'links',
        },
        {
          label: 'AI',
          route: 'page',
          id: 'ai',
        },
      ],
    },

    'responsive-image': {
      sourceDir: 'images',
      destinationDir: 'responsive-images',
      quality: 80,
      supportedWidths: [2000, 1000, 600, 300],
      removeSourceDir: false,
      justCopy: false,
      extensions: ['jpg', 'jpeg', 'png', 'gif'],
    },
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
    ENV.blog.host = 'https://nullvoxpopuli.com';
  }

  return ENV;
};
