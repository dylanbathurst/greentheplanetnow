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

app.get('/items.json', function (req, res) {

  var buffer = '';
  res.writeHead(200, {
    'Content-Type': 'application-json'
  });

  var options = {
    host:   'dylan.couchone.com',
    port:   5984,
    path:   '/greentheplanet/_design/items/_view/allitems'
    // path:   '/greentheplanet/021004ab9e404a9a61d73c112f000b6d'
  };

  http.get(options, function (response) {
    response.on('data', function (chunk) {
      buffer += chunk;
    })
    .on('end', function () {
      res.write(buffer);
      res.end();
    });
  })
  .on('error', function (e) {
    console.log('[ERROOOOAAAAAARRRRRR]');
  });

});

app.listen(8000);

