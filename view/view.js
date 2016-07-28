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
	set: {
		arg: function(arg){
			if (arg && (is.str(arg) || arg.render))
				return this.$parent.addChild(arg);
			else 
				return this._set.arg(this.$parent, arg);
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
		this.class.push(c);
	},
	render: function(){
		if (this.$el)
			return this.$el;
		else
			return this.rerender();
	},
	rerender: function(){
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

// Object.assign(view.set, mod.set);

module.exports = view;