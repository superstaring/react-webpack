/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
const path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";

module.exports = {
    mode: "development",

    entry: ["./src/App.tsx"],
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js",
        chunkFilename: "[name].bundle.js",
        publicPath: "/",
    },

    resolve: {
        plugins: [new TsconfigPathsPlugin()],
        extensions: [".tsx", ".ts", ".wasm", ".mjs", ".js", ".json"],
    },

    module: {
        rules: [{
                test: /\.tsx?/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["babel-preset-ts-lib"],
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

    devServer: {
        contentBase: [path.join(__dirname, "dist"), path.join(__dirname, "public")],
        compress: true,
        historyApiFallback: true,
        port: 8000,
        hot: true,
        open: true,
        // headers: {
        //   'Access-Control-Allow-Origin': '*',
        //   'Access-Control-Allow-Headers': 'Content-Type',
        //   'Access-Control-Allow-Methods': '*',
        //   'Content-Type': 'application/json;charset=utf-8',
        // },
        proxy: {
            "/api/": {
                target: "http://localhost:5000",
                changeOrigin: true,
            },

        },
    },

    plugins: [
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("development"),
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "public/index.html"),
        }),
    ],

    devtool: "sourcemap",

    optimization: {
        splitChunks: {
            chunks: "all",
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
                commons: {
                    test: /packages[\\/]/,
                },
            },
        },
    },
};