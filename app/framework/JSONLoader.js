(function () {
	var Base = root.ns('classes.Base'),
		Self = Base.extend('JSONLoader');
	
	Self.addPublicProperties({
		get : function (url, url_mat, skinning) {
			var geometry = new THREE.SphereGeometry( 1, 16,16 ),
				material = new THREE.MeshBasicMaterial( { color:0xffffff} ),
				mesh = new THREE.Mesh(geometry, material);


			if (this._loadedUrls[url]) {
				geometry = _get(url);
			}
			if (this._loadedUrls[url_mat]) {
				material = new THREE.MeshLambertMaterial({map: _get(url_mat), alphaTest: 0.5});
			}
			if (skinning ) {
				mesh = new THREE.SkinnedMesh(geometry, material);
			}

			if (url && !this._loadedUrls[url]) {
				this._loadgeometry(url, mesh);
				mesh.loadfunctions = [];
			}
			if (url_mat && !this._loadedUrls[url_mat]) {
				this._loadmaterial(url_mat, mesh);
			}

			return mesh;
		},
		onload : function (mesh, loadfunction) {
			if (!mesh.loadfunctions) {
				loadfunction();
				return;
			}
			mesh.loadfunctions.push(loadfunction);
		}
	});
	Self.addPrivateProperties({
		_loader : new THREE.JSONLoader(),
		_loadedUrls : {},
		_placeholders : {},
		_placeholderMaterials : {},
		_scene : root.ns('classes.Renderer').scene,
		_pending : {},
		

		_get : function (url) {
			return this._loadedUrls[url];
		},
		_set : function (url, obj) {
			this._loadedUrls[url] = obj;
		},
		_loadmaterial : function (url, mesh) {

			mesh.material.map = root.ns('classes.TextureLoader').load(
				url,
				function () {
				mesh.material.needsUpdate = true;
			});
		},
		_loadgeometry : function (url, mesh) {
			var that = this;

			if (!this._pending[url]) {
				this._pending[url] = [];
				this._loader.load( url, function ( geometry ) {

					that._set(url, geometry);
					_.each (that._pending[url], function (pendingMesh) {
						pendingMesh.geometry = geometry.clone();
						pendingMesh.geometry.skinIndices = geometry.skinIndices;
						pendingMesh.geometry.skinWeights = geometry.skinWeights;
						pendingMesh.geometry.bones = geometry.bones;
						pendingMesh.geometry.animations = geometry.animations;

						if (pendingMesh.type === 'SkinnedMesh') {

							pendingMesh.material = pendingMesh.material;
							root.fn.updateSkeleton(pendingMesh);
							pendingMesh.material.skinning = true;
							pendingMesh.material.needsUpdate = true;

						}
						
						that._onload(pendingMesh);
					});
					geometry.needsUpdate = true;
						
					delete that._pending[url];
				});
			}
			this._pending[url].push(mesh);

			
		},
		_onload : function(mesh) {
			if (mesh.loadfunctions) {
				_.each(mesh.loadfunctions, function(loadfunction) {
					loadfunction();
				});
				delete mesh.loadfunctions;
			}
			
		}

	});


	root.ns('classes.JSONLoader', Self);
}) ();