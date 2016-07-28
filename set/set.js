var is = require("../is");
var sfn = require("../sfn/ssfn");

/*
technically, we could have 

set(one, two);

This is basically the 
mod.set({
	prop: value
})

and set(mod.prop, value)

It would do the type comparison, and either invoke the fn, pass the value
to mod.prop.set, or just assign it
*/

/*
 * mod: the obj that the args will be set to
 * args: object or array of anything
 */
var set = sfn(function(mod){
	var args = Array.prototype.slice.call(arguments, 1);
	if (mod && mod.set){
		return mod.set.apply(mod, args);
	}
	
	for (var i = 0; i < args.length; i++){
		this.arg(mod, args[i]);
	}
	return mod;
}, {
	arg: function(mod, arg){
		// type switch
		if (is.obj(arg)){
			if (mod.set && mod.set.obj)
				return mod.set.obj(arg);
			else
				return this.obj(mod, arg);
		} else if (is.fn(arg)){
			if (mod.set && mod.set.fn)
				return mod.set.fn(arg);
			else
				return this.fn(mod, arg);
		}
		
		console.warn(mod, "not sure how to set:", arg);
	},
	fn: function(mod, fn){
		console.warn("not sure what to do with this function");
	},
	obj: function(mod, obj){
		for (var i in obj){
			if (is.undef(mod[i]))
				mod[i] = obj[i]; // should we copy instead of assign obj literals?, or make references explicitly "refs"
			else if (mod[i].set) // dependent on is.def(mod[i])
				mod[i].set.call(mod[i], obj[i]);
			else if (is.fn(mod[i]))
				if (mod.set && mod.set.fnProp)
					mod.set.fnProp.call(mod.set, i, obj);
				else
					this.fnProp(mod, i, obj);
			else
				mod[i] = obj[i]; // mod[i] is defined, override
		}
	},
	fnProp: function(mod, i, obj){
		if (is.fn(obj[i])){
			mod[i] = obj[i];
		} else {
			if (is.arr(obj[i])){
				mod[i].apply(mod, obj[i]);
			} else {
				mod[i].call(mod, obj[i]);
			}
		}
	}
});

set.$oo = sfn(function(){
	for (var i = 0; i < arguments.length; i++){
		this.arg(arguments[i]);
	}
	return this.$parent;
}, {
	arg: function(arg){
		this._set.arg(this.$parent, arg);
	},
	obj: function(obj){
		this._set.obj(this.$parent, obj);
	},
	fnProp: function(i, obj){
		this._set.fnProp(this.$parent, i, obj);
	},
	_set: set
});

/*
A problem with this approach:

Am I going to copy the sfn, and override these methods in order to make it OO?
1) these functions are kind of a mess
2) I'd have to rewrite all the fn in order to make it OO

Unless I just use this fn inside the oo.set.

But, if I do that, the problem is, I don't get all the other set methods with it.
For example, if I do mod.set.obj = fn, then the standalone version above won't 
listen.

We need to be able to do:

mod.copy({
	set: {
		obj: function(){
			// brand new mod.set.obj fn
		}
	}
})
*/

module.exports = set;