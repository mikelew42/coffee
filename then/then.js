var is = require("../is");
var coll = require("../coll");
var q = require("../q");

var cb = coll.item.copy({
	__id: "then.item/cb",
	alias: function(){
		// this.$parent is "then.items", this.$coll is "then", this.$coll.$parent is then's parent..
		if (this._name && this.$coll){
			this.$coll[this._name] = this;
			if (this.$coll.$parent){
				this.$coll.$parent[this._name] = this;
			}
		}
	}
});

var then = q({
	__id: "then",
	factory: true,
	assign: {
		item: cb // the set algorithm tries to use q.item.set, unless we explicitly use assign here
	},
	exec: function(){
		var args = arguments;
		this.eachItem(function(cbItem){
			cbItem.value.apply(cbItem.ctx || (this.$parent && this.$parent.$parent) || this.$parent || this, args);
		});
		return this.$parent || this;
	},
});

module.exports = then;