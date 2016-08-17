var sfn = require("../sfn");
var set = require("../set");
var copy = require("../Copy");
var mod = require("../mod");
var is = require("../is");
var coll = require("../coll");
var $ = require("jquery");
// require("logger/index.js");

/*
switch over children to use this coll
children.items won't copy their value if it has another parent
the children parent object has reference to the view, and in its init, can 
loop through items, see if they have a handle, see if it lives on the view, and assign
it to collItem.value.

The only way this fails is if the collItem's handle is incorrect, and/or the
view's handle is incorrect, and/or the view's handle value is incorrect.
*/
var children = coll({
	__id: "children coll",
	factory: true,
	adopt: true,
	init: function(){
		this.referenceChildren();
	},
	referenceChildren: function(){
		if (!this.$parent)
			return;

		this.each(function(value, name, index){
			if (this.$parent[name])
				this[name].value = this.$parent[name];
		});
	},
	set: {
		fn: function(children, fn){
			if (fn.tag){
				if (fn.type){
					children.append(fn.type, fn);
					children.$parent[fn.type] = fn;
					fn.$parent = children.$parent;
				} else {
					children.append(fn);
				}
			}
		},
		val: function(children, val){
			if (is.undef(children.$parent.value))
				children.$parent.value = val;
			children.append(val);
		}
	},
	rendr: function rendr(){
		this.each(function(child, name, index){
		// 	console.dir(this);
		// 	console.dir(this.$parent);
		// 	console.log(this.$parent.$el);
			if (is.str(child))
				this.$parent.$el.append(child);
			if (child && child.render)
				this.$parent.$el.append(child.render());
		});
	}
});

var view = sfn({
	__id: "view",
	factory: true,
	tag: "div",
	classes: [],
	children: children(),
	attr: [],
	set: {
		arg: function(view, arg){
			if (arg && (is.val(arg) || arg.render))
				return view.children(arg);
			else 
				return set.$oo.arg(view, arg);
		}
	},
	init: function(){
		this.initView();
	},
	initView: function(){
		// this.children = Coll();
		// this.attr = Coll();
		// this.classes = Coll();
	},
	addClass: function(c){
		this.classes.push(c);
	},
	render: function(){
		if (this.$el)
			return this.$el;
		else
			return this.rerender();
	},
	rerender: function(){
		if (this.type && this.classes.indexOf(this.type) === -1){
			this.addClass(this.type);
		}
		this.$el = $("<" + this.tag + ">").addClass(this.classes.join(" "));
		this.children.rendr();
		return this.$el;
	}
});

// Object.assign(view.set, mod.set);

module.exports = view;