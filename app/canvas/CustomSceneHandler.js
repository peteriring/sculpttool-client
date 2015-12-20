(function () {

	var Self = root.ns('classes.SceneHandler').extend('CustomSceneHandler');
	var Socket;
	Self.addPublicProperties({
		init : function (socket, element) {
			var that = this;
			root.ns('classes.SceneHandler').init.call(this, socket);
			Socket = socket;

			socket

			.join({userId: that.userId})
			.then(function (data) {

				console.log('client initialized with id:', that.userId);
	            var sphere = root.ns('classes.sphereDisplayer').create(data);
				that.add(sphere);
				that.activeTool = root.ns('classes.ToolBrush').create({
					avgFaceArea: 10
					//sphere.avgFaceArea
				});
	        });

	        socket.on('notify', this.userId, function (data) {

    			that.cache[data.id].apply(data);
		    });

		    element.find('#wireframe').on('click', function () {

		    	that.showWireframe = !that.showWireframe;
		    	_.each(that.cache, function (elem) {
		    		if (elem.wireframe && !that.showWireframe) {
		    			root.ns('classes.Renderer').scene.remove(elem.wireframe);
		    			elem.wireframe = false;
		    		}
		    		else if (!elem.wireframe && that.showWireframe) {
		    			var color = new THREE.Color(0, 1, 0);
						elem.wireframe = new THREE.WireframeHelper( elem.mesh, color.getHex() );
						root.ns('classes.Renderer').scene.add(elem.wireframe);
		    		}
		    	})
		    });

		    element.find('#expand').on('click', function () {

		    	that.activeTool = root.ns('classes.ToolBrush').create({ avgFaceArea: 10 });
		    });

		    element.find('#compress').on('click', function () {

		    	that.activeTool = root.ns('classes.ToolFlatten').create({ avgFaceArea: 10 });
		    });

		    element.find('#paint').on('click', function () {

		    	that.activeTool = root.ns('classes.ToolPaint').create({ avgFaceArea: 10 });
		    });

			
			//FÉNYFORRÁSOK

			var light = new THREE.DirectionalLight( 0xffffff );
			light.position.set( 1, 1, 1 );
			this.add( light );

			light = new THREE.DirectionalLight( 0x002288 );
			light.position.set( -1, -1, -1 );
			this.add( light );

			light = new THREE.AmbientLight( 0x222222 );
			this.add( light );
			
			return this;
		},
		sendOperations: function () {

			var that = this;

			var operation = _.first(this.activeTool.getOperations());
			if (!operation) return false;
			
			Socket.emit('operate', {operation: operation.operation, userId: this.userId, point: operation.point, normal: operation.normal, color: operation.color, settings: operation.settings});

			return true;
		},
		getOperations: function () {

			var that = this;

			if (that.connectionClosed) return false;

			return true;
		}

	});


	root.ns('classes.CustomSceneHandler', Self);
	
}) ();