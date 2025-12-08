const fs = require('fs');
const global = require('@unify/web/global.js');
const path = require('path');
const slugify = require('slugify');

module.exports = {
    permalink: data => {

        if(data.permalink)
        {
            return data.permalink;
        }

        const { filePathStem, fileSlug, outputFileExtension } = data.page;
        const titleSlug = slugify(data.title || 'untitled-' + filePathStem, { lower: true });
        const isRootIndex = fileSlug === '' && filePathStem === '/index';

        const dirName = filePathStem.split('/').slice(0, -1).join('/');

        let pl;

        if (isRootIndex) {
            pl = `/index.${outputFileExtension}`;
        }else if (filePathStem === '') {
            pl = `/${titleSlug}/index.${outputFileExtension}`;
        }
        else if (filePathStem.endsWith('/index')) {
            pl = `${dirName}/index.${outputFileExtension}`;
        }else{
            pl = `${dirName}/${titleSlug}/index.${outputFileExtension}`;
        }

        return pl;
    },
    layout: data => {

        if(!data.i18n_layout)
        {
            return data.layout;
        }

        const includesPath = path.resolve(data.eleventy.directories.layouts || data.eleventy.directories.includes);
        const defaultCulture = global.i18n?.DefaultCulture || 'en';

        if (data.lang !== defaultCulture) {
            const replacedLayout = data.i18n_layout.replace('{lang}', data.lang);

            if (fs.existsSync(path.join(includesPath, replacedLayout))) {
                return replacedLayout;
            }
        }

        return data.layout;
    },
    global: () => {
        return global;
    },
};