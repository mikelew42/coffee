var is = require("../is");

/************
	COPY
*************/
var getBase = function(value){
	// return (value.Base && value.Base()) || 
	return (is.obj(value) && {}) || 
			(is.arr(value) && []);
};

var returnable = function(value){
	return !is.def(value) || is.val(value) || (is.fn(value) && !value.copy);
};

var copy = function(value, base, skip){
	if(value && value.copy && !skip)
		return value.copy();

	if (returnable(value))
		return value;
	
	base = base || getBase(value);

	for (var i in value){
		if (i[0] === "$")
			continue;
		
		/* Note, this only works for modules, that have a .set method */
		if (value[i] && 
			value[i].$parent){

			if (value[i].$parent === value){
				if (value[i].copy){
					base[i] = value[i].copy({
						$parent: base
					});
				} else {
					base[i] = copy.oo.call(value[i], {
						$parent: base
					})
				}

			// this is largely for coll+item implementation, so 
			// that coll.items array copies the item objects, even
			// though they're parented to the coll
			} else if (is.arr(value)) {
				base[i] = copy(value[i], null);
				continue;

			// this is important - many situations rely on 
			// the $parent !== its container obj/mod, to skip it
			} else {
				// maybe we reassign the reference?
				base[i] = value[i];
				// continue;
			}


		} else {
			base[i] = copy(value[i], null);
		}

	}

	return base;
};

module.exports = copy;