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
		c(2);
		// c.append('three', 3);

		// for now, use { three: 3 } over "three", 3, to be more compatible
		// when trying to use coll.set() --> append()
				// i don't know how i would intercept the coll.set("three", 3) syntax
				// by default, that would iterate over each arg, calling coll.set.arg("three")
				// and then coll.set.arg(3)

		c({ three: 3 })

		// expect(c.three()).toBe(3);

		// c.each(function(v, n, i){
		// 	console.log(i, n, v);
		// });
		// c.eachItem(function(v, i){
		// 	console.log(v.i, i, v.value, v._name);
		// });

		c.log();

		c({
			four: 4,
			five: [1, 2, 3],
			six: { seven: 7, eight: function(){} }
		})

		c.log();
	});
});