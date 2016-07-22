var is = require("../is");

/************
	COPY
*************/
var getBase = function(value){
	return (value.Base && value.Base()) || 
			(is.obj(value) && {}) || 
			(is.arr(value) && []);
};

var returnable = function(value){
	return !is.def(value) || is.val(value) || (is.fn(value) && !value.Base);
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
		base[i] = copy(value[i], null);
	}

	return base;
};

copy.oo = function(){
	return copy(this, null, true);
};

copy.to = function(base){
	return copy(this, base, true);
};

/* 

With this setup (separating copy and stdCopy), 
we can avoid the "skip" argument.

copy2(mod) will correctly use mod.copy()

mod.copy() will use stdCopy(this), which essentially
is the same thing as skipping the oo.copy check

*/
var copy2 = function(value, base){
	if (value && value.copy)
		return value.copy();
		// add a check for base, and forward to copyTo?
	return stdCopy(value, base);
};

// var getBase2 = function(value){
// 	// return (value.base && value.base.copy && value.base.copy()) ||
// 		return (is.obj(value) && {}) ||
// 		(is.arr(value) && []);
// };

var stdCopy = function(value, base){
	if (returnable(value))
		return value;

	base = base || getBase(value);

	return copyIterate(value, base);
};

var copyIterate = function(value, base){
	var log = false;
	log && console.groupCollapsed('copyIterate');

	var propsKeys = Object.keys(value.props || {});

	for (var i in value){
		log && console.log(i);
		if (i[0] === "$" || propsKeys.indexOf(i) > -1)
			continue;
		
		base[i] = copy2(value[i]);
	}

	if (base.props){ // copied from value onto base...
		for (var i in base.props){
			if (is.str(base.props[i])){
				switch(base.props[i]){
					case 'reassign':
						base[i] = value[i];
						break;
					case 'dnc':
						break;
					case "copy":
					default:
						base[i] = copy2(value[i]);
						break;
				}
			} else if (base.props[i].defineOnto){
				base.props[i].defineOnto(base);
				base.props[i].mod = base;		
			}
		}		
	}

	log && console.groupEnd();
	return base;
};

copy2.oo = function(){
	return stdCopy(this); // init? assign?
};

copy2.to = function(base){
	return stdCopy(this, base);
};




copy.copy2 = copy2;
module.exports = copy;