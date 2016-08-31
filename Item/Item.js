var View = require('../view');

var Item = View({
	__id: "Item",
	factory: true,
	classes: ['item'],
	children: "Item"
});

module.exports = Item;