require("../jasmine");
var coll = require("./coll");

describe("coll", function(){
	it("should append values", function(){
		var c = coll(), test = [];

		c.append('a');
		c.append('b');

		c.each(function(v, n, i){
			// console.log(v, n, i);
			test.push(v);
		});

		expect(test).toEqual(['a', 'b']);
	});

	it("should append named values", function(){
		var c = coll(), test = [];

		c.append({
			a: "a"
		});

		c.append({
			b: "b"
		});

		c.each(function(v, n, i){
			test.push({
				value: v,
				name: n,
				index: i
			});
		});

		expect(test).toEqual([
			{
				value: "a",
				name: "a",
				index: 0
			},
			{
				value: "b",
				name: "b",
				index: 1
			}
		]);
	});

	it("should by copyable", function(){
		var c = coll();

		c.append('one', 'two', 3);

		var c2 = c.copy();

		// c2.log();

		var c3 = coll();

		c3.append({
			one: 1
		}, {
			two: "two"
		});

		// c3.log();
		expect(c3.one.value).toBe(1);
		expect(c3.one.$parent).toBe(c3.items);

		var c4 = c3.copy();
		expect(c4.one.value).toBe(1);
		expect(c4.one.$parent).toBe(c4.items);

		// c4.log();
	});

	xit("should append values", function(){
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

		// c.log();

		c({
			four: 4,
			five: [1, 2, 3],
			six: { seven: 7, eight: function(){} }
		})

		// c.log();

		var c2 = c.copy();

		console.log('c2');
		// c2.log();

		console.log('c');
		// c.log();
	});
});