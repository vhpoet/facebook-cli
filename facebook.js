var sdk = require('facebook-node-sdk');
    config = require('./config');

// Connect to facebook
var api = new sdk({
  appID: config.appID,
  secret: config.secret
}).setAccessToken(config.accessToken);

var facebook = {};

facebook.cmd = {};

// $ facebook me
facebook.cmd.me = function () {
  console.log("hey that's me");

  api.api('/me', function(err, data) {
    if (err) {
      console.log(err);
      return;
    }

    console.log('You are ' + data.name + ", your Facebook ID is " + data.id);
  });
};

// $ facebook post "message"
facebook.cmd.post = function(args) {
  api.api('/me/feed', 'post', {'message':args[1]}, function(err,data) {
    if (data)
      console.log('data',data);
  });
};


module.exports = facebook;