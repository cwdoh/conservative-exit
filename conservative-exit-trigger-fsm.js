(function(module) {
	// FSM:
	// {
	// 	type: '{{String}}',		// accept, start
	// 	name: '{{String}}',		// name of state
	// 	input: {{Function}},	// input function
	// 	entryCallback: {{Function}},	// callback function, called when entering the state.
	// 	exitCallback: {{Function}}		// callback function, called when exiting the state.
	// }

	var fsm = (function(states, start) {
		var _State = function(stateInfo) {
			this.state = stateInfo;

			return this;
		};

		// callback: entry
		_State.prototype.entryCallback = function() {
			if (typeof(this.state.entryCallback) == 'function') {
				this.state.entryCallback.apply(this.state, Array.prototype.slice.apply(arguments));
			}
		};
		
		// callback: exits
		_State.prototype.exitCallback = function() {
			if (typeof(this.state.exitCallback) == 'function') {
				this.state.exitCallback.apply(this.state, Array.prototype.slice.apply(arguments));
			}
		};

		var fsmObject = {};

		for( state in states ) {
			console.log(JSON.stringify(states[state], null, '\t'));
			fsmObject[state] = new _State(states[state]);
		}

		// set current state without any default action of each state.
		var currentState = null;
		fsmObject.setState = function(stateName) {
			if (stateName in fsmObject) {
				currentState = fsmObject[stateName];
			}
		};

		fsmObject.setState(start);

		// get state instance of given name
		fsmObject.getState = function(stateName) {
			if (!stateName) {
				return currentState;
			}

			if (stateName in fsmObject) {
				return fsmObject[stateName];
			}

			return null;
		};

		_State.prototype.doTransition = function() {
			if (currentState) {
				if (stateName in fsmObject) {
					// firstly, call exit callback
					currentState.exitCallback.apply(currentState, [sdk]);

					// transtion
					currentState = fsmObject[this.state.transiteTo];

					// lastly, call entry callback
					currentState.entryCallback.apply(currentState, [sdk]);

					return true;
				}
			}
			return false;
		};

		// SDK Parts
		var sendTrigger = function(event) {
			console.log('Trigger: ' + event);
		};

		var log = function(logText) {
			console.log(logText);
		};

		var sdk = {
			log: log,
			sendTrigger: sendTrigger
		};

		return fsmObject;
	})({
		"EXIT": {
			transitionCallback: function() {
			},
			entryCallback: function(sdk) {
				sdk.log('Enter the state: ' + this.name);
				sdk.doTranstionTo('EXITED');
			},
			exitCallback: function(sdk) {
				sdk.log('Exit the state: ' + this.name);
			}
		},
		"EXITED": {
			entryCallback: function(sdk) {
				sdk.log('Enter the state: ' + this.name);
			},
			exitCallback: function(sdk) {
				sdk.log('Exit the state: ' + this.name);
			}
		},
		"NO_SIGNAL_AFTER_EXITED": {
			entryCallback: function(sdk) {
				sdk.log('Enter the state: ' + this.name);
			},
			exitCallback: function(sdk) {
				sdk.log('Exit the state: ' + this.name);
			}
		},
		"ENTER": {
			transitionCallback: function() {
			},
			entryCallback: function(sdk) {
				sdk.log('Enter the state: ' + this.name);
				sdk.sendTrigger('Enter');
				sdk.doTranstionTo('ENTERED');
			},
			exitCallback: function(sdk) {
				sdk.log('Exit the state: ' + this.name);
			}
		},
		"ENTERED": {
			entryCallback: function(sdk) {
				sdk.log('Enter the state: ' + this.name);
			},
			exitCallback: function(sdk) {
				sdk.log('Exit the state: ' + this.name);
			}
		},
		"NO_SIGNAL_AFTER_ENTERED": {
			transitionCallback: function() {
			},
			entryCallback: function(sdk) {
				sdk.log('Enter the state: ' + this.name);
				setTimeout( function() {
					sdk.sendTrigger('Exit');
					sdk.doTranstionTo('EXIT');
				}, 10 * 1000 )
			},
			exitCallback: function(sdk) {
				sdk.log('Exit the state: ' + this.name);
			}
		},
	}, 'EXITED');

	module.exports = fsm;
})(module);
