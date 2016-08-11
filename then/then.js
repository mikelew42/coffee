var sfn = require("../sfn");
var copy = require("../copy");
var mod = require("../mod");
var is = require("../is");
var coll = require("../coll");
var q = require("../q");

var cb = coll.item.copy({
	__id: "then.item/cb",
	alias: function(){
		if (this._name){
			this.$parent[this._name] = this;
			if (this.$parent.$parent){
				this.$parent.$parent[this._name] = this;
			}
		}
	}
});

var then = q({
	factory: true,
	assign: {
		item: cb // the set algorithm tries to use q.item.set, unless we explicitly use assign here
	}
});

module.exports = then;