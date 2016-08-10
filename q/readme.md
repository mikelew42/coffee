Does a simple q need coll item wrappers around each cb?

The item could be used as a cb wrapper, that provides unique info, such as a .remove() fn, ctx value, etc.?

It is nice to be able to do q.name.remove();

You can't do q.name = newCb; unless you do some fancy getter/setter business.

