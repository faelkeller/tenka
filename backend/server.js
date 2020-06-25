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

		let html = storeUrl(url);
		
	});
});

/* GET Userlist page. */
app.get('/urllist', function(req, res) {
   var db = require("./db");
   var Urls= db.Mongoose.model('urlcollection', db.UrlSchema, 'urlcollection');
   Urls.find({}).lean().exec(
      function (e, docs) {
         res.send(docs);
   });
});

function storeUrl(url){
	var db = require("./db"); 
    var Urls = db.Mongoose.model('urlcollection', db.UrlSchema, 'urlcollection');
    var urlDB = new Urls({ url: url });
    
    urlDB.save(function (err, urlObject) {
        if (err) {
            console.log("Error! " + err.message);
            return false;
        }
        else {
            io.emit('updateImages', {id: urlDB._id, url: url, thumbs: []});
            getHtml(url, urlObject);
        }
    });
}

function getHtml(url, urlObject){
	request(url, { json: true }, (err, res, body) => {
	  if (err) { return console.log(err); }
	  let images = getImages(body);
	  io.emit('updateImages', {id: urlObject._id, url: url, thumbs: images});
	});
}

function getImages(html){	
	let root = parseHtml.parse(html);	
	let images = root.querySelectorAll('img');
	let arrayImages = images.map((image) => {return image.getAttribute('src')});
	return arrayImages;
}