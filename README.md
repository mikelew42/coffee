The name was inspired by my beverage when I was making this.  The last version was PBR.

The best way to make sense of this is to check the tests, although they're probably a little confusing.

Here's some explanation that might help:

### Creating my own module system

I'm not pleased with JavaScript's prototyping, or ES6's classes.  Frankly, classical OO programming doesn't cut it.  You end up having to override more than you want to, and then have to copy+paste to maintain functionality.  Which isn't manageable.

Also, mixins are always a problem.

Also, sub modules (composition) is a problem, because you have to initialize the sub modules.

```javascript
parent.init = function(){
  this.child = new Child();
}
```

When you try to break your functionality down into many tiny pieces (lets call it hyper encapsulation), and a very basic module might have 10 child modules, each of which has 10 child modules... You quickly have a sticky mess of initialization functions.

When you want to extend a class to make a small change, you have to override the init function.

Sure, you can encapsulate each piece of init:

```javascript
parent.init = function(){
  this.initChildOne();
  this.initChildTwo();
  this.initChildThree();
};
```

so that when you extend the class, you can override only the piece you want:

```javascript
extended.initChildTwo = function(){
  this.childTwo = new ModifiedChildTwo();
};
```

This looks nice when you only have 1 line functions.  When you have 10+ lines, and you want to change one of them, you're forced to either override the entire thing, and copy+paste, then make your simple change.  Or, you have to modify the base class, in order to add an override point.  In the example above, we had a clean override point, but if you're using someone elses code, you might not.

## What's my solution?

Use an auto-q function for init.  It's kind of like an event.

```javascript
mod = Mod({
  init: function(){
    console.log(1);
  }
});

mod2 = mod.copy({
  init: function(){
    console.log(2);
  }
});
```

Immediately, mod2 calls its init fn when it is copied.  But, instead of *overriding* init, as you might think, it adds it to the q (an array of fns, like an event).  So, we see in the console:

```
1
2
```

But what if we *want* to override?  Give it a name:

```javascript
mod = Mod({
  init: {
    myInitializer: function(){
      console.log(1);
    }
  }
});

mod2 = mod.copy({
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

Above, init is a super function.  It allows sub functions.  It gets a little tricky, and isn't fully working right now, so I'll stop here.  It gets **really** confusing because you have to worry about function context.  If you look at the super function code, you'll see how crazy it gets.

I'm in a constant battle to create the right API (syntax), keeping it simple, yet also accomplishing what I feel is necessary.
