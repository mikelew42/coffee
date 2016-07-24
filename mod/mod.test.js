require("../jasmine");
var mod = require("./mod");

describe("mod", function(){
	it("should be defined", function(){
		expect(mod).toBeDefined();
	});

	it("should create an object with several methods", function(){
		// this doesn't really help anything, but its an interesting idea:
		// all "api" methods should form a contract, recognized by the vc/pm
		expect(mod.copy).toBeDefined();
		// expect(mod.copyTo).toBeDefined();
		expect(mod.assign).toBeDefined();
		// expect(mod.install).toBeDefined();
	});

	it("should have a set sfn that .$parent references self", function(){
		console.log(mod);
		var m = mod.copy();

		expect(mod.set.$parent).toBe(mod);
		expect(m.set.$parent).toBe(m);
	});

	it("should copy", function(){
		var m = mod.copy({
			test: 123
		});

		var m2 = m.copy({
			test2: 234
		});

		expect(m2.test).toBe(123);
		expect(m2.test2).toBe(234);
	});


	it("should have an awesome set algorithm", function(){
		var arg1, arg2, test, mod1 = mod.copy({
			one: 1,
			two: function(one, two){
				arg1 = one;
				arg2 = two;
			},
			obj: {
				set: function(t){
					test = t;
				}
			}
		});

		mod1.set({
			dne: 123,
			one: 2,
			two: [3, 4],
			obj: 5
		});

		expect(mod1.dne).toBe(123);
		expect(mod1.one).toBe(2);
		expect(arg1).toBe(3);
		expect(arg2).toBe(4);
		expect(test).toBe(5);

		mod1.set({ two: 6 });
		expect(arg1).toBe(6);

		mod1.set({ two: function(t){ test = t; } });
		mod1.set({ two: 456 });
		expect(test).toBe(456);
	});



	it("should persist $parent refs", function(){
		var m = mod.copy({
			prop: 1,
			sub: mod.copy({
				subSub: 2
			})
		});

		m.sub.$parent = m;

		var m2 = m.copy();

		expect(m2.sub.$parent).toBe(m2);

		// deep copying
		var m3 = m.copy({
			prop: 2,
			sub: {
				subSub2: 3
			}
		});

		expect(m3.sub.subSub2).toBe(3);
		expect(m3.sub.subSub).toBe(2);
		expect(m3.sub).not.toBe(m.sub);
		expect(m3.sub.$parent).toBe(m3);
	});

	it("should init with $parent ref", function(){
		var test, m = mod.copy({
			sub: mod.copy({
				init: function(){
					test = this.$parent
				}
			})
		});

		m.sub.$parent = m;

		var m2 = m.copy();

		expect(test).toBe(m2);
	});
});