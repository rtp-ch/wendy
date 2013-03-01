/*global require, module, Buffer*/
'use strict';

var read    = require('fs').readFileSync,
    mime    = require('mime'),
    _       = require('underscore'),
    utils   = require('./utils');

module.exports = inline;

var defaults = {
    mimeTypes: [
        '/image\/.*/'
    ],
    maxSize: 1024 * 32
};

/**
 * Inline referenced images with data url
 *
 * @param options
 * @return {Function}
 */
function inline (options) {
    options = _.extend({}, defaults, utils.clean(options));
    options.mimeTypes = mapMimeTypes(options.mimeTypes);

    return function (style) {
        style.rules.forEach(function (rule) {
            rule.declarations = processDeclarations(rule.declarations, options);
        });
    };
}


/**
 * Processes the css declarations to inline resource
 * Adds original declaration as fallback for legacy browsers
 *
 * @param inputDeclarations
 * @param options
 * @return {Array}
 */
function processDeclarations (inputDeclarations, options) {
    var outputDeclarations = [];

    inputDeclarations.forEach(function (declaration) {
        var url = parseUrl(declaration.value);
        outputDeclarations.push(declaration);
        try {
            if (url) {
                var file            = options.basePath + url,
                    contents        = read(file),
                    base64Contents  = new Buffer(contents).toString('base64'),
                    mimeType        = mime.lookup(file),
                    dataUrl         = 'data:' + mimeType + ';base64,' + base64Contents,

                    matches = function (test) {
                        if (typeof test === 'string') {
                            return test === mimeType;
                        }
                        return test.exec(mimeType);
                    };

                if (_.any(options.mimeTypes, matches) &&
                    base64Contents.length <= options.maxSize) {

                    outputDeclarations.push(_.extend(
                        {},
                        declaration,
                        {value: declaration.value.replace(url, dataUrl)}
                    ));
                }
            }
        } catch (e) { options.verbose && console.error(e); }
    });

    return outputDeclarations;
}


/**
 * Parses the url of in a CSS Attribute value
 * recognized patterns:
 * - url(xyz.png)
 * - url("xyz.png")
 * - url('xyz.png')
 * @param value
 * @return {*}
 */
function parseUrl(value) {
    return (value.match(/url\((["|']?)([^\1]+)\1\)/, '') || [])[2];
}


/**
 * Maps mimetypes starting with / and ending with / to regular expressions
 * @param mimeTypes
 * @return {*}
 */
function mapMimeTypes (mimeTypes) {
    return _.map(mimeTypes, function (mimeType) {
        var match = mimeType.match(/^\/(.*)\/$/);
        if (match) {
            return new RegExp(match[1]);
        }
        return mimeType;
    });
}