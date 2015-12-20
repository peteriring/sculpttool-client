(function () {
	var Base = root.ns('classes.Base'),
		Self = Base.extend('Loader');
	
	Self.addPublicProperties({
		get : function (name) {
			var url = 'images/'+name+'.js';
			var url_mat = 'images/'+name+'.png';
			var obj = new THREE.Mesh(this._getInstance(url), this._getInstance(url_mat));
			if (!this._loadedUrls[url]) {
				this._load(url);
				this._registerPlaceHolder(obj, url);
				this._registerPlaceHolderMaterial(url_mat, url);
			}

			return obj;
		}
	});
	Self.addPrivateProperties({
		_loader : new THREE.JSONLoader(),
		_loadedUrls : {},
		_placeholders : {},
		_placeholderMaterials : {},
		_scene : root.ns('classes.Renderer').scene,
		
		_getInstance : function (url) {
			return this._loadedUrls[url];
		},
		_setInstance : function (url, obj) {
			this._loadedUrls[url] = obj;
		},
		_load : function (url) {
			var that = this;
			that._loader.load( url, function ( geometry ) {
				that._setInstance(url, geometry);
				var name = url.substring(7, url.length-3);
				console.log(name);
				var url_mat = 'images/'+name+'.png';
				that._loadmaterial(url, url_mat);
			});
		},
		_loadmaterial : function (url, url_mat) {
			var that = this,
				texture = THREE.ImageUtils.loadTexture( url_mat , undefined, function () {
					var material = new THREE.MeshLambertMaterial({map: texture, alphaTest: 0.5, side : THREE.DoubleSide});
					texture.wrapS = THREE.RepeatWrapping;
					texture.wrapT = THREE.RepeatWrapping;that._setInstance (url_mat, material );
					that._replace(url);
				});
		    	

			
		},
		_registerPlaceHolder : function (obj, url) {
			if (!this._placeholders[url]) {
				this._placeholders[url] = [];
			}
			this._placeholders[url].push(obj);
		},
		_registerPlaceHolderMaterial : function (url_mat, url) {
			if (!this._placeholderMaterials[url]) {
				this._placeholderMaterials[url] = [];
				this._placeholderMaterials[url].push(url_mat);
			}
		},
		_replace : function (url) {
			var that = this,
				geometry = this._getInstance (url);

			_.each (this._placeholders[url], function (obj) {
				var material = that._getInstance (that._placeholderMaterials[url]);
				if (geometry.animation && geometry.animations.length > 0) {
					var mesh;

					material = material.clone();
					material.skinning = true;
					
					mesh = new THREE.Mesh(geometry, material);
				}
				else {
					var mesh = new THREE.Mesh(geometry, material);
				}

				var name = url.substring(url.lastIndexOf('/')+1,(url.length-3));
				mesh.name = obj.name || name;
				mesh.position.set(obj.position.x,obj.position.y,obj.position.z);
				mesh.rotation.set(obj.rotation.x,obj.rotation.y,obj.rotation.z);
				mesh.scale.set(obj.scale.x,obj.scale.y,obj.scale.z);

				mesh.rotateable = true;
				mesh.scaleable = true;
				mesh.positionable = true;

				that._scene.remove(obj);
				that._scene.add(mesh);
				
			});

			delete that._placeholders[url];
			delete that._placeholderMaterials[url];
		}

	});


	root.ns('classes.Loader', Self);
}) ();