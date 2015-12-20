(function () {
	var Self = root.ns('classes.Base').extend('SceneHandler');

	Self.addPublicProperties({

		init: function (socket) {

			this.addPublicProperties({
				camera: root.ns('classes.CameraHandler').create(new THREE.Object3D),
				keyboardHandler: root.ns('classes.KeyboardEventHandler'),
				time: root.ns('classes.Renderer').clock.getElapsedTime(),
				renderLoop: null,
				activeTool: null,
				FPS: 30,
				cache: {},
				showWireframe: false,
				userId: Math.random().toString(36).slice(2),
				socket: socket
			});		
			
			this.keyboardHandler.initialize();
			this.startRenderLoop();
			
			return this;
		},

		startRenderLoop: function () {
			var that = this;
			that.renderLoop = window.setInterval(function(){
				
				that.keyboardHandler.handleEvents ();
				if (that.activeTool) {

					that.camera.silenced = that.activeTool.isCameraSilenced;
					if (that.activeTool.SELECTED) {

						that.camera.target = that.activeTool.SELECTED;
					}
					that.sendOperations();
					that.getOperations();
			    	
					if (!that.silence){
						that.camera.update ();
						
						var delta = (root.ns('classes.Renderer').clock.getElapsedTime() - that.time);
						that.time = root.ns('classes.Renderer').clock.getElapsedTime();
						root.ns('classes.Renderer').render();
			    	}
				}

			}, 1000 / 30);
		},
		stopRenderLoop: function () {

			var that = this,
				timer = that.renderLoop;
		    if (timer) {
		        clearInterval(timer);
		        delete repeatState[key];
		    }
		},
		add: function (object) {

			var that = this;

			if (object instanceof THREE.Object3D) {

				root.ns('classes.Renderer').scene.add(object);
			}
			else if (object.classes && object.classes.indexOf('classes.sphereDisplayer')  >= 0){

				that.cache[object.mesh.uuid] = object;
				that.cache[object.id] = object;
				root.ns('classes.Renderer').scene.add(object.mesh);
			}
		},
		sendOperations: function () {
			return true;
		},
		getOperations: function () {
			return true;
		}
	});


	root.ns('classes.SceneHandler', Self);
	
}) ();
