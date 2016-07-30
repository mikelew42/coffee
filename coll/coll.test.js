require("../jasmine");
var coll = require("./coll");

describe("item", function(){
	it("should not copy value, if it has a $parent", function(){
		
	});
});

describe("coll", function(){
	it("should append values", function(){
		var c = coll();

		c.append('a');
		c.append(2);
		c.append('three', 3);
		expect(c.three()).toBe(3);

		c.each(function(v, n, i){
			console.log(i, n, v);
		});
		c.eachItem(function(v, i){
			console.log(v.i, i);
		});
	});
});