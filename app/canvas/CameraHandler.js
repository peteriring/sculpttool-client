/**
 * A Renderer statikus osztályban lévő kamera mozgatásáért felelős osztály
 * Felhasználói beavatkozásra mozdítja a kamera pozícióját, szögét
 * Megvalósítja a 'controls' Traitet
 * Polárkoordinátákkal dolgozik
 */
(function () {

	var Self = root.ns('classes.Base').extend('CameraHandler');
	Self.addTrait(root.ns('traits.TraitMouseEvent'));
	Self.addTrait(root.ns('traits.TraitDraggable'));

	Self.addPublicProperties({
		
		init : function (target) {
			var that = this;
			var camera = root.ns('classes.Renderer').camera;
			camera.position.x = 150;

			var radius = camera.position.distanceTo(target.position);
			var tetha = Math.acos((camera.position.z - target.position.z) / radius);
			var phi	= Math.atan2((camera.position.y - target.position.y) , (camera.position.x - target.position.x));
			
			that.addPublicProperties({
				camera : camera,
				target : target,
				radius : radius,
				tetha : tetha,
				phi	: phi,
				offset : new THREE.Vector3 (target.position.x,target.position.y,target.position.z),
				scrollPositions : [100, 300, 500, 2000],
				currentScrollPosition : 2,
				silenced : false
			});
			
			this.registerForMouse();

			this.refreshCamera();

			return this;
		},

		onDrag : function ( event ) {

			if (this.pressed2) {

				var cameraPosition = this.camera.position;
				var radius = this.radius;
			
				var movementX = Math.max( -150, Math.min( 150, this.mouse.x - event.pageX ));
				var movementY = Math.max( -150, Math.min( 150, this.mouse.y - event.pageY ));

				this.tetha += 2 * Math.asin(movementY / radius);
				this.phi -= 2 * Math.asin(movementX / radius);
				
				this.tetha = Math.max( -(0 - 0.001), Math.min( (Math.PI - 0.001), this.tetha ));
				this.phi = root.fn.angulatePrimitive(this.phi);
				
				this.mouse.x = event.pageX;
				this.mouse.y = event.pageY;

				this.refreshCamera();
			}

		},

		wheel : function ( event ) {
			if (!this.silenced) {
				var that = this,
					oldCurrentScrollPosition = that.currentScrollPosition;
				if (event.originalEvent.wheelDelta > 0) {
					if (this.currentScrollPosition > 0) {
						this.currentScrollPosition -= 1;
					}
				}
				else {
					if (this.currentScrollPosition < this.scrollPositions.length -1) {
						this.currentScrollPosition += 1;
					}
				}
				var difference = this.radius - this.scrollPositions[this.currentScrollPosition];
				this.radius -= difference / 10;
				this.refreshCamera();
			}
		},

		refreshCamera : function () {

			var targetPosition = this.offset;
			var cameraPosition = this.camera.position;

			var radius = this.radius;
			var tetha = this.tetha;
			var phi = this.phi;
			
			cameraPosition.x = radius * Math.sin(tetha) * Math.cos(phi) + targetPosition.x;
			cameraPosition.z = radius * Math.sin(tetha) * Math.sin(phi) + targetPosition.z;
			cameraPosition.y = radius * Math.cos(tetha) + targetPosition.y;
			
			this.camera.position = cameraPosition;
			this.camera.lookAt(targetPosition);

			root.ns('classes.Renderer').render();
		},

		refreshRadius : function () {

			var that = this;
			var difference = this.radius - this.scrollPositions[this.currentScrollPosition];
			this.radius -= difference / 10;
			this.refreshCamera();

			if (Math.abs(difference) > 1) {
				setTimeout( function () {
				 that.refreshRadius(); 
				}, 150);
			}
		},

		update : function () {
			if (!this.silenced) {
				this.offset.x -= (this.offset.x - this.target.position.x)/10;
				this.offset.y -= (this.offset.y - this.target.position.y)/10;
				this.offset.z -= (this.offset.z - this.target.position.z)/10; 
			}
			this.refreshCamera();
		}
	});

	root.ns('classes.CameraHandler', Self);
}) ();