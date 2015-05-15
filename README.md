# Contentful webhook server

[![Build Status](https://travis-ci.org/jvandemo/contentful-webhook-server.svg?branch=master)](https://travis-ci.org/jvandemo/contentful-webhook-server)

Webhooks in [Contentful](https://www.contentful.com) notify you when content in your space has changed.

Contentful webhook server is a lightweight server to handle these notifications:

- handles incoming [Contentful webhook HTTP requests](https://www.contentful.com/developers/documentation/content-delivery-api/#webhooks)
- emits events for all Contentful webhook topics to allow easy webhook handling
- supports username/password authentication
- supports all default [node HTTP server](https://nodejs.org/api/http.html) options

## Installation

```bash
$ npm install contentful-webhook-server
```

## Quick example

```javascript
// Create webhook server
var server = require('contentful-webhook-server')({
  path: '/',
  username: 'user',
  password: 'pass'
});

// Attach handlers to Contentful webhooks
server.on('ContentManagement.ContentType.publish', function(req){
  console.log('A content type was published!');
});

// Start listening for requests on port 3000
server.listen(3000, function(){
  console.log('Contentful webhook server running on port ' + 3000)
});

```

## Configuration

You can pass a configuration object when instantiating the server:

```javascript
// Create webhook server
var server = require('contentful-webhook-server')({
  path: '/',
  username: 'user',
  password: 'pass'
});
```

where:

- **path**: the path you want the server to listen on, default: '/'
- **username**: the username you expect the request to contain, default: ''
- **password**: the password you expect the request to contain, default: ''

So to start a server on `localhost:3000` without authentication, you can:

```javascript
// Create server with default options
var server = require('contentful-webhook-server')();

// Start listening for requests on port 3000
server.listen(3000, function(){
  console.log('Contentful webhook server running on port ' + 3000)
});
```

and to start a server on `localhost:3000/webhooks` with authentication, you can:

```javascript
// Create server with default options
var server = require('contentful-webhook-server')({
  path: '/webhooks',
  username: 'user',
  password: 'pass'
});

// Start listening for requests on port 3000
server.listen(3000, function(){
  console.log('Contentful webhook server running on port ' + 3000)
});
```

## Handling incoming webhook requests

The server emits incoming Contentful webhook topics as event, so you can:

```javascript
server.on('ContentManagement.ContentType.publish', function(req){
  console.log('A content type was published!');
});

server.on('ContentManagement.ContentType.unpublish', function(req){
  console.log('A content type was unpublished!');
});

server.on('ContentManagement.Entry.publish', function(req){
  console.log('An entry was published!');
});

server.on('ContentManagement.Entry.unpublish', function(req){
  console.log('An entry was unpublished!');
});

server.on('ContentManagement.Asset.publish', function(req){
  console.log('An asset was published!');
});

server.on('ContentManagement.Asset.unpublish', function(req){
  console.log('An asset was unpublished!');
});
```

> This module does not make any assumptions about your application and does **NOT** attempt to parse or extract the contents of the request.

> Instead it passes the [request](https://nodejs.org/api/http.html#http_http_incomingmessage) to your handler(s) so you can process (or ignore) the contents of the [incoming message](https://nodejs.org/api/http.html#http_http_incomingmessage) from within your handler(s).


## Special wildcard event

The server emits a special wildcard event too in case you want to listen to all events in one go:

```javascript

// Handler for all successful requests
// Is not emitted when an error occurs
server.on('ContentManagement.*', function(topic, req){

  // topic is available as string
  // => e.g. ContentManagement.Asset.unpublish
  console.log('Request came in for: ' + topic);
});
```

> This event is only emitted on successful requests, not on errors

## Handling errors and invalid requests

When an invalid request comes in, a `ContentManagement.error` event is emitted:

```javascript
// Handle errors
server.on('ContentManagement.error', function(err, req){
  console.log(err);
});
```

## Simulating a request using curl

If you want to try out your server during development, you can simulate a request without credentials using cUrl:

```bash
$ curl -X POST --header "X-Contentful-Topic: ContentManagement.Entry.publish" localhost:3000
```

and simulate requests with authentication like this:

```bash
$ curl -X POST -u user:pass --header "X-Contentful-Topic: ContentManagement.Entry.publish" localhost:3000
```

## Enabling webhooks in Contentful

To enable webhooks in your Contentful space, go to your space settings and fill in the options you specified in your server configuration:

![contentful-webhook](https://cloud.githubusercontent.com/assets/1859381/7337492/fc2b25e6-ec2b-11e4-99ef-ddaba53e77a6.png)

As soon as you save the webhook in Contentful, your server will start receiving notifications.

## Example

A working example is included [here](examples/webhook-server.js).

## License

MIT

## Change log

### 1.2.0

- Added ability to mount as middleware

### 1.1.0

- Added working example
- Updated documentation

### 1.0.0

- Added authentication support
- Updated documentation

### 0.2.0

- Added unit tests
- Updated documentation

### 0.1.0

- Initial version
