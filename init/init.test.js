require("../jasmine");
var init = require("./init");

describe("init", function(){
	it("should work as a standalone module", function(){
		var testSub1 = false,
			testAnon = false,
			i1 = 

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
		// var obj = {
		// 	init: init()
		// };
	});
});