const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const isUrl = require("is-valid-http-url");
const urlParse = require('url-parse');
const request = require('request');
const parseHtml = require('node-html-parser');
const isImageUrl = require('is-image-url');
const isBase64 = require('is-base64');
const jimp = require('jimp');

app.use(express.static('public'));

http.listen(3000, function(){
	console.log('Servidor rodando em: http://localhost:3000');
});

app.get('/urllist', function(req, res) {
	getUrlsDb().then( (docs) => {
		res.send(docs);
	});
});

io.on('connection', function(socket){
	socket.on('sendUrl', function(url){

		if (!isUrl(url)){
			return false;
		}

		let html = storeUrl(url);
		
	});

	socket.on('getUrls', function(url){		
		getUrlsDb().then( (docs) => {

			docs.map(function (doc){
				makeNew(doc._id, doc.url, socket.id);
				doc.thumbs.map( (thumb) => {
					sendThumb(doc._id, thumb, socket.id);
				});
			});
		});
	});
});

function makeNew(id, url, socketId){
	let io = getIo(socketId); 	
	io.emit('makeNew', {id: id, url: url, thumbs: []});
} 

function sendThumb(id, thumb, socketId){
	let io = getIo(socketId);
	io.emit('updateImages', {id: id, thumbs: ["http://localhost:3000/images/thumbs/" + thumb]});
}

function getIo(socketId){
	return (socketId === undefined) ? io : io.to(socketId);
}

function getUrlsDb(){
	let Urls = getUrlsSchema();

	let returnDocs;
	
	return Urls.find({}).lean().exec();
}

function getUrlsSchema(){
	let db = require("./db");
	let Urls = db.Mongoose.model('urlcollection', db.UrlSchema, 'urlcollection');
	return Urls;
}

function storeUrl(url){
    let Urls = getUrlsSchema();
    let urlDB = new Urls({ url: url });
    
    urlDB.save(function (err, urlModel) {
        if (err) {
            console.log("Error! " + err.message);
            return false;
        }
        else {
        	makeNew(urlDB._id, url);
            getHtml(url, urlModel);
        }
    });
}

function getHtml(url, urlModel){
	request(url, { json: true }, (err, res, body) => {
		if (err) { return console.log(err); }
		getImages(body).then((images) => {
			urlModel.overwrite({ images: images, url: url, thumbs: []});
			makeThumbs(url, urlModel, images);	
		});
	});
}

async function makeThumbs(url, urlModel, images){
	let count = 0;

	let promises = images.map(async (strImage) => {		
		count++;
		return await makeThumb(strImage, urlModel._id, count);			
	});
	
	let arrayThumbs = await Promise.all(promises).then(function(thumbs) {				
	    return (thumbs != undefined) ? thumbs.filter(withoutFalse) : [];
	});		

	urlModel.overwrite({ images: images, url: url, thumbs: arrayThumbs});
	urlModel.save();

	let id = urlModel._id;

	arrayThumbs.map((thumb) => {
		sendThumb(id, thumb);				
	});	
}

 async function makeThumb(strImage, id, count){	

 	let thumb = await jimp.read(checkType(strImage))
 	.then(async (image) => {
 		console.log("Processando imagem " + count);	
 		let ext = getExtension(strImage);
 		let path = "public/images/thumbs/" + id + "/" + count + "." + ext;
		image.resize(240, 240).quality(50).write(path);
        return path.replace("public/images/thumbs/", "");
 	})
 	.catch((err) => {
 		console.log("Error Make Thumb", err);
 		return false;
 	});

	return thumb;
}

function checkType(strImage){

	if (isBase64(strImage, {mimeRequired: true})){
		return strForImageBase64(strImage);
	}

	return strImage;
	
}

function strForImageBase64(strBase64){
	strBase64 = strBase64.split(',');
	let buf = Buffer.from(strBase64[1], 'base64');
	return buf;
}

function getExtension(strImage){
	return isUrl(strImage) ? getExtensionUrl(strImage) : getExtensionBase64(strImage);	
}

function getExtensionUrl(strImage){
	return strImage.split('.').pop();
} 

function getExtensionBase64(strImage){
	return strImage.split(';')[0].split('/')[1];
}

async function getImages(html){	
	let root = parseHtml.parse(html);	
	let images = root.querySelectorAll('img');
	
	let promises = images.map(async (image) => {
		let strUrl = image.getAttribute('src');

		if (await checkImg(strUrl)){
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

	let ext = getExtension(strUrl); 

	let allowedExt = ['png', 'jpg', 'jpeg'];

	if (!allowedExt.includes(ext)){
		return false;
	}

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

	let buf = strForImageBase64(strBase64);

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