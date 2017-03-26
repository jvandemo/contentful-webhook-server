// To test locally with curl, run:
// $ curl --data "test=data" localhost:3000/webhook --header "x-contentful-topic: ContentManagement.ContentType.publish"

var express = require('express');
var webhookServer = require('../lib/server')();

var port = process.env.PORT || 3000;

var app = express();

app.get('/', function (req, res) {
  res.send('Express response');
});

app.use('/webhook', webhookServer.mountAsMiddleware);

var server = app.listen(port, function () {
  console.log('Started on port ' + port);
});

webhookServer.on('ContentManagement.ContentType.publish', function (req) {
  console.log('A content type was published!');
});

webhookServer.on('ContentManagement.ContentType.unpublish', function (req) {
  console.log('A content type was unpublished!');
});

webhookServer.on('ContentManagement.Entry.publish', function (req) {
  console.log('An entry was published!');
});

webhookServer.on('ContentManagement.Entry.unpublish', function (req) {
  console.log('An entry was unpublished!');
});

webhookServer.on('ContentManagement.Asset.publish', function (req) {
  console.log('An asset was published!');
});

webhookServer.on('ContentManagement.Asset.unpublish', function (req) {
  console.log('An asset was unpublished!');
});
