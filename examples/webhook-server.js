var server = require('../index.js')({
  path: '/',
  username: 'user',
  password: 'pass'
});

server.on('ContentManagement.error', function(err, req){
  console.log(err);
});

server.on('ContentManagement.ContentType.publish', function(req){
  console.log('ContentManagement.ContentType.publish');
});

server.on('ContentManagement.*', function(topic, req){
  console.log('*: ' + topic);
});

server.listen(3000, function(){
  console.log('Contentful webhook server running on port ' + 3000)
});
