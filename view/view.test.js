require("../jasmine");
var is = require("../is");
var view = require("./view");
var $ = require("jquery");
// require("logger/index.js");

describe("view", function(){
	it("should create a sfn", function(){
		var myView = view();

		expect(is.fn(myView)).toBe(true);
		expect(myView.set).toBeDefined();
		expect(myView.children.$parent).toBe(myView);
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
		var v = view("Hello" );
		// var v = view({ children: "Hello" });

		expect(v.children.$parent).toBe(v);
		// v.log();

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
		v2.$el.remove();
	});

	it("should allow css classes", function(){
		var v1 = view({
			addClass: "one two three"
		}, "yo");

		v1.render().appendTo('body');

		var $query = $("div:contains('yo')");

		expect($query[0]).toBe(v1.$el[0]);
		expect($query.hasClass('one two three')).toBe(true);
		v1.$el.remove();
	});

	it("should allow named children", function(){
		var one = view("one");
		var two = view("two", { type: "two" });
		var v = view(one, two);

		expect(v.two).toBe(two);
		expect(v.two.$parent).toBe(v);
		expect(v.children.$parent).toBe(v);
		expect(v.children.items[0].$parent).toBe(v.children.items);
		expect(v.children.items[0].$coll).toBe(v.children);
	});

	it("should be copyable", function(){
		var one = view("one", { __id: "one" });
		var two = view('two', { type: "two", __id: "two" });
		var v = view(one, two, { __id: "v" });

		// console.log('v');
		// console.dir(v);
		// console.log(v.render()[0].outerHTML);
		expect(v.children.$parent).toBe(v);

		v.children.each(function(child, name, index){
			// log.group('v.children.items.item');
			// console.log(name);
			// console.dir(child);
			// log.end();


			// anonymous views won't have a parent
			if (child.$parent)
				expect(child.$parent).toBe(v);
		});

		v.children.eachItem(function(item, index){
			expect(item.$parent).toBe(v.children.items);
			expect(item.$coll).toBe(v.children);
			if (item._name)
				expect(v[item._name]).toBe(item.value);
		});

		expect(v.two).toBe(two);
		expect(v.two.$parent).toBe(v);
		expect(v.children.two.value).toBe(v.two);
		expect(v.children.two.$parent).toBe(v.children.items);
		expect(v.children.items.length).toBe(2);
		expect(v.two()).toBe("two");

		var v2 = v.copy({ __id: "v2" });

		expect(v2.__id).toBe("v2");
		// // console.log('v2');
		// console.dir(v2);
		// console.log(v2.render()[0].outerHTML);
		expect(v2).not.toBe(v);
		expect(v2.children.$parent).toBe(v2);
		expect(v2.children.items).not.toBe(v.children.items);
		expect(v2.children.items.length).toBe(v.children.items.length);
		expect(v2.two).not.toBe(v.two);
		expect(v2.two.$parent).toBe(v2);
		expect(v2.children).not.toBe(v.children);
		// expect(v2.children.two.value).toBe(v2.two);
		// // console.dir(v2);
		expect(v2.two.children.items[0].value).toBe("two");
		expect(v2.children.two).not.toBe(v.children.two);
		expect(v2.children.two.$parent).toBe(v2.children.items);
		expect(v2.children.two.value).toBe(v2.two);

		v2.children.each(function(child, name, index){
			// console.dir(child);
			if(child.__id === "two"){
				expect(child).toBe(v2.two);
				expect(child).not.toBe(v.two);
			}

			// anonymous views won't have a parent
			if (child.$parent)
				expect(child.$parent).toBe(v2);
		});

		v2.children.eachItem(function(item, index){
			expect(item.$parent).toBe(v2.children.items);
			if (item._name)
				expect(v2[item._name]).toBe(item.value);
		});
	});

	it("children should have a remove method", function(){
		var v = view({
			children: {
				one: view("one"),
				two: view("two")
			}
		});

		v.render().appendTo('body');
	});

	xit("can be rendered in several different ways", function(){
		// var v = view(view("one"), view("two"), view("three"));
		var v = view({
			addClass: "x y z",
			one: view("one", { addClass: "one" }),
			two: view("two"),
			three: view("three"),
			init: function(){
				this.children(this.one, this.two, this.three);
			}
		});

		v.render().appendTo('body');
	});

	xit("can be copied", function(){
		var v = view({

		});
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
		// v.reset could be v.classes.clear(), v.attr.clear(), and v.children.clear();
		// or, we could use
		v.children.reset(/* ... */); // to be more explicit



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
			preview: view({ classes: "preview" }),
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

		// then we can't do
		view("child1", "child2");
		// which would only be useful if you were logging a variable or something...
		view("Label: ", myVar); // myVar could be a str, num, or anything...
		// if myVar happened to be a str, then we'd get wonky results (Label: would be a class)

		// two+ args, first is classes?
		view("classes", { prop: 1 }, view(), "child");


		// can view.classes.remove() return the view?  sure why not
		title("My Title").classes("add").classes.remove("one")
	});

	xit("should allow override of .set to use .reset", function(){
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