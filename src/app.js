const fs = require('fs');
const path = require('path');
const marked = require('marked');
const axios = require('axios').default;

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
    const resolvedFilePath = path.resolve(filePath); //node.js path module convierte las rutas relativas en rutas absolutas para poder ser leidas

    return new Promise((resolve, reject) => {
        const links = [];

        /**
         * The walkTokens function gets called with every token that is inside the Markdown file
         * @param {marked.TokensList} token 
         * @see https://marked.js.org/using_pro#walk-tokens
         */
        function walkTokens(token) {// verifica el tipo de token, que en este caso es un link, y luego se incluyen links de tipo http para que los tome y tambien los de tipo https
            if (token.type === 'link' && token.href.includes('http')) {
                links.push({
                    href: token.href,
                    text: token.text, //objeto con los values que nos vamos a traer
                    file: resolvedFilePath
                });
            }
        };
           //leer archivos del file system 
        fs.readFile(resolvedFilePath, { encoding: 'utf-8' }, (error, data) => {
            if (error) {
                reject(error)
                throw error;
            } //callback asíncrono

            marked(data, { walkTokens }); // convertir el archivo .md a uno html para que sea mucho mas facil extraer los links


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
