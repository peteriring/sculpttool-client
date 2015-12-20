(function (){
	var Self = root.ns('classes.Base').extend('KeyboardEventHandler');
	Self.addConstantProperties({
		registeredInstances : [],
		pressedKeys : [],
		keybindings : {
			'17+90|17+89' : 'undo'
		  //'default': 'refresh'
		}
	});
	Self.addPublicProperties({
		initialize : function () {
			var that = this;
			$(document.body).keydown( function (event) {
	    		var index = that.pressedKeys.indexOf('' + event.keyCode);
	    		if (index == -1) {
	    			that.pressedKeys.push('' + event.keyCode);
	    		}
	    	}).keyup( function (event) {
				var index = that.pressedKeys.indexOf('' + event.keyCode);
				if (index > -1) {
				    that.pressedKeys.splice(index, 1);
				}
	        });
		},
		register : function (instance) {

			this.registeredInstances.push(instance);

		},
		unregister : function (instance) {
			var index = this.registeredInstances.indexOf(instance);
			if (index > -1) {
				this.registeredInstances.splice(index, 1);
			}
		},
		handleEvents : function () {
			var that = this;
			_.each (that.keybindings, function (functionName, keyCombos) {
				var keys = keyCombos.split('|');
				_.each (keys, function (key, index) {
					keys[index] = key.split('+');
				});
				_.each (keys, function (key, index) {
					var isPressed = true;
					_.each (key, function (k) {
						if (that.pressedKeys.indexOf('' + k) === -1) {
							isPressed = false;
						}
					});
					if (isPressed) {
						_.each (that.registeredInstances, function (instance) {
							if (typeof instance[functionName] === 'function') {
								(instance[functionName])();
							}
						});
					}
				});
			});
		}

	});

	root.ns('classes.KeyboardEventHandler', Self);
}) ();