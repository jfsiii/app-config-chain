'use strict';

var argv = require('minimist')(process.argv.slice(2));
var merge = require('lodash.merge');
var path = require('path');
var env = argv.env || process.env.NODE_ENV;

function requireModule(pathToModule) {
  var module = require(pathToModule);
  return module.__esModule && module.default ? module.default : module;
}

var envConfigPath, defaultConfigPath, cfgDir, defaultConfig;
var envConfig = {};

// figure out where the config files are at
cfgDir = process.env.NODE_CONFIG_DIR;
if (!cfgDir) {
  cfgDir = path.resolve(process.cwd(), 'config/') + '/';
} else {
  cfgDir = path.resolve(cfgDir) + '/';
}

var defaultConfigPath = path.join(cfgDir, 'default');

if (env) {
  envConfigPath = path.join(cfgDir, env);
}

try {
  defaultConfig = requireModule(defaultConfigPath);
} catch (err) {
  defaultConfig = {}; // no default specified
}

try {
  if (envConfigPath) {
    envConfig = requireModule(envConfigPath);
  }
} catch (err) {
  throw new Error(err);
}

module.exports = merge(defaultConfig, envConfig);
