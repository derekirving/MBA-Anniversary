const execSync = require('child_process').execSync;

module.exports = function () {
    let hash = '';
    let fullHash = '';
    let lastCommitDate = '';
    let repoUrl = '';

    try {
        // Get the short version of the hash
        hash = execSync('git rev-parse --short HEAD')
            .toString()
            .trim();

        fullHash = execSync('git rev-parse HEAD')
            .toString()
            .trim()

        repoUrl = execSync('git config --get remote.origin.url')
            .toString()
            .trim();

        lastCommitDate = execSync('git rev-parse HEAD')
            .toString()
            .trim()

        if (repoUrl.startsWith('git@')) {
            repoUrl = repoUrl
                .replace('git@', 'https://')
                .replace(':', '/')
        }
        repoUrl = repoUrl.replace('.git', '');
    } catch (error) {
        if (error.status !== 128) {
            console.warn('Unable to get git info:', error.status);
        }
        hash = 'unknown';
        fullHash = 'unknown';
        lastCommitDate = 'unknown';
        repoUrl = 'unknown';
    }

    return {
        hash: hash,
        fullHash: fullHash,
        lastCommitDate: lastCommitDate,
        repositoryUrl: repoUrl
    };
};