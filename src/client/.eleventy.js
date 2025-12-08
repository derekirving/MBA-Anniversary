const global = require('@unify/web/global.js');
const markdownIt = require('markdown-it');
const markdownItAttrs = require('markdown-it-attrs');
const unifyEleventy = require('@unify/web.staticsites/11ty');
const unifyEleventyI18n = require("@unify/web.staticsites/i18n.mjs")

const inputDirectory = `./${global.data.InputDirectory}`;
const outputDirectory = `../${global.data.OutputDirectory}`;
const basePath = process.env.UNIFY_ENV === 'production' ? global.data.PathPrefix.replace(/\/$/, '') : '';

const markdownItOptions = {
    html: true,
    breaks: true,
    linkify: true
}

const markdownLib = markdownIt(markdownItOptions).use(markdownItAttrs);

module.exports = function (eleventyConfig) {

    eleventyConfig.addPassthroughCopy(`${inputDirectory}/assets/**`);
    eleventyConfig.addPassthroughCopy(`${inputDirectory}/images/static/**`);

    eleventyConfig.addPlugin(unifyEleventy, {
        data: global.data,
        dirName: __dirname,
        markdownLib
    });

    eleventyConfig.addPlugin(unifyEleventyI18n, {
        i18n: global.i18n,
        data: global.data
    });

    // An example 11ty custom collection. Sort based on the "order" parameter in front matter
	eleventyConfig.addCollection("sortedByOrder", function (collection) {
        return collection.getFilteredByTag("page").sort((a, b) => {
            const orderA = a.data.order || 0;
            const orderB = b.data.order || 0;
            return orderA - orderB;
        });
    });

    // An example of an 11ty paired shortcode that creates two columns
    eleventyConfig.addPairedShortcode("2cols", function (content) {
        const columns = content.split('<col>').filter(col => col.trim() !== '');

        if (columns.length !== 2) {
            console.warn('The 2cols shortcode requires exactly two <col> elements.');
            return content;
        }

        const renderedColumns = columns.map(col => markdownLib.render(col.trim()));

        return `
          <div class="row">
            <div class="col-md-6">${renderedColumns[0]}</div>
            <div class="col-md-6">${renderedColumns[1]}</div>
          </div>
        `;
    });

    return {
        dir: {
            input: inputDirectory,
            output: outputDirectory
        },
        pathPrefix: basePath
    }
}