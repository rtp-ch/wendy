/*global require, module*/
'use strict';
var _       = require('underscore'),
    utils   = require('./utils');

module.exports = remify;


var defaults = {
    baseFontSize: 16
};

/**
 * Convert pixels to rem with fallback
 *
 * @param baseFontSize
 * @return {Function}
 */
function remify (options) {
    options = _.extend({}, defaults, utils.clean(options));
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
        outputDeclarations.push(declaration);
        var originalValue = declaration.value,
            remifiedValue = remifyValue(originalValue, options);

        if (remifiedValue !== originalValue) {

            outputDeclarations.push(_.extend(
                {},
                declaration,
                {value: remifiedValue}
            ));
        }
    });

    return outputDeclarations;
}


function remifyValue (value, options) {
    return value.replace(/\d+px/g, function (match) {
        var size = parseInt(match.replace(/px$/, ''), 10);
        return (size / options.baseFontSize) + 'rem';
    });
}


