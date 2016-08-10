var sfn = require("../sfn");
var copy = require("../copy");
var mod = require("../mod");
var is = require("../is");
var coll = require("../coll").copy();

var q = coll({
	factory: true,
	set: {
		obj: function(obj){
			for (var i in )
		}
	},
	exec: function(){
		var args = arguments;
		this.eachItem(function(cbItem){
			cbItem.value.apply(cbItem.ctx || this.$parent || this, args);
		});
		return this.$parent || this;
	}
});

module.exports = q;