var source = {
	"EXITED": {
		"name": "EXITED",
		"transitions": [
			{
				"inputs": {
					"enter": true
				},
				"transiteTo": "ENTER"
			},
			{
				"inputs": {
					"enter": false,
					"cushion": false,
					"exit": false
				},
				"transiteTo": "NO_SIGNAL_AFTER_EXITED"
			}
		],
		"callbacks": {
			entry: function() {
				console.log('Enter the state: ' + this.state.name);
			},
			exit: function() {
				console.log('Exit the state: ' + this.state.name);
			}
		}
	},
	"NO_SIGNAL_AFTER_EXITED": {
		"name": "NO_SIGNAL_AFTER_EXITED",
		"transitions": [
			{
				"inputs": {
					"enter": true
				},
				"transiteTo": "ENTER"
			},
			{
				"inputs": {
					"cushion": true
				},
				"transiteTo": "EXITED"
			},
			{
				"inputs": {
					"exit": true
				},
				"transiteTo": "EXITED"
			}
		],
		"callbacks": {
			entry: function() {
				console.log('Enter the state: ' + this.state.name);
			},
			exit: function() {
				console.log('Exit the state: ' + this.state.name);
			}
		}
	},
	"ENTER": {
		"name": "ENTER",
		"callbackEnabled": true,
		"callbacks": {
			custom: function() {
			},
			entry: function() {
				console.log('Enter the state: ' + this.state.name);
				console.log('sendTrigger: Enter');
				this.doTransitionTo('ENTERED');
			},
			exit: function() {
				console.log('Exit the state: ' + this.state.name);
			}
		}
	},
	"ENTERED": {
		"name": "ENTERED",
		"transitions": [
			{
				"inputs": {
					"enter": true
				},
				"transiteTo": "ENTERED"
			},
			{
				"inputs": {
					"cushion": true
				},
				"transiteTo": "ENTERED"
			},
			{
				"inputs": {
					"enter": false,
					"cushion": false,
					"exit": false
				},
				"transiteTo": "NO_SIGNAL_AFTER_ENTERED"
			},
			{
				"inputs": {
					"enter": false,
					"cushion": false,
					"exit": true
				},
				"transiteTo": "EXIT"
			}
		],
		"callbacks": {
			entry: function() {
				console.log('Enter the state: ' + this.state.name);
			},
			exit: function() {
				console.log('Exit the state: ' + this.state.name);
			}
		}
	},
	"NO_SIGNAL_AFTER_ENTERED": {
		"name": "NO_SIGNAL_AFTER_ENTERED",
		"transitions": [
			{
				"inputs": {
					"enter": false,
					"cushion": false,
					"exit": false
				},
				"transiteTo": "NO_SIGNAL_AFTER_ENTERED"
			},
			{
				"inputs": {
					"enter": true
				},
				"transiteTo": "ENTERED"
			},
			{
				"inputs": {
					"cushion": true
				},
				"transiteTo": "ENTERED"
			},
			{
				"inputs": {
					"enter": false,
					"cushion": false,
					"exit": true
				},
				"transiteTo": "EXITED"
			}
		],
		"callbackEnabled": true,
		"callbacks": {
			custom: function() {
			},
			entry: function() {
				console.log('Enter the state: ' + this.state.name);
				setTimeout( function() {
					console.log('sendTrigger: Exit');
					this.doTransitionTo('EXIT');						
				}, 10 * 1000 )
			},
			exit: function() {
				console.log('Exit the state: ' + this.state.name);
			}
		}
	},
	"EXIT": {
		"name": "EXIT",
		"callbackEnabled": true,
		"callbacks": {
			custom: function() {
			},
			entry: function(sdk) {
				console.log('Enter the state: ' + this.state.name);
				this.doTransitionTo('EXITED');
			},
			exit: function(sdk) {
				console.log('Exit the state: ' + this.state.name);
			}
		}
	}
};