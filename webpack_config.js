const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: [
    path.resolve(__dirname, 'src')
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
    library: '',
    libraryTarget: 'commonjs2'
  },
  mode: 'none',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [
          'babel-loader',
          'eslint-loader'
        ]
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  externals: [nodeExternals()]
}
