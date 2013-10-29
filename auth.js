var open = require('open'),
    sdk = require('facebook-node-sdk'),
    nconf = require('nconf'),
    http = require('http'),
    request = require('request'),
    querystring = require('querystring');

// Config file
var configFile = __dirname + '/config.json';

/**
 * Configuration file settings
 */
nconf.file({ file: configFile });

module.exports = function(appId,secret,facebook,callback){

  var getAccessToken = function() {
    var redirect_uri = 'http://localhost:3000/';

    var server = http.createServer(function (req, res) {
      // haha
      var code = querystring.parse(req.url)['/?code'];

      if (code) {
        request("https://graph.facebook.com/oauth/access_token?"
          + "client_id=" + appId
          + "&client_secret=" + secret
          + "&redirect_uri=" + redirect_uri
          + "&code=" + code,
          function(err,response,body) {
            var token = querystring.parse(body).access_token;

            if(token) {
              facebook.setAccessToken(token);
              nconf.set('token', token);

              // Save the configuration object
              nconf.save();

              callback(facebook);

              // TODO close server doesn't work?
              server.close();
            } else {
              console.log('Something went wrong.');
            }
          }
        )
      }
      else {
        console.log('Something went wrong.');
      }

      res.end('Now you are logged in. Go to the terminal!');
    }).listen(3000);

    open('https://www.facebook.com/dialog/oauth?client_id=' + appId + '&redirect_uri=' + redirect_uri);
  };

  // Get access token from memory
  var token = nconf.get('token');

  if (token) {
    // Set access token to facebook object
    facebook.setAccessToken(token);

    // Try with our access token
    facebook.api('/me',function(err, response){
      if (err)
        getAccessToken();
      else
        callback(facebook);
    });
  }
  else {
    getAccessToken();
  }
};