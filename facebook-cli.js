#!/usr/bin/env node
var cli = require('cli'),
    facebook = require('./facebook');

// TODO remove first argument (action)
try {
  facebook.cmd[cli.args[0]](cli.args);
} catch (e) {
  console.log('Wrong command. Call --help for the list of the commands.');
}