var http = require('http');
var investmentCalculator = require('./investmentCalculator');

http.createServer(function(req, res) {
	investmentCalculator.buildReport('AAPL', {from: '2012-01-01', to: '2012-12-31'}, function(err, data) {
		if (err) throw err;
		res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:8000/'})
		res.write(JSON.stringify(data));
		res.end();
	});
}).listen(process.env.PORT || 8000)