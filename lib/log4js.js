const log4js = require('log4js');

log4js.configure({
	appenders: {
		console: { type: 'console' },
		sortByDate: {
			type: 'dateFile',
			filename: 'logs/app',
			pattern: '-yyyy-MM-dd.log',
			alwaysIncludePattern: true
		},
		// sortBySize: {
		// 	type: 'DateFile',
		// 	filename: 'logs/app.log',
		//   maxLogSize: 1024,
		//   backups:3,
		// 	alwaysIncludePattern: true
		// }
	},
	categories: {
		default: {
			appenders: ['console'],
			level: 'INFO'
		},
		router: {
			appenders: ['console','sortByDate'],
			level: 'INFO'
		},
		global: {
			appenders: ['console','sortByDate'],
			level: 'INFO'
		},
		sql: {
			appenders: ['console','sortByDate'],
			level: 'INFO'
		},
		redis: {
			appenders: ['console','sortByDate'],
			level: 'INFO'
		},
		api: {
			appenders: ['console','sortByDate'],
			level: 'INFO'
		},
	},
	replaceConsole: true
});

exports.logger = function (name) {

	return log4js.getLogger(name);

};
