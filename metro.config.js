// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);


// / Force Babel to transform Polkadot packages
config.transformer.minifierConfig = {
    mangle: {
        keep_fnames: true,
    },
    output: {
        ascii_only: true,
        quote_style: 3,
        wrap_iife: true,
    },
    sourceMap: {
        includeSources: false,
    },
    toplevel: false,
    compress: {
        reduce_funcs: false,
    },
};

// Enable transforming specific node_modules
// config.transformer.enableBabelRCLookup = true;
// config.transformer.enableBabelRuntime = true;

// Polyfills
config.resolver.extraNodeModules = {
    url: require.resolve('url'),
    //   fs: require.resolve('react-native-fs'),
};
module.exports = config;
