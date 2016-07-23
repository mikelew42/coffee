var sfn = require("../sfn");
var copy = require("../copy");
var mod = require("../mod");
var is = require("../is");
var $ = require("jquery");

var view = sfn({
	factory: true,
	tag: "div",
	classes: [],
	class: [],
	children: [],
	attr: [],
	set: function(){
		if (arguments.length){
			for (var i = 0; i < arguments.length; i++){
				// if !jQuery, DOM, SymStr, etc...
				if (arguments[i] && arguments[i].render)
					this.addChild(arguments[i])
				mod.set.setArg(this, arguments[i]);
			}
		}
	},
	setStr: function(str){
		this.addChild(str);
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
		this.class.push(c);
	},
	render: function(){
		this.$el = $("<" + this.tag + ">").addClass(this.class.join(" "));
		this.renderChildren();
		return this.$el;
	},
	renderChildren: function(){
		var child;
		for (var i = 0; i < this.children.length; i++){
			child = this.children[i];
			if (is.str(child))
				this.$el.append(child);
			if (child && child.render)
				this.$el.append(child.render());
		}
	},
	addChild: function(view){
		this.children.push(view);
	}
});

Object.assign(view.set, mod.set);

module.exports = view;