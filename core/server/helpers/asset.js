// # Asset helper
// Usage: `{{asset "css/screen.css"}}`, `{{asset "css/screen.css" ghost="true"}}`
//
// Returns the path to the specified asset. The ghost flag outputs the asset path for the Ghost admin

var hbs             = require('express-hbs'),
    config          = require('../config'),
    utils           = require('./utils'),
    asset;

asset = function (context, options) {
    var output = '',
        isAdmin,
        minify;

    if (options && options.hash) {
        isAdmin = options.hash.ghost;
        minify = options.hash.minifyInProduction;
    }

    output += config.paths.subdir + '/';

    if (!context.match(/^favicon\.ico$/) && !context.match(/^shared/) && !context.match(/^asset/)) {
        if (isAdmin) {
            output += 'ghost/';
        } else {
            output += 'assets/';
        }
    }

    // Get rid of any leading slash on the context
    context = context.replace(/^\//, '');

    // replace ".foo" with ".min.foo" in production
    if (utils.isProduction && minify) {
        context = context.replace('.', '.min.');
    }

    // if has config.cdn_prefix, replace "/asset..." to "//jasioblog.qiniudn.com/cdn/asset..." (cdn_prefix="//jasioblog.qiniudn.com/")
    if (!isAdmin && config.cdn_prefix && config.cdn_prefix.length > 0) {
        output = config.cdn_prefix + output;
    }

    output += context;

    if (!context.match(/^favicon\.ico$/)) {
        output = utils.assetTemplate({
            source: output,
            version: config.assetHash
        });
    }

    return new hbs.handlebars.SafeString(output);
};

module.exports = asset;
