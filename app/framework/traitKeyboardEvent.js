( function () {
	var Base = root.ns('classes.Base'),
		Self = Base.implement('TraitKeyboardEvent');
	
	Self.addPublicProperties({

		registerForKeyboard : function () {

			var meh = root.ns('classes.KeyboardEventHandler');
			meh.register(this);
		},
		unregisterForKeyboard : function () {
			
			var meh = root.ns('classes.KeyboardEventHandler');
			meh.unregister(this);
		}
	});

	root.ns('traits.TraitKeyboardEvent', Self);

}) ();