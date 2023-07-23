const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

function generateHtmlPlugins(templateDir) {
    const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
    return templateFiles.map(item => {
        const parts = item.split('.');
        const name = parts[0];
        const extension = parts[1];
        return new HtmlWebpackPlugin({
            filename: `${name}.html`,
            template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
        })
    })
}

const htmlPlugins = generateHtmlPlugins('./src/html/views')

module.exports = {
    entry: {
        app: path.resolve(__dirname, './src/index.js')
    },
    output: {
        filename: "[name].[fullhash].build.js",
        path: path.resolve(__dirname, './dist'),
        assetModuleFilename: 'assets/[name][ext]',
        // clean: true
    },
    devServer: {
        watchFiles: path.join(__dirname, './src'),
        open: true,
        client: {
            overlay: true,
        },
        magicHtml: true,
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(?:js|mjs|cjs)$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', { targets: "defaults" }]
                        ]
                    }
                }
            },
            {
                test: /\.(sc|sa|c)ss$/i,
                exclude: /(node_modules|bower_components)/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                include: path.resolve(__dirname, './src/img'),
                type: 'asset/resource',
                generator: {
                    filename: 'assets/images/[hash][ext]'
                }
            },
            {
                test: /\.(svg|eot|ttf|woff|woff2)$/i,
                type: 'asset/resource',
                include: path.resolve(__dirname, './src/fonts'),
                generator: {
                    filename: 'assets/fonts/[hash][ext]'
                }
            },
            {
                test: /\.html$/i,
                include: path.resolve(__dirname, './src/html/includes'),
                use: [{ loader: 'html-loader' }],
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "./assets/css/[name].[hash].css",
        }),
    ].concat(htmlPlugins)
}
