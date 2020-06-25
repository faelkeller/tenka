const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const isUrl = require("is-valid-http-url");
const urlParse = require('url-parse');
const request = require('request');
const parseHtml = require('node-html-parser');

http.listen(3000, function(){
	console.log('Servidor rodando em: http://localhost:3000');
});

io.on('connection', function(socket){
	socket.on('sendUrl', function(url){

		if (!isUrl(url)){
			return false;
		}

		let html = getHtml(url);
		
	});
});

function getHtml(url){
	request(url, { json: true }, (err, res, body) => {
	  if (err) { return console.log(err); }
	  let images = getImages(body);
	  io.emit('updateImages', {url: url, thumbs: images});
	});
}

function getImages(html){	
	let root = parseHtml.parse(html);	
	let images = root.querySelectorAll('img');
	let arrayImages = images.map((image) => {return image.getAttribute('src')});
	return arrayImages;
}