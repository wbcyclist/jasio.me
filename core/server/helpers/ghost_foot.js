// # Ghost Foot Helper
// Usage: `{{ghost_foot}}`
//
// Outputs scripts and other assets at the bottom of a Ghost theme
//
// We use the name ghost_foot to match the helper for consistency:
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers

var hbs             = require('express-hbs'),
    _               = require('lodash'),
    config          = require('../config'),
    filters         = require('../filters'),
    api             = require('../api'),
    utils           = require('./utils'),
    ghost_foot;

ghost_foot = function (options) {
    var footOptions = (options || {}).hash || {},
        includeJquery;

    footOptions = _.pick(footOptions, ['jquery']);
    includeJquery = (_.has(footOptions, 'jquery') && footOptions.jquery === false ) ? false : true;

    /*jshint unused:false*/
    var jquery = utils.isProduction ? 'jquery.min.js' : 'jquery.js',
        foot = [];

    if(includeJquery) {
        var subdir = config.paths.subdir;
        if (config.cdn_prefix && config.cdn_prefix.length > 0) {
            subdir = config.cdn_prefix + subdir;
        }
        foot.push(utils.scriptTemplate({
            source: subdir + '/public/' + jquery,
            version: config.assetHash
        }));
    }
    

    return api.settings.read({key: 'ghost_foot'}).then(function (response) {
        foot.push(response.settings[0].value);
        return filters.doFilter('ghost_foot', foot);
    }).then(function (foot) {
        var footString = _.reduce(foot, function (memo, item) { return memo + ' ' + item; }, '');
        return new hbs.handlebars.SafeString(footString.trim());
    });
};

module.exports = ghost_foot;
