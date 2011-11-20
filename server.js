var http      = require('http'),
    mu        = require('mu2'),
    express   = require('express'),
    util      = require('util');

var app = express.createServer();

app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());

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

app.get('/projects.json', function (req, res) {

  requester(req, res, '/greentheplanet/_design/items/_view/allitems');

});

app.get('/projects/:id.:format?', function (req, res) {
  var id = req.params.id;

  requester(req, res, '/greentheplanet/' + id, 'project');

});

var requester = function(req, res, url, file) {

  var fileName = file || null;
  var options = {
    host:   'dylan.couchone.com',
    port:   5984,
    path:   url
  };

  http.get(options, function (response) {
    var buffer = '';
    response.on('data', function (chunk) {
      buffer += chunk;
    })
    .on('end', function () {
      if (fileName && (req.params.format === 'html' || req.params.format == undefined)) {
        // html page
        view = JSON.parse(buffer);
        if (view.ProjectVideo) {
          view.videoId = view.ProjectVideo.videoId;
        }
        template(res, 200, fileName, view);
      } else {
        // json 
        res.writeHead(200, {
          'Content-Type': 'application-json'
        });
        res.write(buffer);
        res.end();
      }

    });
  })
  .on('error', function (e) {
    //this is scary
    console.log('[ERROOOOAAAAAARRRRRR]');
  });
};

app.get('/new-project', function(req, res) {
  template(res, 200, 'newProject', {});  
});

app.post('/new-project-submit', function(req, res) {
  res.send(req.body); 

  var options = {
    host:   'dylan.couchone.com',
    port:   5984,
    path:   '/greentheplanet',
    method: 'POST',
    data:   req.body
  };

  var request = http.request(options, function(res) {
    console.log(res);
  });

});

app.listen(8000);

