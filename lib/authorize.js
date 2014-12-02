var url      = require('url');
var path     = require('path');
var fs       = require('fs');
var request  = require('request');
var optimist = require('optimist');
var prompt   = require('prompt');

var Auth = function() {}

Auth.prototype.token = null;

function prepareAuthorizeRequest(username, password) {
	return {
      method: 'POST',
      uri: url.format({
          hostname: 'api.github.com',
          pathname: '/authorizations',
          protocol: 'https',
          auth: username + ':' + password
      }),
      json: {
          scopes: [ 'gist' ],
          note: 'Created by http://github.com/dscape/ghcopy',
          note_url: 'http://github.com/dscape/ghcopy'
      },
      headers: {
          'User-Agent': 'github.com/dscape/ghcopy'
      }
  };
}


function prepareAuthListRequest(username, password) {
	return {
		method: 'GET',
		uri : url.format({
			hostname: 'api.github.com',
			pathname: '/authorizations',
			protocol: 'https',
			auth: username + ':' + password
		}),
	      headers: {
	          'User-Agent': 'github.com/dscape/ghcopy'
	      }
	}
}


Auth.prototype.checkAuth = function(username, password, callback) {
  	var get = prepareAuthListRequest(username, password);
  	var self = this;

  	request(get, function(error, res, body) {
  		if (error) {
  			console.error(error.message);
  			process.exit(1);
  		}

  		try {
  			var body = JSON.parse(body);  			
  		} catch(e) {
  			console.error(e.message);
  			process.exit(1);
  		}

  		body.forEach(function(el) {
  			if (el.note_url != null && el.note_url == 'http://github.com/dscape/ghcopy') {
				self.token = el.token; 				
  			}
  		});


  		if (self.token == null) {
  			self.authorize(username, password);
  		} else {
  			self.saveToFile(self.token);
  		}


  	});
}


Auth.prototype.authorize = function(username, password) {
	var self = this;

  var post = prepareAuthorizeRequest(username, password);

    request(post, function (error, res, body) {
        if (error) {
          console.error(error.message);
          process.exit();
        }

        //
        // Handle a one time password (OTP) fail
        //
        if ((401 === res.statusCode) && res.headers['x-github-otp']) {
            prompt.get([
                { name: 'one time password', required: true }
            ], function(error, additional) {
                if (error) {
                    console.error(error.message);
                    process.exit();
                }
                post.headers['X-GitHub-OTP'] = additional['one time password']
                makeRequest()
            })
            return
        }

        if (res.statusCode === 422) {
        	console.log('Already Authorized');
        	process.exit(0);
        }

        //
        // API code for success is 201
        //
        if (res.statusCode !== 201) {
          console.error('Auth failed, returned status code ' + res.statusCode);
          console.log(body);
          process.exit(1);
        }

        if ((typeof body.token !== 'string') || (body.token === '')) {
            console.error('Invalid token returned from github');
            console.log(JSON.stringify(body||{}));
            process.exit(1);
        }

        self.saveToFile(body.token);
    });
}

Auth.prototype.login = function(username, password) {
  var self = this;
  self.checkAuth(username, password);
}

Auth.prototype.saveToFile = function(token) {
	var tilde = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
	var dotf  = path.join(tilde, '.ghcopy');

    var dotfile = JSON.stringify({ t: token }, null, 2);



    //
    // Write our dot file
    //
    fs.writeFileSync(dotf, dotfile);

    //
    // chmod if in linux
    //
    if (process.platform !== 'win32') {
        //
        // r&w, only for user
        //
        fs.chmodSync(dotf, '600');
    }

    //
    // Show it to our user
    //
    console.log(dotfile);
}

Auth.prototype.process = function() {
	var self = this;
	var argv  = optimist.usage('usage: $0 -u [username]')
	    .alias('u', 'username')
	    .describe('u', 'define the github username')
	    .argv;

	prompt.override = argv;

	prompt.start();

	prompt.get([
  		{ name: 'username', required: true },
  		{ name: 'password', required: true, hidden: true }], 
  		function (error, p) {
  			if (error) {
  				console.error(error.message);
  				process.exit(1);
  			}
  			self.login(p.username, p.password);
  		}
  	);
}

module.exports = Auth;