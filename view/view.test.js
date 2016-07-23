require("../jasmine");
var is = require("../is");
var view = require("./view");
var $ = require("jquery");

describe("view", function(){
	it("should create a sfn", function(){
		var myView = view();

		expect(is.fn(myView)).toBe(true);
		expect(myView.set).toBeDefined();
	});

	it("should take x y z as view children", function(){
		// "str", jQuery, DOM, View(.render), mod, Symstring(.toString)

		// and arrays of these...
		var v = view("str", $(), [1, "two", view()], "last");
		// ===
		var v = view("str", $(), 1, "two", view(), "last");
		// this would be helpful, if you were, for example, resetting:
		v.reset(v.str, v.$someEl, v.oneTwoViewArr, v.last);
		// you can reuse certain groups for less duplication, such as v.btns
	});

	it("should render a jQuery element as it's .$el", function(){
		var v = view("Hello");
		v.render().appendTo("body");

		var $query = $("div:contains('Hello')");
		expect($query[0]).toBe(v.$el[0]);
		$query.remove();
	});

	it("should have a badass set method", function(){
		var v1 = view("world");
		var v2 = view("Hello", v1);
		v2.render().appendTo("body");

		expect($("div:contains('Hello')")[0]).toBe(v2.$el[0]);
	});

	it("should allow classes", function(){
		var v1 = view({
			addClass: "one two three"
		}, "yo");

		v1.render().appendTo('body');

		var $query = $("div:contains('yo')");

		expect($query[0]).toBe(v1.$el[0]);
		expect($query.hasClass('one two three')).toBe(true);
	});

	it("should allow nesting", function(){
		var post = view({
			factory: true
		})
	});

	it("should have variables", function(){
		var title = function(){}, v = view({
			normalProps: "123",
			symStr: "...",
			title: title('My Title')
		});

		// any value, view, or any other module can be passed as normal properties
		// then, how do we use these props in the rendering?

		// reset view:
		v.reset(v.root(
			v.child1,
			v.child2,
			v.child3
		));

		// but, this would just add the children to v.root, again. to reset 
		// v.root also, you'd have to use v.root.reset();

		// what if you could just call reset() first, or, resetAll() would
		// climb the tree and reset all descendants

		v.resetAll();
		// or
		v.reset();
	});

	it("should allow override of .set to use .reset", function(){
		var v = view({
			set: function(){
				return this.reset.apply(this, arguments);
			}
		});
	});

	describe("should allow 'extending' the views children", function(){
		it("should use .children <== coll", function(){
			// most methods come from shared base class
		});
		it("store children on root view and on each coll", function(){
			var v = view();
			v.append('myView', view());
			v.myView == view();
			v.children.myView == v.myView // ??

			v
		});
	})
});