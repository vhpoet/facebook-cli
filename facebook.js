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
facebook.me = function () {
  api.api('/me', function(err, data) {
    if (err) {
      console.log(err);
      return;
    }

    console.log('You are ' + data.name + ", your Facebook ID is " + data.id);
  });
};

// $ facebook post "message"
facebook.post = function(message) {
  api.api('/me/feed', 'post', {'message':message}, function(err,data) {
    if (data)
      console.log('data',data);
  });
};

module.exports = facebook;