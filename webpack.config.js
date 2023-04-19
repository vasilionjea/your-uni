import path from 'path';
import url from 'url';
import { merge } from 'webpack-merge';
import baseConfig from './scripts/base.js';
import devConfig from './scripts/dev.js';
import prodConfig from './scripts/prod.js';

// Project default settings
const defaults = {
  devServerPort: 3000,

  get __dirname() {
    return path.dirname(url.fileURLToPath(import.meta.url));
  },

  get distFolderPath() {
    return path.resolve(this.__dirname, 'public');
  },

  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
};

/**
 * The main webpack config. It merges the base config with an
 * environment specific one and returns it to webpack. Run it
 * from the CLI or NPM script via the `--env` arg:
 *
 * Development: `webpack --env dev`
 *  Production: `webpack --env prod`
 */
export default (mode) => {
  const settings = { isProdMode: mode.prod, ...defaults };
  const base = baseConfig(settings);

  if (mode.dev) {
    return merge(base, devConfig(settings));
  } else {
    return merge(base, prodConfig(settings));
  }
};
