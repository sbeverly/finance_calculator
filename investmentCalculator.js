var yahoo = require('yahoo-finance');
var exports = module.exports = {};

exports.pullHistory = function(symbol, dates, callback) {
	yahoo.historical({
	  symbol: symbol,
	  from: dates.from,
	  to: dates.to,
	  // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
	}, callback)
}