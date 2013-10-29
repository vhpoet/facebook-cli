#!/usr/bin/env node

/**
 * Module dependencies.
 */
var program = require('commander'),
    prompt = require('prompt'),
    fs = require('node-fs'),
    fb = require('./facebook'),
    nconf = require('nconf'),
    httpget = require('http-get'),
    async = require('async'),
    progress = require('progress'),
    auth = require('./auth');

// Config file
var configFile = __dirname + '/config.json';

/**
 * Configuration file settings
 */
nconf.file({ file: configFile });

// TODO Get long live access_token
var init = function(callback,permissions){
  var appId = nconf.get('appId');
  var secret = nconf.get('secret');

  if (appId && secret) {
    auth({
      appId: appId,
      secret: secret,
      fb: fb.init(appId,secret),
      permissions: permissions
    },function(){
      callback();
    });
  } else {
    console.log("\nPlease run 'fb config' at first. \n");
    process.exit(1);
  }
};

/**
 * Prompt settings
 */
prompt.message = "";
prompt.delimiter = "";

/**
 * Program
 */
// TODO version number should come from package.json
program
  .version('0.0.1');

// Config
program
  .command('config')
  .description('Configure facebook app details')
  .action(function(){
    var schema = {
      properties: {
        appId: {
          description: "Facebook app ID",
          message: 'appId should be numbers.',
          required: true
        },
        secret: {
          description: "Facebook app secret",
          required: true
        }
      }
    };

    // TODO let them know if config object already exists
    console.log("\nPlease enter your facebook app details \n".grey);

    prompt.start();
    prompt.get(schema,function (err,result) {
      // TODO validate via remote call
      nconf.set('appId',result.appId);
      nconf.set('secret',result.secret);

      // Save the configuration object
      nconf.save();

      // Init facebook
      init();
    });
  });

// $ fb me
program
  .command('me')
  .description('Get info about current user')
  .action(function(){
    var action = function(){
      fb.me(function(data){
        console.log();
        console.log('You are '.grey + data.name.bold.cyan + '. Your ID is '.grey + data.id.bold.cyan);
        console.log(('Link to your profile: ' + ('https://facebook.com/' + data.username).underline).grey);
        console.log();
      });
    };

    init(action);
  });

// $ fb post "{message}"
program
  .command('post <msg>')
  .description('Post status update on your wall')
  .action(function(msg){
    var action = function(){
      // TODO msg without " quotes. Also check all other calls.
      fb.post(msg,function(data){
        console.log();
        console.log('Status update has been posted.'.green);
        console.log(('Here is the link: ' + ('https://facebook.com/' + data.id).underline).grey);
        console.log();
      });
    };

    init(action);
  });

// $ fb download {user}
program
  .command('download:albums <user> [path]')
  .description('Download user photo albums')
  .action(function(user, path){
    // If path has not been specified, current folder will be used.
    if (!path) path = '.';

    // Check if folder exists. If not, creates it.
//    if (!fs.existsSync(path)) {
//      fs.mkdirSync(path,0777,true);
//    }

    var permissions = ['user_photos','friends_photos'];
    var action = function(){
      fb.getAlbumsWithPhotos(user,function(albums){
        async.eachSeries(albums,function(album, albumCallback){
          // Progress bar properties
          var bar = new progress('[:bar :percent] Downloaded :current/:total',{
            total: album.photos.length,
            complete: '=',
            incomplete: ' ',
            width: 50,
            clear: true
          });

          // Create album folder
          fs.mkdirSync(path + '/' + album.name);

          // Download images
          async.eachLimit(album.photos, 15, function(photo,photoCallback){
              // Download and save photo
              // TODO real extension
              httpget.get(photo.source, path + '/' + album.name + '/' + photo.id + ".jpg", function(err) {
                // TODO better output
                if (err)
                  console.log(err);

                // TODO sometimes hangs here
                bar.tick();

                photoCallback();
              });
          }, function(){
            console.log(album.name.cyan + ' downloaded successfully.');

            albumCallback();
          })
        }, function(){
          if (path === '.') path = 'current directory.';

          console.log();
          console.log('Well Done!');
          console.log('All photos have been saved to ' + path);
          console.log();
        })
      });
    };

    init(action,permissions);
  });

program
  .parse(process.argv);

// TODO show help if wrong command name given

// Empty call
if (!program.args.length) program.help();
