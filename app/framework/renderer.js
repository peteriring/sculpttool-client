/**
 * A játék kirajzolásához szükséges, bárhonnan elérhető statikus osztály
 */
(function () {

	var Self = root.ns('classes.Base').extend('Renderer');

	Self.addPublicProperties({
		
		scene : new THREE.Scene(),
		camera : new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 10000 ),
		renderer : new THREE.WebGLRenderer(),
		clock : new THREE.Clock(),
			
		render : function () {
			this.renderer.render(this.scene, this.camera);
		}

	});

	Self.renderer.setSize( window.innerWidth - 6, window.innerHeight - 6);
	Self.scene.add(Self.camera);
	Self.camera.position.z = 300;
	
	root.ns('classes.Renderer', Self);
}) ();