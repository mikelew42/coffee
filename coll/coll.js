var sfn = require("../sfn");
var copy = require("../Copy");
var mod = require("../mod");
var is = require("../is");

// todo: handle overrides here, using set
// if coll.set({ existing: newValue }), should we create
// a new item, or just swap out item.value?
//		this probably depends, and should be configurable...
var item = sfn({
	__id: "coll item",
	factory: true,
	value: undefined,
	init: function(){
		if (!this.$parent)
			return;

		this.alias();

		this.i = this.$parent.items.push(this) - 1;
	},
	alias: function(){
		if (this._name){
			this.$parent[this._name] = this;
		}
	}
});

var coll = sfn({
	__id: "coll",
	factory: true,
	main: "append",
	items: [],
	item: item,
	appendDictionary: function(dict){
		for (var i in dict){
			this.appendNamed(i, dict[i]);
		}
	},
	appendNamed: function(name, value){
		this.item.copy({
			value: value,
			$parent: this,
			_name: name
		});
	},
	appendAnonymous: function(value){
		this.item.copy({
			value: value,
			$parent: this
		})
	},
	append: function(value){
		if (is.obj(value)){
			return this.appendDictionary(value);
		} else {
			return this.appendAnonymous(value);
		}
	},
	each: function(iterator){
		for (var i = 0; i < this.items.length; i++){
			iterator.call(this, this.items[i].value, this.items[i]._name, i);
		}
		return this;
	},
	eachItem: function(iterator){
		for (var i = 0; i < this.items.length; i++){
			iterator.call(this, this.items[i], i);
		}
		return this;
	},
	log: function(){
		var items = [];
		this.eachItem(function(item, i){
			items.push({
				i: item.i,
				_name: item._name,
				value: item.value
			});
		})
		console.table(items);
	}
});

module.exports = coll;