require("../jasmine");
var $ = require("jquery");
var Item = require("./Item");

describe("Item", function(){
	it("should render a default item", function(){
		var title = "Hello",
			item = Item(title);

		item.render().appendTo('body');

		var $query = $("div:contains('" + title + "')");
		expect($query[0]).toBe(item.$el[0]);
		$query.remove();
	});

	it("Title Only", function(){
		var title = "Hello",
			item = Item(title);

		item.render().appendTo('body');
	});
});