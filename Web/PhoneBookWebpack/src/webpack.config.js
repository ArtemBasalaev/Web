const path = require("path");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = {
    entry: "./javascripts/script.js",
    devtool: "source-map",
    target: ["web", "es5"],

    output: {
        filename: "script.js",
        path: path.resolve(__dirname, "..", "public"),
        publicPath: ""
    },

    resolve: {
        alias: {
            "vue$": "vue/dist/vue.esm.js"
        }
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
            },
            {
                test: /\.(png|jpg|gif|svg|ttf|eot|woff|woff2)$/,
                use: "file-loader?name=[path][name].[ext]?[contenthash]"
            },
            {
                test: /\.js$/,
                exclude: /node_modules\/(?!(bootstrap)\/).*/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"]
                    }
                }
            },
            {
                test: /\.vue$/,
                use: "vue-loader"
            }
        ]
    },

    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "style.css"
        }),
        new VueLoaderPlugin()
    ]
};