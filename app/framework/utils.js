(function () {

	/**
	 * Euler "vektorok" szöggé (radiánná) tétele
	 */
	root.functions('angulatePrimitive', function (euler) {

		var PI2 = 2*Math.PI;

		euler = ( (euler < 0) ?  PI2 + euler : euler  );
		euler %= PI2;

		return euler;

	}).functions('angulateEuler', function (euler) {

		var PI2 = 2*Math.PI;

		euler.x = ( (euler.x < 0) ?  PI2 + euler.x : euler.x  );
		euler.y = ( (euler.y < 0) ?  PI2 + euler.y : euler.y  );
		euler.z = ( (euler.z < 0) ?  PI2 + euler.z : euler.z  );

		euler.x %= PI2;
		euler.y %= PI2;
		euler.z %= PI2;
	}).functions('radToDeg', function (radian) {

		return radian*180/Math.PI+180;
	}).functions('degToRad', function (degree) {

		return (degree - 180) * Math.PI/180;
	}).functions('updateSkeleton', function (skinnedMesh) {

		var bones = [];

		if ( skinnedMesh.geometry && skinnedMesh.geometry.bones !== undefined ) {

			var bone, gbone, p, q, s;

			for ( var b = 0, bl = skinnedMesh.geometry.bones.length; b < bl; ++ b ) {
				
				gbone = skinnedMesh.geometry.bones[ b ];

				p = gbone.pos;
				q = gbone.rotq;
				s = gbone.scl;

				bone = new THREE.Bone( skinnedMesh );
				bones.push( bone );

				bone.name = gbone.name;
				bone.position.set( p[ 0 ], p[ 1 ], p[ 2 ] );
				bone.quaternion.set( q[ 0 ], q[ 1 ], q[ 2 ], q[ 3 ] );

				if ( s !== undefined ) {

					bone.scale.set( s[ 0 ], s[ 1 ], s[ 2 ] );

				} else {

					bone.scale.set( 1, 1, 1 );

				}

			}

			for ( var b = 0, bl = skinnedMesh.geometry.bones.length; b < bl; ++ b ) {

				gbone = skinnedMesh.geometry.bones[ b ];

				if ( gbone.parent !== - 1 ) {

					bones[ gbone.parent ].add( bones[ b ] );

				} else {

					skinnedMesh.add( bones[ b ] );

				}

			}

			skinnedMesh.normalizeSkinWeights();

			skinnedMesh.updateMatrixWorld( true );
			skinnedMesh.bind( new THREE.Skeleton( bones, undefined, undefined ) );

		}
	});

}) ();