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

	xit("should take x y z as view children", function(){
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

	it("should allow css classes", function(){
		var v1 = view({
			addClass: "one two three"
		}, "yo");

		v1.render().appendTo('body');

		var $query = $("div:contains('yo')");

		expect($query[0]).toBe(v1.$el[0]);
		expect($query.hasClass('one two three')).toBe(true);
	});

	xit("should allow nesting", function(){
		var post = view({
			factory: true
		})
	});

	xit("should have variables", function(){
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

		// what if reset/resetAll could be a method, so you can use predefined
		// sub templates?
		v.reset = function(){
			return view() || [view(), view(), view()]
			// return view({classes: "root"},
			// 	this.preview({ classes: "addAClass" }),
			// 	this.content.addClass('new-class').children().children.reset();
			// );
		};

		var v = view({
			root: view().classes('root'),
			preview: view().classes('preview'),
			title: view("This is a Title"),
			icon: icon("beer"),
			content: view().classes('content'),
			// when trying to override children coll with a function, this one should intercept the fn
			// and run it, and pass its return values to "set"
			children: function(){
				return this.root(
					this.preview || this.preview(this.icon, this.title), // both return the sfn object..
					this.content("Weee")
				);
			}
		});

		var prop = view.$prop = function(name){
			return {
				__propName: name
			}
		};

		var v = view({
			root: view(),
			preview: view(),
			title: view(),
			icon: icon(),
			content: view()
		},
			// ewww
			prop('root',
				prop('preview', prop('icon'), prop(''))
			)
		);

		// i suppose all these views could be assigned as props automatically, but the need a "type"
		view("item", {
			optional: "props"
		}, 
			view("preview", icon("beer"), view("title", "Here's a title"))
		);

		// this restricts you to have 1 view for the root, rather than have an array of root items
		// also, i really don't like the way the children look above, they're just kinda floating in
		// no mans land

		// maybe the best option is to use the children property when using an object:

		view("item", {
			optional: "props",
			children: view() || [view(), view()]
		});

		view("css-class", {}, "content");
		//vs/
		view("jsPropAndClass", { // THIS CAN BE A SPECIAL CSS CLASS:  THE VIEW.TYPE
			children: "Simple String Content"
		});

		// if you're adding views to other views:
		var v = view(view("title", "My Title"), view("desc", "Description"));
		v.title == view("title", "My Title");
		v.desc == view("desc", "Description");

		// ROOT VS ABSTRACT
		// does that mean the root view defines the classes?
		// i suppose you could toggle a "renderRoot" property, to not render self, and return an array
		// of children

		view({
			abstract: true, // this view isn't rendered directly
			children: [] // when rendered, returns the array of rendered children
		});

		//vs normal:

		var v = view("classes", {
			classes: "either way", // this view is the root, and children are added to it, in order
			children: [view(), view( view(), view() )]
		})


		// view()--> set --> set children should remain, so you can do
		view( view(), view() )

		// one str --> defaults to children.set
		view("Children");
		// this works well for simple text views:
		title("My Title");

		// two strings --> first is classes.set(), second is children.set()
		view("classes", "Children");
		title("add-class", "My Title");


		// can view.classes.remove() return the view?  sure why not
		title("My Title").classes("add").classes.remove("one")
	});

	it("should allow override of .set to use .reset", function(){
		var v = view({
			set: function(){
				return this.reset.apply(this, arguments);
			}
		});
	});

	xdescribe("should allow 'extending' the views children", function(){
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