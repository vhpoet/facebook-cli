var sdk = require('facebook-node-sdk'),
    async = require('async'),
    http = require('http');

var api;

var facebook = {};

// Connect to facebook
facebook.init = function(appId,secret) {
  api = new sdk({
    appId: appId,
    secret: secret
  });

  return api;
};

// Show info about current user
facebook.me = function (callback) {
  api.api('/me', function(err, response) {
    if (err) {
      console.log(err);
      return;
    }

    if (response)
      callback(response);
  })
};

// Post a message to user's timeline
facebook.post = function(message,callback) {
  api.api('/me/feed', 'post', {'message':message}, function(err,response) {
    if (err) {
      console.log(err);
      return;
    }

    if (response)
      callback(response);
  });
};

// Get user albums with their photos
facebook.getAlbumsWithPhotos = function (user,callback) {
  var albs = [];

  api.api('/' + user + '/albums?limit=500', function(err,albums){
    if (err) {
      console.log(err);
      return;
    }

    async.eachLimit(albums.data,5,function(album, callback){
      // Our album object
      var alb = {
        'id': album.id,
        'name': album.name,
        'photos': []
      };

      // Get album photos
      api.api('/' + album.id + '/photos?limit=500', function(err,photos){
        photos.data.forEach(function(photo){
          // Add photo to our album object
          alb.photos.push({
            'id': photo.id,
            'name': photo.name,
            'source': photo.source
          });
        });

        albs.push(alb);

        callback();
      });
    }, function(){
      callback(albs);
    });
  })
};

module.exports = facebook;