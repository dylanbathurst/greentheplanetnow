var http      = require('http'),
    mu        = require('mu2'),
    app       = require('express').createServer(),
    util      = require('util');

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

app.listen(8000);

