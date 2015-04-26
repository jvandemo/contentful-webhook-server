# Contentful webhook server

[![Build Status](https://travis-ci.org/jvandemo/contentful-webhook-server.svg?branch=master)](https://travis-ci.org/jvandemo/contentful-webhook-server)

Webhooks in [Contentful](https://www.contentful.com) can notify you when content has changed. 

Contentful webhook server is a very lightweight server to handle such [Contentful webhook HTTP requests](https://www.contentful.com/developers/documentation/content-delivery-api/#webhooks):

- returns a [node HTTP server](https://nodejs.org/api/http.html) so all HTTP server options are supported
- emits events for all Contentful webhook topics
- does not have any third party dependencies!

## Installation

```bash
$ npm install contentful-webhook-server
```

## Quick example

```javascript
// Create server
var server = require('contentful-webhook-server')({
  path: '/'
});

// Handle errors
server.on('ContentManagement.error', function(err, req){
  console.log(err);
});

// Do something when entry is published on Contentful
server.on('ContentManagement.ContentType.publish', function(req){
  // ...
});

// Start listening for requests
server.listen(3000, function(){
  console.log('Contentful webhook server running on port ' + 3000)
});
```

## Events

The server emits the incoming Contentful webhook topic as event, so you can:

```javascript
server.on('ContentManagement.ContentType.publish', function(req){
  // ...
});

server.on('ContentManagement.ContentType.unpublish', function(req){
  // ...
});

server.on('ContentManagement.Entry.publish', function(req){
  // ...
});

server.on('ContentManagement.Entry.unpublish', function(req){
  // ...
});

server.on('ContentManagement.Asset.publish', function(req){
  // ...
});

server.on('ContentManagement.Asset.unpublish', function(req){
  // ...
});
```

## Special events

The server emits a special wildcard event that for all successful requests as well, so you can:

```javascript

// Handler for all successful requests
// Is not emitted when an error occurs
server.on('ContentManagement.*', function(topic, req){

  // topic is available as string
  // => e.g. ContentManagement.Asset.unpublish
  console.log('Request came in for: ' + topic);
});
```

## Handling invalid requests

When an invalid request comes in, an error is emitted:

```javascript
// Handle errors
server.on('ContentManagement.error', function(err, req){
  console.log(err);
});
```

## Simulating a request using curl

```bash
$ curl -X POST --header "X-Contentful-Topic: ContentManagement.Entry.publish" localhost:3000
```

## Example

A working example is included [here](examples/webhook-server.js).

## License

MIT

## Change log

### 0.2.0

- Added unit tests
- Updated documentation

### 0.1.0

- Initial version
