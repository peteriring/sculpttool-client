/*************************
*       BASE JS
*************************/
/**
 * Alaposztály, tartalmazza a leszármaztatást, példányosítást, propertyhozzáadást, osztályvizsgálatot
 * @return {Object}
 */
 (function () {
    var Self = (function () {
        return {
            /**
             * paraméterül adott objektumból átmásolja a propertyket egy másikba
             * @param {Object} methods      objektum ami tartalmazza a létrehozandó osztály propertyjeit
             * @param {boolean} enumerable   végig lehet-e iterálni az adott propertyn
             * @param {boolean} writable     írni lehet-e az adott propertyt
             * @param {boolean} configurable meg lehet-e változtatni a típusát az adott propertynek
             * @return {bone.Base} Base vagy annak leszármazottai
             */
            _addProperties: function (methods, enumerable, writable, configurable) {

                var methodNames = Object.keys(methods),
                    i, methodName;

                for (i = 0; i < methodNames.length; i++) {
                    methodName = methodNames[i];
                    Object.defineProperty(this, methodName, {
                        value       : methods[methodName],
                        enumerable  : enumerable,
                        writable    : writable,
                        configurable: configurable
                    });
                }
                return this;

            },
            /**
             * publikus statikus metódusokat, változókat ad hozzá az osztályhoz
             * @param {Object} methods metódusokat és változókat tartalmazó objektum
             */
            addPublicProperties: function (methods) {
                return this._addProperties(methods, true, true, true);
            },
            /**
             * privát statikus metódusokat, változókat ad hozzá az osztályhoz
             * @param {Object} methods metódusokat és változókat tartalmazó objektum
             */
            addPrivateProperties: function (methods) {
                return this._addProperties(methods, false, true, true);
            },
            /**
             * publikus statikus konstants metódusokat, változókat ad hozzá az osztályhoz
             * @param {Object} methods metódusokat és változókat tartalmazó objektum
             */
            addConstantProperties: function (methods) {
                return this._addProperties(methods, true, false, false);
            },

        }
    }());
    
    Self
        .addPrivateProperties({
            _extend: function (className) {
                // egyel növeli a prototipikus láncot
                var result = Object.create(this);

                if (className) {
                    result.addPublicProperties({
                        classes: [className]
                    });
                }

                return result;
            }
        }).addPublicProperties({
            /**
             * osztály neve
             * @type {string}
             */
            classes: ['Base'],
            /**
             * származtató függvény, emeli a prototipikus láncot
             * @param  {string} className osztálynév
             * @return {bone.Base}        Base gyerek
             */
            extend: function (className) {

                return this._extend('classes.' + className);
            },
            implement: function (className) {

                return this._extend('traits.' + className);
            },
            /**
             * kisegítő osztályt ad az osztálynak (trait), melyet a szülőkhöz ad
             * @param  {trait}            a kisegítő osztály
             * @return {bone.Base}        Base gyerek
             */
            addTrait: function (trait) {
                var classes = this.classes.slice(),
                    i = 0,
                    tClasses = trait.classes,
                    length = tClasses.length;
                
                for (i = 0; i < length; ++i) {
                    if (classes.indexOf(tClasses[i]) < 0) {
                        classes.push(tClasses[i]);
                    }
                }

                this.addPublicProperties(trait);
                this.addPublicProperties({
                    classes : classes
                });

                return this;

            },
            /**
             * létrehozza, visszaadja a cacheből az adtt osztály példányát
             * @param  {bone.Key} key ha van kulcs, kikeresi a cacheből
             * @return {bone.Base}     Base vagy gyerekeinek példánya
             */
            create: function () {

                var instance = this._extend.call(this);

                if (typeof instance.init === 'function') { 
                    instance.init.apply(instance, arguments);
                }
                
                return instance;

            },
            /**
             *
             */
            super: function () {

                var index = 0,
                    result = {},
                    classes = this.classes,
                    name;

                for (index = 0; index < classes.length; ++index) {

                    name = classes[index];
                    result[name] = root.ns(name);
                }

                return result;
            },
            /**
             * Megmondja egy Base gyerekről osztálynév alapján, h milyen osztály
             * @param  {string}  className osztálynév
             * @return {boolean} 
             */
            isA: function (className) {
                var hOp = Object.hasOwnProperty,
                    proto = this.__proto__;

                if (hOp.call(this, 'classes') && this['classes'].indexOf(className) >= 0) {
                    return true;
                } else {
                    if (proto && hOp.call(proto, 'classes')) {
                        return this.isA.call(proto, className);
                    } else {
                        return false;
                    }
                }
            },

            noOp: function () {
                console.log('not implemented');
            }
            
        });

        root.ns('classes.Base', Self);
    }) ();