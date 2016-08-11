require("../jasmine");
var is = require("../is");
var mod = require("../mod");
var sfn = require("./sfn");

describe("sfn", function(){
	it("should return a function that's like mod", function(){
		var s1 = sfn();
		expect(is.fn(s1)).toBe(true);
		expect(s1.assign).toBe(mod.assign);
		expect(s1.set).toBeDefined();
	});

	it("should set a fn to main, and invoke it", function(){
		var called, ctx, s2 = sfn(function(){
			called = true;
			ctx = this;
		});

		s2();

		expect(called).toBe(true);
		expect(ctx).toBe(s2);
	});

	it("should assign props to itself", function(){
		var test, s3 = sfn({
			prop: 1,
			method: function(){
				this.yo = 123;
			}
		}, function(){
			expect(this.yo).toBeUndefined();
			this.method();
			expect(this.yo).toBe(123);
			test = true;
		});

		s3();

		expect(test).toBe(true);
	});

	it("should copy itself", function(){
		var s4 = sfn({
			one: 1,
			two: "two"
		});

		var s5 = s4.copy({
			three: true
		});

		expect(s5.one).toBe(1);
		expect(s5.two).toBe("two");
		expect(s5.three).toBe(true);

		s5.invoke = "copy";

		var s6 = s5();
		
		expect(s6.one).toBe(1);
		expect(s6.two).toBe("two");
		expect(s6.three).toBe(true);
		expect(s6).not.toBe(s5);
	});

	it("should provide a factory flag", function(){
		var s = sfn({
			factory: true,
			prop: 42
		});

		expect(s.factory).toBe(true);

		var s2 = s({
			newProp: 81
		});

		expect(s2.factory).toBeUndefined();
		expect(s2).not.toBe(s);
		expect(s2.prop).toBe(s.prop);
		expect(s2.newProp).toBe(81);

		var s3 = s2({
			newNewProp: 13
		});

		expect(s3).toBe(s2);
		expect(s2.newNewProp).toBe(13);

		var s4 = s3.copy({
			factory: true
		});

		expect(s4).not.toBe(s3);

		var s5 = s4();

		expect(s5).not.toBe(s4);
		expect(s5.newNewProp).toBe(13);
	});

	xit("should allow factory and invoke str", function(){
		// if factory: true, and invoke: fn || "str", then the sfn
		// should use copy on the first run, and then use the invoke
		// fn afterwards.
	});

	it("should allow $parent refs", function(){
		var s = sfn();
		s({
			child: sfn({
				$parent: s
			})
		})

		var s2 = s.copy();
		expect(s2.child.$parent).toBe(s2);
	});
});