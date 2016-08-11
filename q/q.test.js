require("../jasmine");
var q = require("./q");

describe("q", function(){
	it("auto q values", function(){
		var q1 = q({
			prop: 5
		});

		expect(q1.prop).toBe(5);
		expect(q.prop).toBeUndefined();

		var test1 = false;
		q1(function(){
			test1 = true;
		});

		expect(test1).toBe(false);

		q1.exec();

		expect(test1).toBe(true);
	});

	it("should take named cbs", function(){
		var q2 = q(),
			test1 = false,
			test2 = false,
			test2Fn = function(){
				test2 = true;
			};

		q2({
			test: function(){
				test1 = true;
			},
			test2: test2Fn
		});

		expect(q2.test2.value).toBe(test2Fn);

		expect(test1).toBe(false);
		expect(test2).toBe(false);

		q2.exec();

		expect(test1).toBe(true);
		expect(test2).toBe(true);
	});
});