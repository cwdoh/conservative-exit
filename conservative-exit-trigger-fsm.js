(function(module) {
	// FSM:
	// {
	// 	type: '{{String}}',		// accept, start
	// 	name: '{{String}}',		// name of state
	// 	input: {{Function}},	// input function
	// 	entry: {{Function}},	// callback function, called when entering the state.
	// 	exit: {{Function}}		// callback function, called when exiting the state.
	// }

	var fsm = (function(states, start) {
		// State parts
		var _State = function(stateInfo) {
			this.state = stateInfo;

			return this;
		};

		// callback: entry
		_State.prototype.entryCallback = function() {
			if (typeof(this.state.callbacks.entry) == 'function') {
				var args = [].concat(Array.prototype.slice.apply(arguments));
				this.state.callbacks.entry.apply(this, args);
			}
		};
		
		// callback: exits
		_State.prototype.exitCallback = function() {
			if (typeof(this.state.callbacks.exit) == 'function') {
				var args = [].concat(Array.prototype.slice.apply(arguments));
				this.state.callbacks.exit.apply(this, args);
			}
		};

		_State.prototype.doTransitionTo = function(stateName) {
			var oldState = getState();
			if (oldState) {
				// try transtion
				if (setState(stateName)) {
					// firstly, call exit callback
					oldState.exitCallback.apply(oldState, []);

					// lastly, call entry callback
					getState().entryCallback.apply(getState(), []);

					return true;
				}
			}
			return false;
		};

		var fsmObject = {};

		for( state in states ) {
			fsmObject[state] = new _State(states[state]);
		}

		// set current state without any default action of each state.
		var currentState = null;
		var setState = function(stateName) {
			if (stateName in fsmObject) {
				currentState = fsmObject[stateName];

				return currentState;
			}

			return null;
		};

		setState(start);

		// get state instance of given name
		var getState = function(stateName) {
			if (!stateName) {
				return currentState;
			}

			if (stateName in fsmObject) {
				return fsmObject[stateName];
			}

			return null;
		};

		var processInput = function(inputs) {
			var state = getState().state;

			// converts every value to boolean in inputs
			for (var key in inputs) {
				inputs[key] = !!inputs[key];
			}

			var checkCondition = function(source, condition) {
				for (var key in condition) {
					if (key in source) {
						if (source[key] != condition[key]) {
							return false;
						}
					}
					else {
						return false;
					}
				}

				return true;
			};

			// doing auto transition
			if ("transitions" in state) {
				for(var idx = 0 ; idx < state.transitions.length ; idx ++) {
					var transition = state.transitions[idx];
					// if inputs satisfied to transition condition
					if (checkCondition(inputs, transition.inputs)) {
						// do transition
						getState().doTransitionTo(transition.transiteTo);
						return;
					}
				}
			}

			// doing custom transition if callbackEnabled is true
			if (state.callbackEnabled) {
				if (typeof(state.callbacks.custom) == 'function') {
					// transtion by user defined function
					state.callbacks.custom.apply(state, [inputs]);
				}
			}
		};

		return {
			setState: setState,
			getState: getState,
			processInput: processInput
		};
	})
	({
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
			"callbacks": (function() {
				var timer = null;
				return {
					custom: function() {
					},
					entry: function() {
						console.log('Enter the state: ' + this.state.name);

						var _self = this;
						timer = setTimeout( function() {
							_self.doTransitionTo('EXIT');						
						}, 10 * 1000 )
					},
					exit: function() {
						console.log('Exit the state: ' + this.state.name);
						if (timer) {
							clearTimeout(timer);
							timer = null;
						}
					}
				};
			})()
		},
		"EXIT": {
			"name": "EXIT",
			"callbackEnabled": true,
			"callbacks": {
				custom: function() {
				},
				entry: function(sdk) {
					console.log('Enter the state: ' + this.state.name);
					console.log('sendTrigger: Exit');
					this.doTransitionTo('EXITED');
				},
				exit: function(sdk) {
					console.log('Exit the state: ' + this.state.name);
				}
			}
		}
	}, 'EXITED');

	module.exports = fsm;
})(module);
