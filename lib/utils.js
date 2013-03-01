
var _ = require('underscore');

module.exports = {
    clean: clean
};

/**
 * Removed keys with undefined as value
 * @param options
 * @return {*}
 */
function clean (options) {
    options = _.clone(options);
    for (var i in options) {
        if (options[i] === undefined) {
            delete options[i];
        }
    }
    return options;
}