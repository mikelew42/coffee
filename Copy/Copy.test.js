require("../jasmine");
var is = require("../is");
var copy = require("./Copy");

describe("copy", function(){
	it("should return simple values", function(){
		expect(copy(1)).toBe(1);
		expect(copy("two")).toBe("two");
		expect(copy(false)).toBe(false);
		expect(copy(undefined)).toBe(undefined);
	});

	it("should return normal functions", function(){
		var fn = function(){};
		expect(copy(fn)).toBe(fn);
	});

	it("should copy empty objects", function(){
		var obj = {},
			objCopy = copy(obj);
		
		expect(objCopy).toEqual(obj);
		expect(objCopy).not.toBe(obj);
		expect(is.obj(objCopy)).toBe(true);
	});

	it("should skip private properties", function(){
		var obj = {
				copyMe: 1,
				$dontCopyMe: 2
			},
			objCopy = copy(obj);

		expect(objCopy).toEqual({ copyMe: 1 });
	});

	it("should reassign $parent refs", function(){
		var obj = {
			sub: {}
		};

		obj.sub.$parent = obj;

		var objCopy = copy(obj);

		expect(objCopy.sub.$parent).toBe(objCopy);
	});

	it("should reassign if $parent !== this", function(){
		var obj = {
			sub: {
				$parent: true
			}
		};

		var objCopy = copy(obj);

		expect(objCopy.sub).toBe(obj.sub);
	});

	it("should defer to the object-oriented obj.copy, if available", function(){
		var obj = {
				copy: function(){
					return 5;
				}
			},
			objCopy = copy(obj);

		expect(objCopy).toBe(5);
	});

	it("should deep copy objects and arrays", function(){
		var obj = {
				arrProp: [{ test1: 111 }, "two", 3],
				objProp: {
					arrrr: [1, 2, 3],
					objSubProp: { test: 222 }
				}
			},
			objCopy = copy(obj);

		expect(objCopy).toEqual(obj);
		expect(objCopy.arrProp).not.toBe(obj.arrProp);
		expect(objCopy.arrProp[0]).not.toBe(obj.arrProp[0]);
		expect(objCopy.objProp).not.toBe(obj.objProp);
		expect(objCopy.objProp.arrrr).not.toBe(obj.objProp.arrrr);
		expect(objCopy.objProp.objSubProp).not.toBe(obj.objProp.objSubProp);
	});
});

describe("copy.oo", function(){
	it("should work attached to an object", function(){
		var obj = {
				copy: copy.oo,
				test: 1
			},
			objCopy = obj.copy();

		expect(objCopy).toEqual(obj);
	});
});