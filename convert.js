var fs = require('fs');

fs.readFile('table.txt', function (err, read) {
	var rows= read.toString().split('\n');
	var fsm = [];

	var parse = function(v) {
		var constants = {
			'true': true,
			'false': false,
			'undefined': undefined
		};

		if (v in constants) {
			return constants[v];
		}

		try {
			return JSON.parse(v);
		}
		catch(e) {
			return v;
		}
	}

	for (idx = 0 ; idx < rows.length ; idx += 6) {
		var fsmObj = {
			state: rows[idx + 0],
			auto: parse(rows[idx + 1]),
			transiteTo: rows[idx + 5]
		};

		if (fsmObj.auto) {
			fsmObj.input = {
				enter: parse(rows[idx + 2]),
				cushion: parse(rows[idx + 3]),
				exit: parse(rows[idx + 4])
			};
		}

		fsm.push(fsmObj);
	}
	console.log(JSON.stringify(fsm, null, '\t'));
})

