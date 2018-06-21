let express = require('express');
let AV = require('leanengine');
let app = require('./server/server');

AV.init({
	appId: process.env.LEANCLOUD_APP_ID || 'Li17F49zPH29e3aFXBRdQVqD-gzGzoHsz',
	appKey: process.env.LEANCLOUD_APP_KEY || 'UBcTHX2AboUc4u5FHE0TnBbE',
	masterKey: process.env.LEANCLOUD_APP_MASTER_KEY || 'tqufLzj55Hf7azXpr9qSkRTl'
});

let port = 80;

app.listen(port, function () {
	console.log(`server is run on ${port}`);
});
