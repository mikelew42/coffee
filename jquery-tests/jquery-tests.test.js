require("./jquery-tests");
var $ = require("jquery");

$(function(){
	var $test = $("<div>test</div>").appendTo("body");
	
	$test.extend({
		poop: function(){
			return this.css('color', 'brown');
		}
	}).view({
		hello: "hello",
		world: {
			one: 1,
			two: "two"
		}
	}).poop().hello.css('color', 'blue');

	for (var i in $test){
		// console.log(i);
		$test.hasOwnProperty(i) && console.log(i);
	}
});