'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    fingerprint: {
      extensions: ['js', 'css', 'map'],
    },
    // https://github.com/kaliber5/ember-responsive-image#configuration
    'responsive-image': {
      deviceWidths: [320, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      images: [
        {
          include: 'assets/images/**/*',
          widths: [2048, 1536, 1080, 750, 640, 320, 120],
          formats: ['webp'],
          lqip: {
            type: 'inline',
            targetPixels: 60,
          },
          removeSource: true,
          justCopy: false,
        },
      ],
    },
    'ember-prism': {
      theme: 'tomorrow',
      components: [
        'markup',
        'diff',
        'javascript',
        'typescript',
        'json',
        'json5',
        'js-extras',
        'vim',
        'jsx',
        'tsx',
        'bash',
        'markup-templating',
        'markdown',
        'handlebars',
        'git',
        'css',
        'css-extras',
      ],
      plugins: [
        'line-numbers',
        'line-highlight',
        'copy-to-clipboard',
        'autolinker',
        'normalize-whitespace',
        'remove-initial-line-feed',
      ],
    },
  });

  const { Webpack } = require('@embroider/webpack');

  return require('@embroider/compat').compatBuild(app, Webpack, {
    // staticAddonTestSupportTrees: true,
    // staticAddonTrees: true,
    // staticHelpers: true,
    // staticComponents: true,
    // splitAtRoutes: ['route.name'], // can also be a RegExp
    // packagerOptions: {
    //    webpackConfig: { }
    // }
  });
};
