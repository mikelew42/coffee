var is = require("../is");
var copy = require("../copy");
var copy2 = copy.copy2;

var setArg = function(mod, arg){
	// type switch
	if (is.obj(arg)){
		if (mod.setObj)
			mod.setObj(arg);
		else
			setObj(mod, arg);
	} else if (is.str(arg)){
		if (mod.setStr)
			mod.setStr(arg);
		else
			console.warn('not sure how to set str');
	} else if (is.num(arg) || is.bool(arg)){
		console.warn('setNum and setArg not yet implemented');
	} else if (is.arr(arg)){
		console.warn('setArr not yet implemented');
	} else if (is.fn(arg)){
		if (mod.setFn)
			mod.setFn(arg);
		else
			console.warn('setFn not implemented');
	}
};

var setObj = function(mod, obj){
	for (var i in obj){
		//assign?
		//deep extend?
		//use .set?
		//invoke?
		if (is.undef(mod[i]))
			mod[i] = obj[i]; // might not want to assign obj literals, or make references explicitly "refs"
		else if (mod[i].set) // dependent on is.def(mod[i])
			mod[i].set.call(mod[i], obj[i]);
		else if (is.fn(mod[i]))
			setFnProp(mod, i, obj);
		else
			mod[i] = obj[i]; // override
	}
};

// mod[i] is fn, set to obj[i]?
var setFnProp = function(mod, i, obj){
	if (!is.fn(obj[i])){
		if (is.arr(obj[i])){
			mod[i].apply(mod, obj[i]);
		} else {
			mod[i].call(mod, obj[i]);
		}
	}
};

/************
	MOD
*************/
var mod = {
	copy: function(o){
		var c = copy(this, null, true).assign(o);
		if (c.init) c.init();
		return c;
	},
	// copyTo: copy.to,
	assign: function(obj){
		return Object.assign(this, obj);
	},
	// install: function(m){
	// 	m.copyTo(this);
	// 	return this;
	// }
	set: function(){
		if (arguments.length){
			for (var i = 0; i < arguments.length; i++){
				setArg(this, arguments[i]);
			}
		}
		return this;
	}
};


mod2 = mod.copy({
	copy: copy2.oo,
	copyTo: copy2.to,
	props: {},
	prop: function(name){
		var p, set, val;

		if (this.props[name])
			return this.props[name];

		p = Property.clone({
			name: name
		});

		if (is.def(this[name])){
			set = true;
			val = this[name];
		}

		p.defineOnto(this);

		if (set)
			this[name] = val;

		return p;
	},
	ref: function(name){
		var r;
		if (this.props[name] && this.props[name].reference)
			return this.props[name];

		// only difference is the class used here...
		// morphable classes could be used
		r = Reference.clone({
			name: name
		});

		r.defineOnto(this);
		return r;
	}
});

module.exports = mod;