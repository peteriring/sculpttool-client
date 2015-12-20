/*************************
*       TRAIT
*************************/
/**
 * A felhasználói beavatkozásokért felel, Eseménykezelőket rögzít
 * A megfelelő osztályhoz társíva amennyiben az rendelkezik 
 * a megfelelő nevű funkcióval feliratkoztatja azt a jquery eseménykezelőre
 */
( function () {
	var Base = root.ns('classes.Base'),
		Self = Base.extend('Control');
	/**
	 * pressedKeys: az éppen lenyomva tartott gombok listája
	 * keybindings :Gomblenyomáskor meghívandó függvények nevének listája
	 */
	Self.addConstantProperties({
		pressedKeys : [],
		keysLocked : false,
		keybindings : {
			'87' : 'forward',
			'83' : 'backward',
			'65' : 'turnleft',
			'68' : 'turnright',
			'71' : 'death',
			'72' : 'hit',
			'32' : 'jump'
		  //'default': 'refresh'

		},
		keyLocks : {
			'87' : ['83'],
			'83' : ['87'],
			'65' : ['68'],
			'68' : ['65']
		}
	});
	Self.addPublicProperties({
		/**
		 * Regisztrálja a megfelelő egér, és billentyűzet eseményeket
		 * Csupán akkor regisztrál, ha a társosztályban létezik a megfelelő függvény
		 */
		register : function () {
			var that = this,
				events =['mousemove', 'wheel', 'mousedown', 'mouseup', 'mouseleave', 'click'];

			_.each(events, function (element) {
				if (typeof that[element] === 'function') {
			    	$('body').on(element, '#canvas', function (event) {
			    		that[event.type](event);
			    	});
            	}
			});

			_.each (that.keybindings, function (element, index) {
				if (typeof that[element] === 'function') {

			    	$(document.body).keydown(function(event) {
			    		var index = that.pressedKeys.indexOf('' + event.keyCode);
			    		if (index == -1 && that.keybindings.hasOwnProperty(event.keyCode)) {
			    			that.pressedKeys.push('' + event.keyCode);
			    			_.each (that.keyLocks[event.keyCode], function (removeFunction, removerKeyCode) {
			    				var index = that.pressedKeys.indexOf(removeFunction);
			    				if (index > -1) {
			    					that.pressedKeys.splice(index, 1);
			    				}
			    			});
			    		}
			    	}).keyup(function(event) {
						var index = that.pressedKeys.indexOf('' + event.keyCode);
						if (index > -1) {
						    that.pressedKeys.splice(index, 1);
						}
			        });
            	}
			});
		},
		/**
		 * Feliratkoztatáskor használt anonymus fgv miatt nem tudtam megvalósítani
		 */
		unregister : function () {
			//TODO
		},
		/**
		 * Az események tényleges lekezelése
		 * végighalad a lenyomott gombok listáján, és meghívja a hozzá tartozó függvényt
		 * amennyiben nem létezik olyan függvény, a 'REFRESH' függvényt hívja meg
		 * amennyiben nincs gomb lenyomva, az 'IDLE' függvényt hívja meg
		 */
		handleEvents : function () {
			var that = this;
			_.each (that.pressedKeys, function (key) {
				var element = that.keybindings[key];
				if (!that.keysLocked) {
					if (typeof that[element] === 'function') {
						(that[element])();
					} else if (typeof that.refresh === 'function') {
						that.refresh ();
					}
				}
			});
			if (that.pressedKeys.length == 0 && typeof that.idle === 'function' && !that.keysLocked) {
				that.idle ();
			}
			

			if (typeof that.update === 'function') {
				that.update();
			}
		}
	});

	root.ns('traits.Control', Self);

}) ();