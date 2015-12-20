(function (){
	var Self = root.ns('classes.Base').extend('MouseEventHandler');

	Self.addPublicProperties({
		register : function (instance) {
			var that = this,
				events =['mousemove', 'wheel', 'mousedown', 'mouseup', 'mouseleave', 'click'];

			_.each(events, function (element) {
				if (typeof instance[element] === 'function') {
			    	$('body').on(element, '#canvas', function (event) {
			    		instance[event.type](event);
			    	});
            	}
			});

		},
		unregister : function (instance) {
			//TODO
		} 

	});

	root.ns('classes.MouseEventHandler', Self);
}) ();