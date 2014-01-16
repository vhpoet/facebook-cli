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

module.exports = function(params,callback){

  var getAccessToken = function() {
    var redirect_uri = 'http://localhost:3000/';

    var server = http.createServer(function (req, res) {
      // haha
      var code = querystring.parse(req.url)['/?code'];

      if (code) {
        var url = "https://graph.facebook.com/oauth/access_token?"
            + "client_id=" + params.appId
            + "&client_secret=" + params.secret
            + "&redirect_uri=" + redirect_uri
            + "&code=" + code;

        request(url, function(err,response,body) {
          var token = querystring.parse(body).access_token;

          if(token) {
            params.fb.setAccessToken(token);
            nconf.set('token', token);

            // Save the configuration object
            nconf.save();

            callback(params.fb);

            // TODO close server doesn't work?
            server.close();
          } else {
            console.log('Something went wrong.');
          }
        })
      }
      else {
        console.log('Something went wrong.');
      }

      res.end('Now you are logged in. Go to the terminal!');
    }).listen(3000);

    var codeUrl = 'https://www.facebook.com/dialog/oauth?client_id=' + params.appId + '&redirect_uri=' + redirect_uri;

    // Get additional permissions
    if (params.permissions) {
      codeUrl += '&scope=' + params.permissions.join(",");
    }

    open(codeUrl);
  };

  // Get access token from memory
  var token = nconf.get('token');

  if (token) {
    // Set access token to facebook object
    params.fb.setAccessToken(token);

    // Try with our access token
    params.fb.api('/me/permissions',function(err, response){
      if (err) {
        getAccessToken();
        return;
      }
      else {
        if (params.permissions) {
          var permissions = response.data[0];

          // Check required permissions. if something is missing, get another access token.
          for(var i = 0; i < params.permissions.length; i++){
            if(!permissions[params.permissions[i]]) {
              getAccessToken();
              return;
            }
          }
        }
      }

      callback(params.fb);
    });
  }
  else {
    getAccessToken();
  }
};