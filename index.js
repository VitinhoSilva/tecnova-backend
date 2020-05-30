var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('app/sslcert/privateKey.key', 'utf8');
var certificate = fs.readFileSync('app/sslcert/certificate.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};
var app = require('./app/routes/index');

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(3000, () => {
	console.log("Backend tecnova iniciado em: http://localhost:3000")
});
httpsServer.listen(3080, () => {
	console.log("Backend tecnova iniciado em: https://localhost:3080")
});

