require("../jasmine");
var Base = require("./Base");

describe("Base", function(){
	
	it("should create an instanceof Base", function(){
		expect(new Base() instanceof Base).toBe(true);
	});

	it("could work without new", function(){
		expect(Base() instanceof Base).toBe(true);
	});
	
	it("should take an object as first arg, and assign it to self", function(){
		var base = new Base({
			test: 1,
			prop: "two"
		});
		expect(base.test).toBe(1);
		expect(base.prop).toBe("two");
	});

	it("should assign and then call initialize", function(){
		var test, base = new Base({
			prop: 5,
			init: function(){
				test = this.prop;
			}
		});

		expect(base.prop).toBe(5);
		expect(test).toBe(5);
	});
});