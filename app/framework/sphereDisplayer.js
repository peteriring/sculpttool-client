'use strict';
/* global root, THREE, _ */

(function () {
	var Base = root.ns('classes.Base'),
		Self = Base.extend('sphereDisplayer');
		
	Self.addPublicProperties({
		
		init : function (object) {
			this.addPublicProperties({

				id: object.id,
				geometry: new THREE.BufferGeometry(),
				mesh: null,
				wireframe: null
			});

			this.reInitialize(object);

			var material = new THREE.MeshPhongMaterial({ 

				color: 0x999999, specular: 0x333333,
				shininess: 50,
				side: THREE.DoubleSide,
				vertexColors: THREE.VertexColors,
				shading: THREE.SmoothShading 
			});
			this.mesh = new THREE.Mesh( this.geometry, material );

			//this.recalculateWireframe();
		},

		apply: function (changes) {

			if (changes.type === 'subdivide') {

				this.reInitialize(changes);
				changes = {};
			}

			delete changes.id;
			delete changes.timestamp;
			delete changes.type;

			for (var key in changes) {
				for (var index in changes[key]) {

					this.geometry.attributes[key].array[index] = changes[key][index];
				}
				this.geometry.attributes[key].needsUpdate = true;
			}
			this.geometry.computeBoundingSphere();
			this.geometry.computeVertexNormals();

			if (this.wireframe) {
				this.recalculateWireframe();
			}
		},

		recalculateWireframe: function () {
			var color = new THREE.Color(0, 1, 0);

			root.ns('classes.Renderer').scene.remove(this.wireframe);
			this.wireframe = new THREE.WireframeHelper( this.mesh, color.getHex() );
			root.ns('classes.Renderer').scene.add(this.wireframe);

		},

		reInitialize: function (object) {

			var position = new THREE.BufferAttribute( new Float32Array( _.toArray(object.position) ), 3 );
			var normal = new THREE.BufferAttribute( new Float32Array( _.toArray(object.normal) ), 3 );
			var color = new THREE.BufferAttribute( new Float32Array( _.toArray(object.color) ), 3 );
			var index = new THREE.BufferAttribute( new Uint16Array( _.toArray(object.index) ), 1 );

			this.geometry.addAttribute( 'index', index );
			this.geometry.addAttribute( 'position', position );
			this.geometry.addAttribute( 'normal', normal );
			this.geometry.addAttribute( 'color', color );

			this.geometry.computeBoundingSphere();
			this.geometry.computeVertexNormals();
		}
	});

	root.ns('classes.sphereDisplayer', Self);
}) ();