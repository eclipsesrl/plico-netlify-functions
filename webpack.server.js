//webpack.config.js
require('dotenv').config();
const path = require('path');
const pkg = require('./package');
const GenerateJsonPlugin = require('generate-json-webpack-plugin');

const externals = ['firebase-admin'];

const genPackage = () => ({
  name: 'functions',
  private: true,
  main: 'hello.js',
  license: 'MIT',
  dependencies: externals.reduce(
    (acc, name) =>
      Object.assign({}, acc, {
        [name]: pkg.dependencies[name] || pkg.devDependencies[name]
      }),
    {}
  )
});

module.exports = {
  target: 'node',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    mainFields: ['module', 'main'],
    extensions: ['.tsx', '.ts', '.js']
  },
  externals: externals.reduce(
    (acc, name) => Object.assign({}, acc, { [name]: true }),
    {}
  ),
  plugins: [new GenerateJsonPlugin('package.json', genPackage())]
};
