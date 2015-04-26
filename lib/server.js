var http = require('http');

module.exports = createServer;

var httpServer;
var options = {
  path: '/'
};

var HEADERS = {
  TOPIC: 'x-contentful-topic'
};

var EVENTS = {
  ERROR: 'ContentManagement.error',
  ALL_SUCCESSFUL_REQUESTS: 'ContentManagement.*'
};

function createServer(opts) {
  if (opts && opts.path) {
    options.path = opts.path;
  }
  httpServer = http.createServer(handleRequest);
  return httpServer
}

function handleRequest(req, res){

  var path = req.url.split('?').shift();
  var topic = req.headers[HEADERS.TOPIC];
  var err;

  // Handle non matching path
  if(path !== options.path){
    err = new Error('path does not match');
    httpServer.emit(EVENTS.ERROR, err, req);
    return404();
    return;
  }

  // Handle incorrect methods
  if(req.method !== 'POST'){
    err = new Error('invalid request method')
    httpServer.emit(EVENTS.ERROR, err , req);
    return404();
    return;
  }

  // Handle missing topic
  if(!topic){
    return return400('X-Contentful-Topic not specified in request');
  }

  // Emit topic and wildcard event
  httpServer.emit(topic, req);
  httpServer.emit(EVENTS.ALL_SUCCESSFUL_REQUESTS, topic, req);

  // Return 200 OK
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end('{"ok":true}');

  function return400(message){
    res.writeHead(400, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ error: message }));
  }

  function return404(){
    res.statusCode = 404;
    res.end();
  }
}


