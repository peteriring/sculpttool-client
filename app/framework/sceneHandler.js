(function () {
	var Self = root.ns('classes.Base').extend('SceneHandler');

	Self.addPublicProperties({

		init: function (socket) {
			var fps = new Stats();
		    var ms = new Stats();
		    var mb = new Stats();
		    fps.setMode( 0 ); // 0: fps, 1: ms, 2: mb
		    ms.setMode( 1 ); // 0: fps, 1: ms, 2: mb
		    mb.setMode( 2 ); // 0: fps, 1: ms, 2: mb

		    fps.domElement.style.position = 'absolute';
		    fps.domElement.style.left = '100px';
		    fps.domElement.style.top = '0px';

		    ms.domElement.style.position = 'absolute';
		    ms.domElement.style.left = '200px';
		    ms.domElement.style.top = '0px';

		    mb.domElement.style.position = 'absolute';
		    mb.domElement.style.left = '300px';
		    mb.domElement.style.top = '0px';

		    document.body.appendChild( fps.domElement );
		    document.body.appendChild( ms.domElement );
		    document.body.appendChild( mb.domElement );


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
				socket: socket,
				fps: fps,
				ms: ms,
				mb: mb
			});		
			
			this.keyboardHandler.initialize();
			this.startRenderLoop();
			
			return this;
		},

		startRenderLoop: function () {
			var that = this;
			that.renderLoop = window.setInterval(function(){
				that.fps.begin();
		        that.ms.begin();
		        that.mb.begin();
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
				that.fps.end();
		        that.ms.end();
		        that.mb.end();
			}, 1000 / 60);
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
