var q = require("../q");
var mod = require("../mod");
var sfn = require("../sfn");
var coll = require("../coll");


/*
Maybe Property should extend from a value object, that has the underlying
.value, change events, etc.

In order for the Property to work with the module, we could just install it,
without maintaining a reference to the Property object

NO REFERENCE
this["$" + name] REFERENCE
props[name] REFERENCE

Can the Property be a sfn?
If it's referenced as a private var, it won't be copied.
If its parented to the props mod/obj, it won't be copied


*/

// var Property = sfn({
// 	factory: true,
// 	getter: function(){},
// 	setter: function(){},
// 	init: function(){
// 		if (this.$parent)

// 	}
// });

// How is this installed?

// mod({
// 	myProp: Property() // ??
// });

// mod({
// 	init: function(){
// 		Property({
// 			$parent: this, // the mod
// 			_name: "whatever",
// 			value: 123
// 		});
// 	}
// });

/*
There we go, now I don't have to manually add line returns.

Ok - so, the problem is
MAINTAIN CONSISTENCY THROUGH A COPY
If the Property isn't stored and reinstalled, we need to rerun the Property creation/installation (for example, the init fn).
*/



// no, we need to observe it, or install it...?
// the set system could intercept Property objects, and
// automatically install them

// but, I might want to just automatically upgrade all normal props,
// so the GUI can hook in easily to monitor/display the objects

// how can we manually install props at this point?

// the prop method isn't a bad way to go...

// mod({
// 	prop: require("./prop") // the install method to call mod.prop('w/e');
// });


/*
Is this OK?  If Properties is a coll, it will have API functions...
Maybe props should be an empty POJO
*/
// var Properties = coll();