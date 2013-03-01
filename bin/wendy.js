#!/usr/bin/env node
/*global require, process*/
'use strict';

var program = require('commander'),
    fs      = require('fs'),
    rework  = require('rework'),
    bytes   = require('bytes'),
    inline  = require('../lib/inline'),
    remify  = require('../lib/remify');

program
    .version(require('../package.json').version)
    .usage('[options] <file>')
    .option('-p, --basePath [path]',            'set the base path to inline images')
    .option('-t, --mimeTypes [mimetypes]',      'comma separated mimetypes, regexp allowed')
    .option('-m, --maxDataUrlSize [size]',      'maximum in bytes or 32kb, 2mb, 3gb')
    .option('-b, --baseFontSize [font-size]',   'set the base font size')
    .option('-v, --verbose',                    'adds verbose output to error log')
    .option('-o, --out [file]',                 'write the output to a file')
    .parse(process.argv);

var inputFile       = program.args[0];

if (!inputFile || !fs.existsSync(inputFile)) {
    console.log(program.help());
    process.exit(-1);
}

var inputFilePath   = inputFile.replace(/\/[^\/]+$/, ''),
    input           = fs.readFileSync(inputFile).toString();

// Options for inline plugin
var basePath        = (program.basePath || inputFilePath).replace(/\/*$/, '/'),
    mimeTypes       = program.mimeTypes ? program.mimeTypes.split(/ *, */) : undefined,
    inlineOptions   = {
        basePath:       basePath,
        mimeTypes:      mimeTypes,
        maxSize:        parseBytes(program.maxDataUrlSize),
        verbose:        program.verbose
    };

// Options for remify plugin
var remifyOptions = {
        baseFontSize: program.baseFontSize || undefined
    };

output(
    rework(input)
        .use(remify(remifyOptions))
        .use(inline(inlineOptions))
        .toString()
);

function output (contents) {
    if (program.out) {
        fs.writeFileSync(program.out, contents);
    } else {
        process.stdout.write(contents);
    }
}


function parseBytes (b) {
    if (!b) { return undefined; }
    if (b.match(/^\d+$/)) {
        return parseInt(b, 10);
    }
    return bytes(b.toLowerCase());
}