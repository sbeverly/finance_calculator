var yahoo = require('yahoo-finance');
var exports = module.exports = {};
var _ = require('underscore');

exports.pullHistory = function(symbol, dates, callback) {
	yahoo.historical({
	  symbol: symbol,
	  from: dates.from,
	  to: dates.to,
	  // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
	}, callback)
}

exports.findInflections = function(history, callback) {
	var inflectionDays = [];
	var lastClosingPrice = history[0].close;
	var upwardTrend = history[1].close > lastClosingPrice;

	history.forEach(function(val, index, array) {
		if (upwardTrend && (val.close < lastClosingPrice)) {
			inflectionDays.push(val);
			upwardTrend = !upwardTrend;
		}

		if (!upwardTrend && (val.close > lastClosingPrice)) {
			inflectionDays.push(val);
			upwardTrend = !upwardTrend;
		}

		lastClosingPrice = val.close;
	})

	callback(null, inflectionDays)
}