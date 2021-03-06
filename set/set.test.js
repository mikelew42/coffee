require("../jasmine");
var set = require("./set");

describe("set", function(){
	it("should be defined", function(){
		expect(set).toBeDefined();
	});
	it("should assign in most cases", function(){
		var test, obj = {}, fn = function(a){
			test = a;
		}, objProp = { test: 1 };
		set(obj, {
			prop: 1,
			method: fn,
			objProp: objProp
		});

		expect(obj).toEqual({ prop: 1, method: fn, objProp: objProp });

		set(obj, {method: 456});

		expect(test).toBe(456);
	});

	it("should set $parent ref if adopt flag is set", function(){
		var obj = {}, sub = { adopt: true };

		set(obj, { sub: sub });

		expect(obj.sub.$parent).toBe(obj);
	});

	it("should work for a mod.set oo implementation", function(){
		var testMethod, mod = {
			method: function(){
				testMethod = arguments;
			}
		}, testMain, testArg, testObj, testFnProp, testStdProp;

		mod.set = set.$oo.copy(function(){
			testMain = true;
			set.$oo.main.apply(this, arguments);
		}, {
			$parent: mod,
			arg: function(mod, arg){
				testArg = true;
				set.$oo.arg.apply(this, arguments);
			},
			obj: function(obj){
				testObj = true;
				set.$oo.obj.apply(this, arguments);
			},
			fnProp: function(){
				testFnProp = true;
				set.$oo.fnProp.apply(this, arguments);	
			},
			stdProp: function(){
				testStdProp = true;
				set.$oo.stdProp.apply(this, arguments);
			}
		});

		mod.set({
			test: 1,
			method: [4, 5, 6],
			sub: { adopt: true }
		});

		expect(testMain).toBe(true);
		expect(testArg).toBe(true);
		expect(testObj).toBe(true);
		expect(testFnProp).toBe(true);
		expect(testMethod[0]).toBe(4);
		expect(testMethod[1]).toBe(5);
		expect(mod.test).toBe(1);
		expect(mod.sub.$parent).toBe(mod);
	});
});