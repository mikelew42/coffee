var sfn = require("../sfn");
var copy = require("../copy");
var mod = require("../mod");
var is = require("../is");

// todo: handle overrides here, using set
// if coll.set({ existing: newValue }), should we create
// a new item, or just swap out item.value?
//		this probably depends, and should be configurable...
var item = sfn({
	__id: "coll item",
	factory: true,
	value: undefined
});

var coll = sfn({
	__id: "coll",
	factory: true,
	items: [],
	append: function(name, value){
		// TODO: move as much of this logic as possible to the item
		if (is.undef(value)){
			value = name;
			name = false;
		}

		value = item({
			value: value,
			$parent: this
		});

		if (name){
			value._name = name;
			this[name] = value;
		}

		value.i = this.items.push(value) - 1;
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
	}
});

module.exports = coll;