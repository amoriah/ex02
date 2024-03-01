// const webpack = require("webpack");
// const path = require("path");
import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
// const HtmlWebpackPlugin = require("html-webpack-plugin");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const __dirname = path.dirname(new URL(import.meta.url).pathname);

function buildPlugins(options) {
  const { paths } = options;

  const plugins = [
    new HtmlWebpackPlugin({
      template: paths.html,
    }),
    new webpack.ProgressPlugin(),
    new webpack.ProgressPlugin(),
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:8].css",
      chunkFilename: "css/[name].[contenthash:8].css",
    }),
  ];

  return plugins;
}

function buildWebpack(options) {
  const { paths } = options;

  return {
    mode: "development",
    entry: paths.entry,
    output: {
      path: paths.output,
      filename: "[name].[contenthash].js",
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        // {
        //   test: /\.js$/,
        //   exclude: /node_modules/,
        //   use: {
        //     loader: "babel-loader",
        //   },
        // },
      ],
    },
    resolve: {
      extensions: [".js"],
    },

    devtool: "inline-source-map",
    plugins: buildPlugins(options),

    devServer: {
      port: options.port ?? 3000,
      open: true,
    },
  };
}

export default () => {
  const config = buildWebpack({
    // port: env.port ?? 5000,
    port: 3000,
    mode: "development",
    paths: {
      output: path.resolve(__dirname, "build"),
      entry: path.resolve(__dirname, "src", "index.js"),
      html: path.resolve(__dirname, "src", "index.html"),
    },
  });
  return config;
};
