const path = require('path');
const { getDefaultConfig } = require('@expo/metro-config');
const { getConfig } = require('react-native-builder-bob/metro-config');
const { withNativeWind } = require('nativewind/metro');

const pkg = require('../package.json');

const root = path.resolve(__dirname, '..');

// nativewind config
const config = getDefaultConfig(__dirname);
const nativewindConfig = withNativeWind(config, { input: './global.css' });
/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
module.exports = getConfig(nativewindConfig, {
  root,
  pkg,
  project: __dirname,
});
