var table = [
	{
		"state": "EXITED",
		"auto": true,
		"transiteTo": "ENTER",
		"input": {
			"enter": true
		}
	},
	{
		"state": "EXITED",
		"auto": true,
		"transiteTo": "NO_SIGNAL_AFTER_EXITED",
		"input": {
			"enter": false,
			"cushion": false,
			"exit": false
		}
	},
	{
		"state": "NO_SIGNAL_AFTER_EXITED",
		"auto": true,
		"transiteTo": "ENTER",
		"input": {
			"enter": true
		}
	},
	{
		"state": "NO_SIGNAL_AFTER_EXITED",
		"auto": true,
		"transiteTo": "EXITED",
		"input": {
			"cushion": true
		}
	},
	{
		"state": "NO_SIGNAL_AFTER_EXITED",
		"auto": true,
		"transiteTo": "EXITED",
		"input": {
			"exit": true
		}
	},
	{
		"state": "ENTER",
		"auto": false,
		"transiteTo": "ENTERED"
	},
	{
		"state": "ENTERED",
		"auto": true,
		"transiteTo": "ENTERED",
		"input": {
			"enter": true
		}
	},
	{
		"state": "ENTERED",
		"auto": true,
		"transiteTo": "ENTERED",
		"input": {
			"cushion": true
		}
	},
	{
		"state": "ENTERED",
		"auto": true,
		"transiteTo": "NO_SIGNAL_AFTER_ENTERED",
		"input": {
			"enter": false,
			"cushion": false,
			"exit": false
		}
	},
	{
		"state": "ENTERED",
		"auto": true,
		"transiteTo": "EXIT",
		"input": {
			"enter": false,
			"cushion": false,
			"exit": true
		}
	},
	{
		"state": "NO_SIGNAL_AFTER_ENTERED",
		"auto": true,
		"transiteTo": "NO_SIGNAL_AFTER_ENTERED",
		"input": {
			"enter": false,
			"cushion": false,
			"exit": false
		}
	},
	{
		"state": "NO_SIGNAL_AFTER_ENTERED",
		"auto": true,
		"transiteTo": "ENTERED",
		"input": {
			"enter": true
		}
	},
	{
		"state": "NO_SIGNAL_AFTER_ENTERED",
		"auto": true,
		"transiteTo": "ENTERED",
		"input": {
			"cushion": true
		}
	},
	{
		"state": "NO_SIGNAL_AFTER_ENTERED",
		"auto": true,
		"transiteTo": "EXITED",
		"input": {
			"enter": false,
			"cushion": false,
			"exit": true
		}
	},
	{
		"state": "NO_SIGNAL_AFTER_ENTERED",
		"auto": false,
		"transiteTo": "EXIT"
	},
	{
		"state": "EXIT",
		"auto": false,
		"transiteTo": "EXITED"
	}
];

var result = {}
for (var idx = 0 ; idx < table.length ; idx ++) {
	var item = table[idx];

	if (!(item.state in result)) {
		result[item.state] = {
		};
	}

	if (item.auto == false) {
		result[item.state].callbackEnabled = !false;
	}
	else {
		if (!('transitions' in result[item.state])) {
			result[item.state].transitions = []
		}

		result[item.state].transitions.push({
			input: item.input,
			transiteTo: item.transiteTo
		});
	}
}

console.log(JSON.stringify(result, null, '\t'));

























