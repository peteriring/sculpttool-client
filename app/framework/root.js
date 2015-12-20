root = {
    fn: {},

    ns: function (path, prop) {
        var pointIndex = path.indexOf('.');
        if (pointIndex === -1) {
        	if (prop) {
        		this[path] = prop;
        	}
        	return this[path];
        } else {
            var tag = path.substring(0, pointIndex)
            if (!this[tag]) {
                this[tag] = {};
            }
        	return root.ns.call(this[tag], path.substring(pointIndex + 1), prop);  
        }
    },

   functions : function (key, value) {

        if (typeof value === 'function') {

            this.fn[key] = value;
            return this;
        }
        return this.fn[key];
    }
};