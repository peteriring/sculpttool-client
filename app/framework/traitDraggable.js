( function () {
	var Base = root.ns('classes.Base'),
		Self = Base.implement('TraitDraggable');
	
	Self.addPublicProperties({
		
		dragButtons: [],
		pressed0 : false,
		pressed1 : false,
		pressed2 : false,
		mouse : new THREE.Vector2(),

		mousemove : function ( event ) {
			
			if (typeof this.onDrag === 'function' && (this.pressed0 || this.pressed1 || this.pressed2)) {
				this.onDrag (event);
			}
			else if (typeof this.onOutDrag === 'function') {
				this.onOutDrag (event);
			}
		},
		mousedown : function (event) {
			var source = event.button;
			this['pressed' + source] = true;
			this.mouse.x = event.pageX;
			this.mouse.y = event.pageY;
			if (typeof this.beforeDrag === 'function') {
				this.beforeDrag (event);
			}
		},
		mouseup : function (event) {
			var source = event.button;
			this.mouse.x = event.pageX;
			this.mouse.y = event.pageY;
			if (typeof this.afterDrag === 'function') {
				this.afterDrag (event);
			}
			this['pressed' + source] = false;
		},
		mouseleave : function ( event ) {
			if (typeof this.afterDrag === 'function') {
				this.afterDrag (event);
			}
			this.pressed0 = false;
			this.pressed1 = false;
			this.pressed2 = false;
		},
	});

	root.ns('traits.TraitDraggable', Self);

}) ();