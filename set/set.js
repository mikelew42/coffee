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
	__id: "standalone set",
	arg: function(mod, arg){
		// type switch
		if (is.obj(arg)){
			if (mod.set && mod.set.obj)
				return mod.set.obj(mod, arg);
			else
				return this.obj(mod, arg);
		} else if (is.fn(arg)){
			if (mod.set && mod.set.fn)
				return mod.set.fn(mod, arg);
			else
				return this.fn(mod, arg);
		} else if (is.val(arg)){
			if (mod.set && mod.set.val)
				return mod.set.val(mod, arg);
		}

		if (mod.set && mod.set.other){
			return mod.set.other(mod, arg);
		}
		
		console.warn(mod, "not sure how to set:", arg);
	},
	fn: function(mod, fn){
		console.warn("not sure what to do with this function");
	},
	obj: function(mod, obj){
		for (var i in obj){
			if (is.undef(mod[i])){
				this.stdProp(mod, i, obj);
			} else if (mod[i].set) // dependent on is.def(mod[i])
				mod[i].set.call(mod[i], obj[i]);
			else if (is.fn(mod[i]))
				this.fnProp(mod, i, obj);
			else
				this.stdProp(mod, i, obj);
		}
	},
	stdProp: function(mod, i, obj){
		if (mod.set && mod.set.stdProp && mod.set.stdProp !== this.stdProp)
			return mod.set.stdProp(mod, i, obj);

		mod[i] = obj[i];

		this.adopt(mod, i);
	},
	adopt: function(mod, i){
		if (i[0] !== "$" && mod[i] && mod[i].adopt && !mod[i].$parent)
			mod[i].$parent = mod;
	},
	fnProp: function(mod, i, obj){
		if (mod.set && mod.set.fnProp && mod.set.fnProp !== this.fnProp)
			return mod.set.fnProp(mod, i, obj);

		if (is.fn(obj[i])){
			this.stdProp(mod, i, obj);
		} else {
			if (is.arr(obj[i])){
				mod[i].apply(mod, obj[i]);
			} else {
				mod[i].call(mod, obj[i]);
			}
		}
	}
});

// this sfn is ssfn, and will not adopt!!!
var setOO = sfn(function(){
	for (var i = 0; i < arguments.length; i++){
		this.arg(arguments[i]);
	}
	return this.$parent || this;
}, {
	__id: "setOO",
	init: function(){
		if (this.$parent)
			this.mod = this.$parent;
	},
	arg: function(arg){
		if (is.obj(arg))
			this.obj(arg);
		else if (is.fn(arg))
			this.fn(arg);
		else if (is.str(arg))
			this.str(arg);
		else
			console.warn("not sure how to set:", arg);
	},
	obj: function(objArg){
		for (var i in objArg){
			this.prop(i, objArg);
		}
	},
	prop: sfn(function(propName, objArg){
		var newValue = objArg[propName];
		// if (is.undef(this.mod[propName]))
	}, {
		// adopt: true, // won't work on ssfn
		init: function(){
			if (this.$parent)
				this.mod = this.$parent.mod;
		},
		und: sfn(function(propName, objArg){

		})

	})
});

setOO.prop.$parent = setOO;

set.$oo = set.copy(function(){
	for (var i = 0; i < arguments.length; i++){
		this.arg(this.$parent, arguments[i]);
	}
	return this.$parent;
});


// set.$oo = sfn(function(){
// 	for (var i = 0; i < arguments.length; i++){
// 		this.arg(arguments[i]);
// 	}
// 	return this.$parent;
// }, {
// 	__id: "oo set",
// 	arg: function(arg){
// 		this._set.arg(this.$parent, arg);
// 	},
// 	obj: function(obj){
// 		this._set.obj(this.$parent, obj);
// 	},
// 	fnProp: function(i, obj){
// 		this._set.fnProp(this.$parent, i, obj);
// 	},
// 	_set: set
// });

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