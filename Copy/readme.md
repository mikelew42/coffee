> TL;DR One drawback is that properties are duplicated (as opposed to prototypes, where they are shared in memory), but this isn't really a problem.  Functions can't easily be copied, so we just reassign them, and the new reference is negligible.  Objects get deep copied by default, but we usually want this behavior anyway.  I suppose if you had a lot of long string properties on your class definitions, then yes, we are duplicating them in memory.  But how often do you store long strings on your class definitions?  ES6 doesn't even allow properties of any kind (only functions/"methods") on its class definitions.

A few important caveats about the copy algorithm:
- It skips any property that starts with "$", such as "$parent" (you'll see this in the codes)
- The object oriented version of copy (appearing on a module as `mod.copy`) calls newCopy.set() and newCopy.init(), whereas the standalone version does not
- Both the standalone and object oriented version check if a module has its own `.copy` method, and uses that, if present.
- The copy algorithm checks if `this[child].$parent === this`, in which case its a direct child, and should be copied.  The new copy should 
- If the child property has a different `$parent`, then it has already been adopted, and we don't want to copy it.  Sometimes we might want to reassign the reference, sometimes not (because we'll pass in a new, dynamic reference to replace it).  I haven't figured that part out yet ;)
