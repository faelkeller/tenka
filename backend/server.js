var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

http.listen(3000, function(){
	console.log('Servidor rodando em: http://localhost:3000');
});

io.on('connection', function(socket){
	socket.on('sendUrl', function(url){
		io.emit('updateImages', {url: url, thumbs: []});
	});
});