const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const webpack = require('webpack');

module.exports = {
    /* watch: true,
    watchOptions: {
        ignored: [/node_modules/] // Директории, которые watch будет игнорировать
    }, */
    mode: 'development',
    // Параметр "devtool" определяет уровень детализации отладочной информации // eval не генерирует карты исходного кода // eval-source-map - создает source maps для отладочных целей в режиме разработки
    devtool: 'eval-source-map',
    entry: {
        index: path.resolve(__dirname, './src/jsx', 'index.jsx'),
    }, // './src/jsx/index.jsx', // Указываем точку входа - главный модуль приложения

    output: {
        path: path.resolve(__dirname, './src/main/resources/static/'), // Директория, в которой будет размещаться итоговый бандл
        filename: './js/webpack-main.js' // './src/main/resources/static/js/webpack-main.js'
    },
    // Внешние зависимости
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'react-router': 'ReactRouter',
        'react-router-dom': 'ReactRouterDOM',
        // 'jsonwebtoken': 'jsonwebtoken',
        // 'jwt-decode': 'jwt-decode',
    },
    /* resolve: {
        fallback: {
            "buffer": require.resolve("buffer/"),
            crypto: require.resolve('crypto-browserify'),
            stream: require.resolve('stream-browserify')
        }
    }, */
    // определяем правила загрузки модулей (loaders)
    module: {
        rules: [
            {
                // Гегулярное выражение, которое определяет, какие файлы соответствуют правилу
                test: /\.(js|jsx)$/, // Применяем к любым файлам, которые заканчиваются расширением .js или .jsx
                // регулярное выражение, которое определяет, какие файлы исключить из правила
                exclude: /node_modules/, // не обрабатываем файлы из node_modules
                // Список загрузчиков, которые должны быть применены к соответствующим файлам
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true, // Использование кэша для избежания рекомпиляции при каждом запуске
                        presets: [
                            '@babel/preset-env', // для преобразования синтаксиса JavaScript
                            '@babel/preset-react' // для переноса синтаксиса JSX, в обычный JavaScript
                        ]
                    }
                }
            },
            {
                // Гегулярное выражение
                test: /\.css$/,
                // Список загрузчиков
                use: [
                    /* 'style-loader',  */
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]

            },
            {
                test: /\.svg$/,
                use: [{
                    loader: 'svg-url-loader', //  'file-loader'
                    // изменяем путь только для SVG файлов
                    options: {
                        outputPath: 'images/logo/',
                    },
                }],
            }
        ]
    },
    plugins: [
        // Этот плагин извлекает CSS в отдельные файлы.
        new MiniCssExtractPlugin({
            filename: './css/style.css',
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/jsx/public/images'),
                    to: path.resolve(__dirname, 'src/main/resources/static/images'),
                },
            ],
        }),
        /* new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.BROWSER': JSON.stringify(true),
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser'
        }), */
    ],

};