( function () {
	var Base = root.ns('classes.Base'),
		Self = Base.implement('TraitMouseEvent');
	
	Self.addPublicProperties({

		registerForMouse : function () {
			
			var meh = root.ns('classes.MouseEventHandler');
			meh.register(this);
		},
		unregisterForMouse : function () {
			//TODO
		}
	});

	root.ns('traits.TraitMouseEvent', Self);

}) ();