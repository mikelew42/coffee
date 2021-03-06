var sfn = require("../sfn");
var set = require("../set");
var copy = require("../Copy");
var mod = require("../mod");
var is = require("../is");
var coll = require("../coll");
var init = require("../init");
var $ = require("jquery");

var childViewItem = coll.item.copy({
	__id: "childViewItem",
	remove: function(){
		var index;

		if (this.$coll){

			// remove from children coll's items array
			index = this.$coll.items.indexOf(this);
			this.$coll.items.splice(index, 1);

			// remove aliases from children coll and view
			if (this._name){

				// delete reference from children coll
				if (this.$coll[this._name]){
					delete this.$coll[this._name];
				}

				// delete reference from children coll's parent (view)
				if (this.$coll.$parent[this._name]){
					delete this.$coll.$parent[this._name];
				}
				
			}
		}
	}
});

var children = coll({
	__id: "children coll",
	factory: true,
	adopt: true,
	init: function(){
		var self = this;
		// console.log('view.children.init', this.$parent && this.$parent.__id);
		this.$parent && this.$parent.init(function(){
			// this.log();
			self.reAlias();
			self.initSubViews();
		});
	},
	initSubViews: function(){
		if (!this.$parent)
			return;

		this.each(function(value, name, index){
			if (this.$parent[name])
				this[name].value = this.$parent[name];
		});
	},
	set: {
		fn: function(children, fn){
			// console.log('children.set.fn', fn);
			if (fn.tag){
				// console.log('children.set.fn.tag', fn.tag);
				if (fn.type){
					// console.log('appending view', fn.tag, fn.type);
					children.appendNamed(fn.type, fn);
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
		},
		stdProp: function(children, i, obj){
			var value = obj[i];

			if (i[0] !== "$" && is.fn(value)){
				if (value.tag){
					children.appendNamed(i, value);
					children.$parent[i] = value;
					value.$parent = children.$parent;
					return;
				}
			}

			children[i] = obj[i];
			this.adopt(children, i);
		}
	},
	reset: function(){
		this.removeAll();
	},
	removeAll: function(){
		this.each(function(child, name){
			if (this[name] === child)
				delete this[name];
			
			if (this.$parent[name] === child.value)
				delete this.$parent[name];

			// any other cleanup? maybe the item should do this itself

		})
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
	},
	log: function(){
		console.group("children [" + this.items.length + "]");
			this.each(function(child, name, index){
				console.group(index, name, child.value && child.value.__id);
				child.log && child.log();
				console.groupEnd();
			});
		console.groupEnd();
	}
});

var view = sfn({
	__id: "view",
	factory: true,
	tag: "div",
	classes: [],
	children: children(),
	attr: [],
	init: init(),
	set: {
		arg: function(view, arg){
			// console.log('view.set arg', arg, arg.render);
			if (arg && (is.val(arg) || arg.render)){
				// console.log('view.children(arg)');
				return view.children.set(arg);
			}
			else 
				return set.$oo.arg(view, arg);
		}
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
	},
	log: function(){
		console.group(this.__id);
			if (this.value){
				console.log(this.value);
			} else {
				this.children.log();
			}
		console.groupEnd();
	}
});

// Object.assign(view.set, mod.set);

module.exports = view;