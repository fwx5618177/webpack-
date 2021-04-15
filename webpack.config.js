// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const  OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const tsImportPluginFactory = require('ts-import-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const notifier = require('node-notifier');
const icon = path.join(__dirname, 'public/icon.jpg');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const SpeedMeasureWebpack5Plugin = require('speed-measure-webpack5-plugin');
const smw = new SpeedMeasureWebpack5Plugin();

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    context: process.cwd(),
    entry: {
      main: './src/index.js'
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, 'dist')
    },
    stats: {
        errorDetails: true
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env'],
                        cacheDirectory: true
                    },
                },
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src')
            },
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            transpileOnly: true,
                            getCustomTransformers: () => ({
                                before: [
                                    tsImportPluginFactory({
                                        libraryName: 'vant',
                                        libraryDirectory: 'es',
                                        style: (name) => `${name}/style/scss`,
                                    }),
                                ],
                            }),
                            compilerOptions: {
                                module: 'es2015',
                            },
                        }
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                use: [
                    'vue-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'cache-loader',
                    'style-loader'
                ],
            },
            {
                test: /\.scss/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.(jpg|png|jpeg|git|bmp)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1024,
                            fallback: {
                                loader: 'file-loader',
                                options: {
                                    name: '[name].[ext]'
                                }
                            }
                        }
                    },
                    {
                        loader: "image-webpack-loader",
                        options: {
                            mozjpeg:{
                                progressive: true,
                            },
                            optipng:{
                                enabled: false,
                            },
                            pngquant: {
                                quality: [0.65, 0.90],
                                speed: 4
                            },
                            gifsicle: {
                                interlaced: false
                            },
                            webp: {
                                quality: 75
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(mp4|ogg|mp3|wav)$/,
                use: {
                    loader: "url-loader",
                    options: {
                        limit: 1024,
                        fallback: {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]'
                            }
                        }
                    }
                }
            },
            {
                test: /\.html$/,
                use: 'html-loader'
            }
        ]
    },
    plugins: [
        new FriendlyErrorsWebpackPlugin({
            onErrors: (severity, errors) => {
                notifier.notify({
                    title: 'webpack 编译失败',
                    message: `${severity} ${errors[0].name}`,
                    subtitle: errors[0].file || '',
                    icon,
                });
            }
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            title: 'test',
            minify: {
                collapseWhitespace: true,
                removeComments: true
            }
        }),

        new CleanWebpackPlugin(),
        new OptimizeCssAssetsWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css'
        }),
        new VueLoaderPlugin(),
        new BundleAnalyzerPlugin({
            analyzerMode: 'disabled',
            generateStatsFile: true
        }),
    ],
    devServer: {
        port: 8080,
        host: 'localhost',
        compress: true, //服务器压缩是否开启
        hot: true, //热更新
        open: true, // 自动打开浏览器
        contentBase: '/dist'
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserWebpackPlugin()
        ]
    }
};
