var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/tenka').then(() => {
	console.log("Connected to Database");
}).catch((err) => {
    console.log("Not Connected to Database ERROR! ", err);
});

var urlSchema = new mongoose.Schema({
    url: String,
    images: [{url: String}],
    thumbs: [{path: String}]
}, { collection: 'urlcollection' }
);

module.exports = { Mongoose: mongoose, UrlSchema: urlSchema }