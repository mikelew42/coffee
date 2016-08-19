require("../jasmine");
var init = require("./init");
var sfn = require("../sfn");

describe("init", function(){
	it("should work as a standalone module", function(){
		var testSub1 = false,
			testAnon = false,
			i1 = init();

		i1({
			sub1: function(){
				testSub1 = true;
			}
		});

		i1(function(){
			testAnon = true;
		})

		i1.then.exec();

		expect(testSub1).toBe(true);
		expect(testAnon).toBe(true);

		i1({
			sub1: function(){
				testSub1 = 1;
			}
		})

		i1();

		expect(testSub1).toBe(1);
	});

	it("should work as a sub module", function(){
		var mod = sfn({
			init: init()
		}), test1 = 0, test2 = 0, test3 = 0, ctx1, ctx2;

		expect(mod.init.$parent).toBe(mod);
		expect(mod.init.then.$parent).toBe(mod.init);
		expect(mod.init.then.$parent.$parent).toBe(mod);

		mod.init(function(){
			test1++;
			ctx1 = this;
		});

		var mod2 = mod.copy({
			init: function(){
				test2++;
				ctx2 = this;
			}
		});

		expect(test1).toBe(1);
		expect(test2).toBe(1);

		expect(ctx1).toBe(mod2);
		expect(ctx2).toBe(mod2);

		var mod3 = mod2.copy({
			init: {
				yoyo: function(){
					test3 = 10;
					ctx1 = this;
				}
			}
		});

		expect(test1).toBe(2);
		expect(test2).toBe(2);
		expect(test3).toBe(10);
		expect(ctx1).toBe(mod3);

		var mod4 = mod3.copy({
			init: {
				yoyo: function(){
					test3 = 20;
					ctx1 = this;
				}
			}
		});

		expect(test1).toBe(3);
		expect(test2).toBe(3);
		expect(test3).toBe(20);
		expect(ctx1).toBe(mod4);
		
	});
});