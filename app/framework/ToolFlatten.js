(function () {

	var Self = root.ns('classes.Base').extend('ToolFlatten');
	Self.addTrait(root.ns('traits.TraitMouseEvent'));
	Self.addTrait(root.ns('traits.TraitDraggable'));
	Self.addTrait(root.ns('traits.TraitKeyboardEvent'));

	Self.addPublicProperties({
		
		init : function (settings) {
			var that = this;
			
			var camera = root.ns('classes.Renderer').camera;
			var scene = root.ns('classes.Renderer').scene;
			var raycaster = new THREE.Raycaster();

			Self.addPublicProperties({
				camera : camera,
				scene : scene,
				raycaster : raycaster,
				SELECTED : null,
				MARKED : null,
				basePoint : new THREE.Vector2 (0,0),
				groundPoint : null,
				isCameraSilenced : false,
				dirty : false,
				operationsCache: [],
				settings: settings
			});

			this.registerForMouse();
			this.registerForKeyboard();
			
			return this;
		},
		onDrag : function (event) {

			var that = this;
			var i = 0, j = 0;
			var x, y, z;
			var distance;
			var positions;
			var indices;
			var intersects;
			var normal, point;
			var selectedFaces;
			var mouse = new THREE.Vector2();
			var renderer = root.ns('classes.Renderer').renderer;

			if (!this.pressed0) {
				return;
			}

			mouse.x = ( event.clientX / renderer.domElement.width ) * 2 - 1;
			mouse.y = - ( event.clientY / renderer.domElement.height ) * 2 + 1;

			this.raycaster.setFromCamera( mouse, this.camera );

			intersects = this.raycaster.intersectObjects( this.scene.children );
			intersects = _.reject(intersects, function (item) {
				return !(item.object instanceof THREE.Mesh);
			});
			if ( intersects.length > 0 ) {

				var cache = {
					operation: 'flatten',
					mesh: intersects[ 0 ].object,
					point: { x: intersects[0].point.x, y: intersects[0].point.y, z: intersects[0].point.z },
					normal: { x: intersects[0].face.normal.x, y: intersects[0].face.normal.y, z: intersects[0].face.normal.z},
					settings: {}
				}
				this.operationsCache.push(cache);
			}

		},
		getOperations: function () {

			var cache = this.operationsCache;
			this.operationsCache = [];
			return cache;
		}
	});

	root.ns('classes.ToolFlatten', Self);
}) ();