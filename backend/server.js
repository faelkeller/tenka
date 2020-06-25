var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const isUrl = require("is-valid-http-url");

http.listen(3000, function(){
	console.log('Servidor rodando em: http://localhost:3000');
});

io.on('connection', function(socket){
	socket.on('sendUrl', function(url){

		if (!isUrl(url)){
			return false;
		}

		io.emit('updateImages', {url: url, thumbs: []});
	});
});