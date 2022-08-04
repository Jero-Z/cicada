const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const pkg = require('../../../package.json');

const INVALID_FILES = ['.DS_Store'];
const STATIC_DIR = path.join(__dirname, '../src/static');
const experiments = {
  topLevelAwait: true,
};

const envDefinePlugin = new webpack.DefinePlugin({
  __ENV__: JSON.stringify({
    VERSION: pkg.version,

    BUILD_TIME: new Date(),
    EMPTY_IMAGE_LIST: fs
      .readdirSync(`${STATIC_DIR}/empty_image`)
      .filter((f) => !INVALID_FILES.includes(f))
      .map((f) => `/empty_image/${f}`),
    ERROR_IMAGE_LIST: fs
      .readdirSync(`${STATIC_DIR}/error_image`)
      .filter((f) => !INVALID_FILES.includes(f))
      .map((f) => `/error_image/${f}`),
    COVER_LIST: fs
      .readdirSync(`${STATIC_DIR}/cover`)
      .filter((f) => !INVALID_FILES.includes(f))
      .map((f) => `/cover/${f}`),
  }),
});

const mainConfig = {
  mode: process.env.NODE_ENV,
  experiments,
  entry: path.join(__dirname, '../src/index.tsx'),
  output: {
    path: path.join(__dirname, '../build'),
    filename: '[name]_[contenthash].js',
    chunkFilename: 'chunk_[name]_[contenthash].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              rootMode: 'upward',
            },
          },
        ],
        exclude: [/node_modules/],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(jpe?g|png|svg|gif)$/,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
      '#': path.resolve(__dirname, '../../../shared'),
      '@mui/styled-engine': '@mui/styled-engine-sc',
    },
    symlinks: false,
  },
  plugins: [
    envDefinePlugin,
    new CopyPlugin({
      patterns: [
        {
          from: STATIC_DIR,
          to: path.join(__dirname, '../build'),
        },
      ],
    }),
    new HtmlPlugin({
      template: path.join(__dirname, '../src/index.html'),
    }),
  ],
};

const serviceWorkerConfig = {
  mode: process.env.NODE_ENV,
  experiments,
  target: 'webworker',
  entry: path.join(__dirname, '../src/service_worker.ts'),
  output: {
    path: path.join(__dirname, '../build'),
    filename: 'service_worker.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(j|t)s?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              rootMode: 'upward',
            },
          },
        ],
        exclude: [/node_modules/],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
      '#': path.resolve(__dirname, '../../../shared'),
    },
    symlinks: false,
  },
  plugins: [envDefinePlugin],
};

const devMainConfig = {
  ...mainConfig,
  cache: {
    type: 'filesystem',
  },
  devtool: 'eval-cheap-module-source-map',
  plugins: [...mainConfig.plugins, new ForkTsCheckerWebpackPlugin()],
  devServer: {
    port: 8001,
    hot: true,
  },
};

module.exports = {
  mainConfig,
  devMainConfig,
  serviceWorkerConfig,
};
