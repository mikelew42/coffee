### Installation

```
git clone https://github.com/mikelew42/coffee.git
cd coffee
npm install
npm run server
```

Then go to `http://localhost:8080/` and you should see a directory.  You can choose `all` to run all tests, or click into a folder to run the tests for that module.

### Overview

This repo consists of several very basic modules that attempt to replace the traditional methods of creating JavaScript applications (such as prototypes, ES6 classes, or functional paradigms):

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

### "Just copy it"

Think of everything as simple objects that can be copied.  

 | the old way | the new way
--- | --- | ---
Creating a class | `MyClass = function(){};` | `MyClass = Module.copy()` 
Creating an instance | `myModule = new MyClass()` | `myModule = MyClass.copy()`

For example, to make a `User` "class", just copy the base `Module`:

```
User = Module.copy({
  init: function(){
    this.greet();
  },
  greet: function(){
    console.log('Hello, ' + this.name);
  }
});
```

To make an "instance" of the `User` "class"?  Just copy it:

```
user = User.copy({
  name: "Michael"
}); // logs "Hello, Michael"
```

And to "extend" the `User` "class"?  Just copy it:

```
Admin = User.copy({
  permissions: Infinity
});
```

Instead of "objects", let's call them "modules".

### Sub modules

If we want to nest modules (known as `composition`), our copy algorithm makes it easy:

```
Car = Module({
  name: "Xterra",
  driver: Driver.copy({
    name: "Michael
  });
});
```

There are several things that need to happen:
- The sub module needs a reference to its parent.  We use the `$parent` property, so inside the `Driver.methods()`, we can use `this.$parent` to access the car.
- When copying the Driver, the `$parent` property should not be copied.

The driver access the car via `this.$parent`

What if we wanted to nest a few modules?

```
car = Car.copy({
  driver: Driver.copy({
    name: "Michael",
    car: car
  })
});
```

Oops, that won't work.  `Driver.copy()` is called first, and `car` is still `undefined`.  So we add

```
car.driver.car = car;
```

Which effectively does the same thing.  And now we can access the `car` from inside a `Driver.method()` using `this.car`:

```
Driver = Module.copy({
  drive: function(){
    this.car.accelerate();
  }
});
```

Likewise, inside the `car` we can access the driver using `this.driver`.  And that's good.  Until we try to copy something.

- We don't want to copy references.
- But, we don't want to reassign them either
- We need to copy these direct children
- But not just copy them, we need to relink the references

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

```javascript
mod1 = mod.copy({
  init: function(){
    console.log(1);
  }
});

mod2 = mod1.copy({
  init: function(){
    console.log(2);
  }
});
```

Immediately, mod2 calls its init fn when it is copied from mod1.  But, instead of *overriding* init, as you might think, it adds it to the q (an array of fns, like an event).  So, we see in the console:

```
1
2
```

But what if we *want* to override?  Give it a name:

```javascript
mod1 = mod.copy({
  init: {
    myInitializer: function(){
      console.log(1);
    }
  }
});

mod2 = mod1.copy({
  init: {
    myInitializer: function(){
      console.log(2);
    },
    newInitializer: function(){
      console.log(3);
    }
  }
});
```

Now, we'll see in the console:

```
2
3
```

We can now **add new functions without overriding anything**, but we can still override if we need to.

## Meet the SuperFunction (the `sfn` module)

Above, init is a super function.  It allows sub functions.  It gets **really** confusing because you have to worry about function context.  If you look at the super function code, you'll see how crazy it gets.

Also, it's worth noting that the init superfunction uses a q (the `q` module) for its event-like behavior.  The q is named `then`, and lives at `init.then`.  It's kind of like the Promise API (`myPromise.then(cb)`).  So, when you pass a function to init (there are several ways to do this, but most end up using `mod.set({ init: function(){} }`), it gets added to `mod.init.then`.

The `q` and `then` modules are based on the `coll`.  The `coll` is like an Underscore.js/lodash collection - combining the benefits of named items and ordered items (JS objects are named, but not ordered, and JS arrays are ordered, but not named).

I'm in a constant battle to create the right API (syntax), keeping it simple, yet also accomplishing what I feel is necessary.
