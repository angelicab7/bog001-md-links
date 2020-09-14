/**
 * 
 * @param {string} path - Path to the MD file
 * @param {Object} options - Program options
 * @param {boolean?} options.validate - Validates each link to check if the link is broken or not
 * @param {boolean?} options.stats - Shows some basic statistics about the links in the file
 */
function mdLinks(path, options = {}) {
    console.log(path, options, '---------------');
}

module.exports = mdLinks;
