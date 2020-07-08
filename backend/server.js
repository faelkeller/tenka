const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const isUrl = require("is-valid-http-url");
const urlParse = require('url-parse');
const request = require('request');
const parseHtml = require('node-html-parser');
const isImageUrl = require('is-image-url');
const isBase64 = require('is-base64');
const jimp = require('jimp');
let promisesIsImage64 = [];

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
    
    urlDB.save(function (err, urlModel) {
        if (err) {
            console.log("Error! " + err.message);
            return false;
        }
        else {
            io.emit('updateImages', {id: urlDB._id, url: url, thumbs: []});
            getHtml(url, urlModel);
        }
    });
}

function getHtml(url, urlModel){
	request(url, { json: true }, (err, res, body) => {
		if (err) { return console.log(err); }
		getImages(body).then((images) => {
			console.log("images", images);
			urlModel.overwrite({ images: images, url: url, thumbs: []});
			urlModel.save();
			io.emit('updateImages', {id: urlModel._id, url: url, thumbs: images});	
		});
	});
}

async function getImages(html){	
	let root = parseHtml.parse(html);	
	let images = root.querySelectorAll('img');
	
	let promises = images.map(async (image) => {
		let strUrl = image.getAttribute('src');

		console.log("checkImg(strUrl)", await checkImg(strUrl));

		if (await checkImg(strUrl)){
			console.log("push images");
			return strUrl;
		} else {
			return false;
		}
	});
	
	let arrayImages = await Promise.all(promises).then(function(urls) {
		
	    return (urls != undefined) ? urls.filter(withoutFalse) : [];
	});	

	return arrayImages
}

function withoutFalse(value){
	return value != false;
}

async function checkImg(strUrl){
	if (isUrl(strUrl) && isImageUrl(strUrl)){
		return true;
	}

	if (isBase64(strUrl, {mimeRequired: true})){

		let boolReturn;
		
		await checkImageBase64(strUrl).then(
			(resultBoolReturn) => {
				boolReturn = resultBoolReturn;
			}, 
			(error) => {
				boolReturn = false;
			});

		return boolReturn;
	}

	return false;
}

async function checkImageBase64(strBase64){
	
	strBase64 = strBase64.split(',');

	let buf = Buffer.from(strBase64[0], 'base64');

	let boolReturn; 

	await jimp.read(buf).then(img => {
		if (img.bitmap != undefined && img.bitmap.width > 0 && img.bitmap.height > 0){
			boolReturn = true;
		} else {
			boolReturn = false;
		}
	}).catch(err => {
		boolReturn = false;
	});

	return boolReturn;
	
}