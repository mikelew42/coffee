var Base = function Base(o){
	if (!(this instanceof Base))
		return new Base(o);
	this.assign(o).init();
};

Base.prototype.init = function(){};

Base.prototype.assign = function(o){
	return Object.assign(this, o);
};

module.exports = Base;