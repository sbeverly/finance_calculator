var yahoo = require('yahoo-finance');
var exports = module.exports = {};
var _ = require('underscore');

exports.buildReport = function(symbol, dates, callback) {
	exports.pullHistory(symbol, dates, function(err, data) {
		if (err) throw err;
		exports.findInflections(data, function(err, data){
			if (err) throw err;
			exports.normalizeInflectionPoints(data, callback)
		})
	})
}

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

exports.normalizeInflectionPoints = function (inflectionDays, callback) {
	var threshold = 0.10
	var average = (_.reduce(inflectionDays, function(start, next) { return start + next.close }, inflectionDays[0].close)) / inflectionDays.length
	var normalized = []

	inflectionDays.forEach(function(val, index, array) {
		if (val.close - average >= average * threshold)
			normalized.push(val);
	});
	
	callback(null, normalized);
}