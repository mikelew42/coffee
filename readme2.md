Please excuse the crude nature of this repo, I've been hesitant to publish it, and all of this documentation stuff is new to me.

### Installation

```
git clone https://github.com/mikelew42/coffee.git
cd coffee
npm install
npm run server
```

Then go to `http://localhost:8080/` and you should see a directory.  You can choose `all` to run all tests, or click into a folder to run the tests for that module.

>Please use the GitHub Issues tab for anything you want!! Ask me questions, give comments/critique.  This has been a work in progress for several years, and I'm just now trying to get this in a presentable form.  Help/feedback is duly appreciated!

### Overview

This repo consists of several very basic, core modules, that attempts to replace the traditional methods of creating JavaScript applications (such as prototypes, ES6 classes, or functional paradigms):

- `is` (a simple type checker)
- `copy` (instead of using `extend` and `new`, just create something and copy it)
- `ssfn` (simple super function - a bare bones version of the `sfn`, to avoid a circular dependency issue with `set`)
- `set` (an object oriented way to use/modify a module)
- `mod` (a base object that uses copy and set)
- `sfn` (the super function - a complicated beast that allows functions to call their sub functions, see below)
- `coll` (similar to Underscore or lodash, only in an object-oriented way)
- `q` (an object oriented "event" - basically just an array of functions/cbs)
- `then` (an implementation of the q, so any module can do `mod.then(cb)`)
- `init` (the long-awaited starting point for modules... this is complicated too)

Some introduction...

### Just copy it

Instead of using constructors with prototypes, and creating instances with `new`, we take a simpler approach:  just copy everything.  Create a module (think: plain old javascript object, even though it has a few base methods), and add properties:

```javascript
myMod = mod.copy({
  prop: 5,
  init: function(){},
  method: function(){}
});
```

myMod is a working "instance".  It runs `init` automatically each time its copied, as with `new Constructor()`.  It also takes the place of a prototype - anything you add the module gets copied.  If you want another instance, just copy it:

```javascript
mySecondMod = myMod.copy({
  prop: 6,
  newMethod: function(){}
});
```

If you want to extend the "class"... **just copy it**:

```javascript
MyClass = mod.copy({});
ExtendsMyClass = MyClass.copy({});
```

> TL;DR One drawback is that properties are duplicated (as opposed to prototypes, where they are shared in memory), but this isn't really a problem.  Functions can't easily be copied, so we just reassign them, and the new reference is negligible.  Objects get deep copied by default, but we usually want this behavior anyway.  I suppose if you had a lot of long string properties on your class definitions, then yes, we are duplicating them in memory.  But how often do you store long strings on your class definitions?  ES6 doesn't even allow properties of any kind (only functions/"methods") on its class definitions.

A few important caveats about the copy algorithm:
- It skips any property that starts with "$", such as "$parent" (you'll see this in the codes)
- The object oriented version of copy (appearing on a module as `mod.copy`) calls newCopy.set() and newCopy.init(), whereas the standalone version does not
- Both the standalone and object oriented version check if a module has its own `.copy` method, and uses that, if present.
- The copy algorithm checks if `this[child].$parent === this`, in which case its a direct child, and should be copied.  The new copy should 
- If the child property has a different `$parent`, then it has already been adopted, and we don't want to copy it.  Sometimes we might want to reassign the reference, sometimes not (because we'll pass in a new, dynamic reference to replace it).  I haven't figured that part out yet ;)


### Support for sub modules

With all other JavaScript approaches I've seen, there's very poor support for composition (nesting objects).  In order to do this, you need to create the child module instance inside the parent module's initialization, and pass a reference to the child, so the child can access the parent.

```javascript
parent.init = function(){
  this.child = new Child({ parent: this });
}
```

This is a major pain in the ass, as your application grows.  I'm often wanting to change one little thing, and have to override more than I want to.  I have two equally shitty options:

- Modify the base "class" to provide a better override point (by encapsulating the line(s) of code into a new function that can be overridden)
- Copy and paste the surrounding code, and just override the whole thing

### A solution:  the `qfn`

This module isn't on the list above, and hasn't been created yet.  It's beginnings are the `init` module.  Soon, the `init` module will copy the `qfn`.  The `init`/`qfn` is a hybrid between the `sfn` and `q`.  It's meant to automatically add new properties to its `.then()` q.
