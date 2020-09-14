const fs = require('fs');
const path = require('path');
const marked = require('marked');
const axios = require('axios').default;
const http = require('http');

/**
 * Validate links
 * @param {string[]} links - Array of links to validate
 */
function validateLinks(links) {
    return new Promise((resolve)=>{
       const promiseArray=[];
        links.forEach((link)=>{
            promiseArray.push(new Promise(resolve => {
                axios.get(link.href).then(response =>{
                    link.status = response.status;
                    link.ok=true;
                    resolve();
                }).catch(error => {
                    let status=500; // unknown error
                    if(error.response) {
                        status= error.response.status;// the server says some error
                    }
                    if(error.request) {
                        status=503; // the server is not ready to handle the request
                    }
                    link.status=status;
                    link.ok=false;
                    resolve();
                });
            }));
        });

      //se resuelven todas las promesas al tiempo
        Promise.all(promiseArray).then(()=>{
            resolve(links);
        }) 
    });
}


/**
 * 
 * @param {string} path - Path to the MD file
 * @param {Object} options - Program options
 * @param {boolean?} options.validate - Validates each link to check if the link is broken or not
 * @param {boolean?} options.stats - Shows some basic statistics about the links in the file
 */
function mdLinks(filePath, options = {}) {
    const resolvedFilePath = path.resolve(filePath);

    return new Promise((resolve, reject) => {
        const links = [];

        /**
         * The walkTokens function gets called with every token that is inside the Markdown file
         * @param {marked.TokensList} token 
         * @see https://marked.js.org/using_pro#walk-tokens
         */
        function walkTokens(token) {
            if (token.type === 'link' && token.href.includes('http')) {
                links.push({
                    href: token.href,
                    text: token.text,
                    file: resolvedFilePath
                });
            }
        };

        fs.readFile(resolvedFilePath, { encoding: 'utf-8' }, (error, data) => {
            if (error) {
                reject(error)
                throw error;
            }

            marked(data, { walkTokens });

            if(options.validate) {
                validateLinks(links).then(() => {
                    resolve(links);
                });
            } else {
                resolve(links);
            }
        });
    });
}

module.exports = mdLinks;
