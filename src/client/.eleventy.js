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

    eleventyConfig.addShortcode("pageUrl", function (path) {
        const allPages = this.ctx.environments.collections?.all || [];

        const normalizedPath = path.replace(/^\.\//, '');

        const page = allPages.find(p => {
            const inputPath = p.inputPath.replace(/^\.\//, '');
            return inputPath.includes(normalizedPath) || inputPath.endsWith(normalizedPath);
        });

       if (!page) {
            console.warn(`Could not find page for path: ${path}`);
            return '#';
        }

        return basePath + page.url;
    });

    eleventyConfig.addCollection("blogs", function (collections) {
        return collections.getFilteredByGlob("site/blogs/*.md");
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

    eleventyConfig.addShortcode("youtube", content => {
        return `
        <div class="embed-responsive embed-responsive-16by9">
            <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/${content}?rel=0" allowfullscreen></iframe>
        </div>
        `;
    });

    eleventyConfig.addPairedShortcode("timeline", function (content, year, headline) {

        return `<li>
            <div class="timeline_content">
                <span>${year}</span>
                <h4>${headline}</h4>
                <p>${content}</p>
            </div>
        </li>`;
    });

    /*
    // Not using this in favour of collections but this is how to call it: 
    {% card %}
        {
        "title": "Considering an MBA? Go for it!",
        "text": "Daechuck Lee did his MBA full time at Strathclyde. Here, he explains what he loved about his time here - so much so, he is setting up a scholarship for Koreans who want to do the same.",
        "link": "https://www.sbs.strath.ac.uk/blogs/SBS/post.aspx?id=1437#post",
        "image": "./images/blogs/Banner_OFAGQPLAZNDDUZF.jpg",
        "alt": "Image depicting the idea of 'just do it!"
        }
    {% endcard %}
    */

    eleventyConfig.addPairedShortcode("card", function (content) {
        console.log(content);
        const obj = JSON.parse(content);
        return `<div class="col">
      <a class="card-link" href="${obj.link}">
        <div class="card">
          <img src="${obj.image}" class="card-img-top" alt="${obj.alt}">
          <div class="card-body">
            <h5 class="card-title">${obj.title}</h5>
            <p class="card-text">${obj.text}</p>
          </div>
        </div>
      </a>
    </div>`;
    });

    return {
        dir: {
            input: inputDirectory,
            output: outputDirectory
        },
        pathPrefix: basePath
    }
}