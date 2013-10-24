var sdk = require('facebook-node-sdk');

var api;

var facebook = {};

// Connect to facebook
facebook.init = function(appId,secret,token) {
  api = new sdk({
    appID: appId,
    secret: secret
  }).setAccessToken(token);
};

// $ facebook me
facebook.me = function (callback) {
  api.api('/me', function(err, data) {
    if (err) {
      console.log(err);
      return;
    }

    if (data)
      callback(data);
  });
};

// $ facebook post "message"
facebook.post = function(message,callback) {
  api.api('/me/feed', 'post', {'message':message}, function(err,data) {
    if (err) {
      console.log(err);
      return;
    }

    if (data)
      callback(data);
  });
};

module.exports = facebook;