/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
const path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { copySync } = require("fs-extra");
const CopyPlugin = require("copy-webpack-plugin");

process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production";

copySync(path.join(__dirname, "public"), path.join(__dirname, "build"));

const skipSourcemap = process.argv.includes("--skip-sourcemap");
const publicPath = "/";

module.exports = {
  mode: "production",

  entry: ["./src/RunApp.tsx"],
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].[contenthash].js",
    chunkFilename: "[name].[contenthash].js",
    publicPath,
  },

  resolve: {
    plugins: [new TsconfigPathsPlugin()],
    extensions: [".tsx", ".ts", ".wasm", ".mjs", ".js", ".json"],
  },

  module: {
    rules: [
      {
        test: /\.tsx?/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["babel-preset-ts-lib"],
            plugins: ["@babel/plugin-proposal-optional-catch-binding"],
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.module\.css$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"],
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin([
      {
        from: path.join(__dirname, "public"),
        to: path.join(__dirname, "build"),
      },
    ]),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public/index.html"),
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      reportFilename: path.resolve(__dirname, "reporter/bundle-report.html"),
      openAnalyzer: false,
    }),
    !skipSourcemap &&
      new webpack.SourceMapDevToolPlugin({
        filename: "[file].map",
        publicPath,
      }),
  ].filter(Boolean),

  devtool: undefined,

  optimization: {
    minimize: true,
    splitChunks: {
      chunks: "all",
      maxInitialRequests: Infinity,
      minSize: 0,
    },
  },
};
