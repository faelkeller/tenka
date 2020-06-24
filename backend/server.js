var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.post('/send-url', function(req, res){
  res.send({success: 1});
});


http.listen(3000, function(){
  console.log('Servidor rodando em: http://localhost:3000');
});