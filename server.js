var http      = require('http'),
    mu        = require('mu2'),
    express   = require('express'),
    util      = require('util');

var app = express.createServer();

app.use(express.static(__dirname + '/public'));

var template = function (res, statusCode, template, view) {

  mu.root = __dirname + '/templates/';

  res.writeHead(statusCode, {
    'content-type': 'text/html'
  });

  mu.compile(template + '.html', function (err, parsed) {
    if (err) {
      // exports.error(res, 404, 'error compiling template');
      return;
    };

    var readableStream = mu.render(template + '.html', view);

    util.pump(readableStream, res, function (err) {
      // winston.log('error', 'Template Error.', err);
    });
  });

};

app.get('/', function (req, res) {
  template(res, 200, 'layout', {});  
});

app.get('/flower-power', function (req, res) {
  template(res, 200, 'home', {});  
});

app.listen(80);

