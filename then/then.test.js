require("../jasmine");
var then = require("./then");

describe("then", function(){
	it("should standalone", function(){
		var t1 = then(),
			test1 = false;
		
		t1(function(){
			test1 = true;
		});

		expect(test1).toBe(false);

		t1.exec();

		expect(test1).toBe(true);
	});

	it("should work on a module", function(){
		var obj = {},
			anonTest = false,
			namedTest = false,
			namedFn = function(){
				namedTest = true;
			};

		obj.then = then({
			$parent: obj
		});

		obj.then(function(){
			anonTest = true;
		});

		obj.then({
			named: namedFn
		});

		expect(anonTest).toBe(false);
		expect(namedTest).toBe(false);

		expect(obj.named.value).toBe(namedFn);

		obj.then.exec();

		expect(anonTest).toBe(true);
		expect(namedTest).toBe(true);
	});
});