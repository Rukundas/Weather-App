const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    mode: "development",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    module: {
        rules: [
            {
               test: /\.js$/i,
               exclude: /node_modules/,
               use: 'babel-loader'
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/page.html'
        })],
    devServer: {
        static: './dist',
        port: 3000,
        open: true,
    },
    };