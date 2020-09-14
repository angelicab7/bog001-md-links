#!/usr/bin/env node
const mdLinks = require('./src');

const { argv } = require('yargs').check((argv, options) => {
    const filePaths = argv._
    if (filePaths.length !== 1) {
        throw new Error("You need to pass a path to the file to read")
    } else {
        return true // tell Yargs that the arguments passed the check
    }
}).options({
    'validate': {
        'describe': 'Validates each link to check if the link is broken or not',
        demandOption: false,
        default: false,
        type: "boolean"
    },
    'stats': {
        'describe': 'Shows some basic statistics about the links in the file',
        demandOption: false,
        default: false,
        type: "boolean"
    }
});

/*
// Grab the provided args
const [,, ...args] = process.argv;

// Show all the cli provided arguments
args.forEach((arg, index) => {
    console.log(`Argument ${index}: ${arg}`);
});
*/

mdLinks(argv._[0], { validate: argv.validate, stats: argv.stats }).then((links) => {
    const stats = {};
    if (argv.stats) {
        stats.total = links.length;
        const distinctLinks = [...new Set(links.map(link => link.href))];
        stats.unique = distinctLinks.length;
        if (argv.validate) {
            const brokenLinks = links.filter(link => !link.ok);
            stats.broken = brokenLinks.length;
        }
    }

    console.log(links, stats);
    /*
    links.forEach(link => {
        console.log(link.file, link.href, link.text);
    })
    */
});
