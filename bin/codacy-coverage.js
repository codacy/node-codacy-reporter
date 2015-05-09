#!/usr/bin/env node
(function (program, logger, util, lib) {
    'use strict';
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    var input = '',
        loggerImpl;

    process.stdin.on('data', function (chunk) {
        input += chunk;
        if (loggerImpl) {
            loggerImpl.trace('Got chunk');
        }
    });

    program
        .version(require('../package').version)
        .usage('[options]')
        .option('-f, --format [value]', 'Coverage input format')
        .option('-t, --token [value]', 'Codacy Project API Token')
        .option('-c, --commit [value]', 'Commit SHA hash')
        .option('-e, --endpoint [value]', 'Codacy API Endpoint')
        .option('-p, --prefix [value]', 'Project path prefix')
        .option('-v, --verbose', 'Display verbose output')
        .option('-d, --debug', 'Display debug output')
        .parse(process.argv);

    loggerImpl = logger({
        verbose: program.verbose,
        debug: program.debug
    });

    loggerImpl.info(util.format('Started with: token [%j], commitId [%j], endpoint [%j], format [%j], path prefix [%j], verbose [%j], debug [%j]',
        program.token, program.commit, program.endpoint, program.format, program.prefix, program.verbose, program.debug));

    process.stdin.on('end', function () {
        loggerImpl.trace('Received file through stdin');

        if (program.help === true) {
            return;
        }

        var opts = {
            endpoint: program.endpoint,
            token: program.token,
            commitId: program.commit,
            format: program.format,
            pathPrefix: program.prefix,
            verbose: program.verbose,
            debug: program.debug
        };

        return lib.handleInput(input, opts);
    });

}(require('commander'), require('../lib/logger'), require('util'), require('../index')));
