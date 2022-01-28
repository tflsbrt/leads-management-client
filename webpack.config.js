const path = require('path');
const deps = require('./package.json').dependencies;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = () => {
  const isDevelopment = process.env.NODE_ENV !== 'production';

  return {
    mode: isDevelopment ? 'development' : 'production',
    devtool: isDevelopment ? 'eval-source-map' : 'source-map',
    entry: path.resolve(__dirname, 'src', 'index.js'),
    output: {
      // path: path.resolve('./build'),
      // filename: '[name].[contenthash].js',
      publicPath: isDevelopment ? 'http://172.24.15.136:5003/' : '/',
      // chunkFilename: '[name].chunk.js',
      // globalObject: 'this',
      // chunkLoadingGlobal: `webpackJsonp_sspahtmlwithjs`,
    },
    resolve: {
      extensions: ['.jsx', '.js'],
    },
    devServer: {
      static: path.resolve(__dirname, 'public'),
      hot: true,
      host: '0.0.0.0',
      port: 5003,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      allowedHosts: 'auto',
    },
    plugins: [
      isDevelopment && new ReactRefreshWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public', 'index.html'),
      }),
      new ModuleFederationPlugin({
        name: 'client',
        library: { type: 'var', name: 'client' },
        filename: 'remoteEntry.js',
        exposes: {
          './App': './src/App',
        },
        shared: [
          {
            ...deps,
            react: {
              singleton: true,
              requiredVersion: deps.react,
            },
            'react-dom': {
              singleton: true,
              requiredVersion: deps['react-dom'],
            },
          },
        ],
      }),
    ].filter(Boolean),
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              plugins: [isDevelopment && require.resolve('react-refresh/babel')].filter(Boolean),
            },
          },
        },
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
      ],
    },
  };
};
