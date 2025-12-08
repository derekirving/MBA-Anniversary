const Dotenv = require('dotenv-webpack');
const entryPlus = require('@unify/web/webpack-entry-plus');
const global = require('@unify/web/global.js');
const { globSync } = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const ThemeDownloaderPlugin = require('@unify/web.staticsites/ThemeDownloaderPlugin');
const UnifyI18NPlugin = require("@unify/web/unifyi18n-webpack");

const assetsDirectory = global.data.AssetsDirectory;
const inputDirectory = global.data.InputDirectory;
const outputDirectory = path.resolve(__dirname, `../${global.data.OutputDirectory}`);

const regexString = `^\\.\\/${inputDirectory}\\/([^\\/]+)\\/main.js$`;
const regex = new RegExp(regexString);

const fixedFiles = globSync(`./${inputDirectory}/**/main.js`)
    .map(item => './' + item.replace(/\\/g, '/'));

const defaultCulture = global.i18n?.DefaultCulture || 'en';
const availableLanguages = global.i18n?.AvailableLanguages || [defaultCulture];

const entryFiles = [{
    entryFiles: fixedFiles,
    outputName(item) {
        const match = item.match(regex);
        return match ? `/${assetsDirectory}/${match[1]}//${match[1]}` : `/${assetsDirectory}/${inputDirectory}`;
    },
}];

// Pull in code as normal

// import Search from "../app/search";
// const search = new Search();

// Or Manually pull in something that is not referenced

// entryFiles.push({ entryFiles: ['./app/index.js'], outputName(item) {
//     return `./${assetsDirectory}/app`;
// }});

module.exports = (env, options) => {
    const isProduction = options.mode === 'production';

    return availableLanguages.map(locale => {
        return {
            entry: entryPlus(entryFiles),
            output: {
                path: outputDirectory,
                publicPath: isProduction ? global.data.PathPrefix.replace(/\/$/, '') + "/" : "/",
                filename: locale === defaultCulture ? "[name].js" : `[name].${locale}.js`,
                chunkFilename: locale === defaultCulture ? "[name].chunk.js" : `[name].${locale}.chunk.js`
            },
            performance: { maxAssetSize: 512000, maxEntrypointSize: 512000, hints: isProduction ? 'warning' : false },
            module: {
                rules: [
                    {
                        test: /\.scss$/,
                        use: [
                            MiniCssExtractPlugin.loader,
                            'css-loader',
                            {
                                loader: "sass-loader",
                                options: {
                                    sassOptions: {
                                        quietDeps: true,
                                        silenceDeprecations: ['legacy-js-api', 'color-functions', 'global-builtin', 'import'],
                                    },
                                },
                            }
                        ]
                    },
                    {
                        test: /\.(png|svg|jpg|jpeg|gif)$/i,
                        type: 'asset/resource',
                        generator: {
                            filename: assetsDirectory + '/[name][ext]'
                        }
                    },
                    {
                        test: /\.(woff|woff2|eot|ttf|otf)$/i,
                        type: 'asset/resource',
                        generator: {
                            filename: assetsDirectory + '/[name][ext]'
                        }
                    }
                ]
            },
            plugins: [
                new Dotenv({
                    path: './.env',
                    safe: false,
                    systemvars: true,
                }),
                new UnifyI18NPlugin(locale, defaultCulture, {
                    writeJson: true,
                    debug: options.mode !== 'production'
                }),
                new ThemeDownloaderPlugin({ overwrite: false }),
                new MiniCssExtractPlugin({
                    filename: '[name].css'
                })
            ]
        }
    })
}