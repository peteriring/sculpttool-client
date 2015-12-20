(function () {
	var Base = root.ns('classes.Base'),
		Self = Base.extend('TextureLoader');
	
	Self.addPublicProperties({
		load : function ( data , callback) {
			if (typeof data === 'string') {
				return this._loadTexture(data, callback);
			}
			return this._createTexture(data, callback);
		}
	});
	Self.addPrivateProperties({
		_hash : {},
		_placeHolders : {},
		_loader : new THREE.ImageLoader(),
		_loadTexture : function ( url, callback) {
			var that = this;
			var texture = new THREE.Texture(undefined);
			if (this._hash[url]) {
				texture = new THREE.Texture(this._hash[url]);
				texture.needsUpdate = true;
				if (typeof callback === 'function')
					callback (texture);
				return texture;
			}
			this._loader.load(url, function (image) {
				that._hash[url] = image;
				texture.image = image;
				texture.needsUpdate = true;
				if (typeof callback === 'function')
					callback (texture);
			});

			return texture;
		},
		_createTexture : function ( object , callback) {
			//creating hash identifier
			var that = this;
			var hashID = '';
			var loadedFlags = {};
			var images = {};
			var texture = new THREE.Texture(undefined);
			_.each(object, function (element, index) {
				if (typeof element === 'string') {
					hashID += element + '_';
				}
				else {
					hashID += element.red + '#' + element.green + '#' + element.blue + '_';
				}
				
			});

			if (this._hash.hasOwnProperty(hashID)) {
				texture = new THREE.Texture(this._hash[hashID]);
				if (this._hash[hashID] === undefined) {
					this._placeHolders[hashID] = this._placeHolders[hashID] || [];
					this._placeHolders[hashID].push(texture);
				}
				else {
					if (typeof callback === 'function')
						callback (texture);
				}
				
				texture.needsUpdate = true;
				return texture;
			}
			this._hash[hashID] = undefined;
			_.each(object, function (element, index) {
				if (typeof element !== 'string')
					return;
				loadedFlags[index] = false;
				images[index] = new Image();
				images[index].src = element;
				images[index].onload = function (image) {
					var flag = true;
					loadedFlags[index] = true;
					images[index].width = this.width;
					images[index].height = this.height;
					that._hash[object[index]] = images[index];
					_.each(loadedFlags, function (isLoaded) {
						flag = flag && isLoaded;
					});
					if (flag) {
						texture = that._generateImage(hashID, object, texture, callback);
					}
				}
			});

			return texture;
			
		},
		_generateImage : function (hashID, object, texture, callback) {
			
			var that = this;
			var imageDatas = [];
			var canvas = document.createElement("canvas");
			canvas.width = 512;
			canvas.height = 512;
			var context = canvas.getContext('2d');

			_.each (object, function (element, index) {
				
				var mycanvas = document.createElement("canvas");
				mycanvas.width = 512;
				mycanvas.height = 512;
				var mycontext = mycanvas.getContext('2d');
				if (typeof element !== 'string') {

					return;
				}
				mycontext.drawImage(that._hash[element] ,0,0);
				imageDatas.push(mycontext.getImageData(0,0,mycanvas.width, mycanvas.height));
			});
			var imageData = context.getImageData(0,0,canvas.width, canvas.height);
			var data = imageData.data;
			length2 = imageDatas.length;
			for (var i = 0, length = imageDatas[0].data.length; i < length; i += 4) {
				var red = object.color ? object.color.red : 0;
				var green = object.color ? object.color.green : 0;
				var blue = object.color ? object.color.blue : 0;
				for (var j = 0; j < length2;  ++j) {
					red = red * (255 - imageDatas[j].data[i + 3])/255 + imageDatas[j].data[i] * imageDatas[j].data[i + 3]/255;
					green = green * (255 - imageDatas[j].data[i + 3])/255 + imageDatas[j].data[i + 1] * imageDatas[j].data[i + 3]/255;
					blue = blue * (255 - imageDatas[j].data[i + 3])/255 + imageDatas[j].data[i + 2] * imageDatas[j].data[i + 3]/255;
				}
				data[i]     = red;
				data[i + 1] = green;
				data[i + 2] = blue;
				data[i + 3] = 255;
			}
			context.putImageData(imageData, 0, 0);

			var dataURL = canvas.toDataURL();

			this._loader.load(dataURL, function (image) {
				that._hash[hashID] = image;
				texture.image = image;
				texture.needsUpdate = true;
				if (typeof callback === 'function')
					callback (texture);

				_.each(that._placeHolders[hashID], function (repTexture) {
					repTexture.image = image;
					repTexture.needsUpdate = true;
					if (typeof callback === 'function')
						callback (repTexture);
				});

				delete that._placeHolders[hashID];
			});

			return texture;
		}
	});


	root.ns('classes.TextureLoader', Self);
}) ();