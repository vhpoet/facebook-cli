var sdk = require('facebook-node-sdk'),
    async = require('async');

var api;

var facebook = {};

// Connect to facebook
facebook.init = function(appId,secret,token) {
  api = new sdk({
    appID: appId,
    secret: secret
  }).setAccessToken(token);
};

// $ fb me
facebook.me = function (callback) {
  api.api('/me', function(err, response) {
    if (err) {
      console.log(err);
      return;
    }

    if (response)
      callback(response);
  });
};

// $ fb post "{message}"
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

// $ fb download {user}
facebook.downloadAlbums = function (user,callback) {
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