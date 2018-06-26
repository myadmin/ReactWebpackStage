let express = require('express');
let AV = require('leanengine');
let app = require('./server/server');

AV.init({
	appId: process.env.LEANCLOUD_APP_ID || 'Li17F49zPH29e3aFXBRdQVqD-gzGzoHsz',
	appKey: process.env.LEANCLOUD_APP_KEY || 'UBcTHX2AboUc4u5FHE0TnBbE',
	masterKey: process.env.LEANCLOUD_APP_MASTER_KEY || 'tqufLzj55Hf7azXpr9qSkRTl'
});

let host = process.env.HOST || '0.0.0.0'
let port = process.env.PORT || parseInt(3000)
app.listen(port, host, function () {
	console.log(`server is run on${host} ${port}`);
});
