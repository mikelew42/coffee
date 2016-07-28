var is = require("../is");
var copy = require("../copy");
var set = require("../set");
// require set below
var copy2 = copy.copy2;


/*
This "private" code is nice, because it keeps the object clean.  For example, instead
of putting 100 methods on the base object, so that every time you log it, you have to
scroll through all the methods to find the one you're looking for... you can just leave
the API methods that most users will need.

However, that means that this functionality can't be customized.

You could expose an internals object that the class references, that has all
these internal functions on it.  These are like the private methods that can be
overridden, but only if you really need to
*/

/************
	MOD
*************/
// we need to export early, for circular dependency reasons
var mod = module.exports = {
	copy: copy.oo,
	// copyTo: copy.to,
	assign: function(obj){
		return Object.assign(this, obj);
	},
	// install: function(m){
	// 	m.copyTo(this);
	// 	return this;
	// }
	// set: function(){
	// 	if (arguments.length){
	// 		for (var i = 0; i < arguments.length; i++){
	// 			this.set.setArg(this, arguments[i]);
	// 		}
	// 	}
	// 	return this;
	// }
};



mod.set = set.$oo.copy({
	$parent: mod
});

// mod.set.setArg = function(mod, arg){
// 	// type switch
// 	if (is.obj(arg)){
// 		if (mod.setObj)
// 			mod.setObj(arg);
// 		else
// 			mod.set.setObj(mod, arg);
// 	} else if (is.str(arg)){
// 		if (mod.setStr)
// 			mod.setStr(arg);
// 		else
// 			console.warn('not sure how to set str');
// 	} else if (is.num(arg) || is.bool(arg)){
// 		console.warn('setNum and setArg not yet implemented');
// 	} else if (is.arr(arg)){
// 		console.warn('setArr not yet implemented');
// 	} else if (is.fn(arg)){
// 		if (mod.setFn)
// 			mod.setFn(arg);
// 		else
// 			console.warn('setFn not implemented');
// 	} else {
// 		if (mod.setOther)
// 			mod.setOther(arg);
// 		else
// 			console.warn('setOther not implemented');
// 	}
// };

// mod.set.setObj = function(mod, obj){
// 	for (var i in obj){
// 		//assign?
// 		//deep extend?
// 		//use .set?
// 		//invoke?
// 		if (is.undef(mod[i]))
// 			mod[i] = obj[i]; // copy instead of assign obj literals?, or make references explicitly "refs"
// 		else if (mod[i].set) // dependent on is.def(mod[i])
// 			mod[i].set.call(mod[i], obj[i]);
// 		else if (is.fn(mod[i]))
// 			mod.set.setFnProp(mod, i, obj);
// 		else
// 			mod[i] = obj[i]; // override
// 	}
// };

// mod.set.setFnProp = function(mod, i, obj){
// 	if (is.fn(obj[i])){
// 		mod[i] = obj[i];
// 	} else {
// 		if (is.arr(obj[i])){
// 			mod[i].apply(mod, obj[i]);
// 		} else {
// 			mod[i].call(mod, obj[i]);
// 		}
// 	}
// };

// mod2 = mod.copy({
// 	copy: copy2.oo,
// 	copyTo: copy2.to,
// 	props: {},
// 	prop: function(name){
// 		var p, set, val;

// 		if (this.props[name])
// 			return this.props[name];

// 		p = Property.clone({
// 			name: name
// 		});

// 		if (is.def(this[name])){
// 			set = true;
// 			val = this[name];
// 		}

// 		p.defineOnto(this);

// 		if (set)
// 			this[name] = val;

// 		return p;
// 	},
// 	ref: function(name){
// 		var r;
// 		if (this.props[name] && this.props[name].reference)
// 			return this.props[name];

// 		// only difference is the class used here...
// 		// morphable classes could be used
// 		r = Reference.clone({
// 			name: name
// 		});

// 		r.defineOnto(this);
// 		return r;
// 	}
// });