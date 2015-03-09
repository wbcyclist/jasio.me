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
        isAdmin = options && options.hash && options.hash.ghost;

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
    output += context;

    if (!isAdmin && config.cdn_prefix && config.cdn_prefix.length > 0) {
        output = config.cdn_prefix + output;
    }

    if (!context.match(/^favicon\.ico$/)) {
        output = utils.assetTemplate({
            source: output,
            version: config.assetHash
        });
    }

    //console.log(output);
    //console.log(context);
    //console.log();

    return new hbs.handlebars.SafeString(output);
};

module.exports = asset;
