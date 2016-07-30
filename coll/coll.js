var sfn = require("../sfn");
var copy = require("../copy");
var mod = require("../mod");
var is = require("../is");

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