# Implementation

FIXME: Content below the horizontal rule below -- see if anything is useful

## Design


Everything in this library is immutable.

A *config* is a tree of data, as supplied to us by the user.
It comprises a hierarchical tree of *cnodes*, that come, for example,
from a JSON or JavaScript file. Each *cnode* can be of type *atom*, 
*object*, or *recipe*.

An *atom* is considered indivisible by this 
library: its properties, if it has any, can't be overridden.

[We need to nail down the considerations regarding what
should be *atoms*, and what objects can safely be *configs*. 
One issue is that, inside *recipes*, object properties are 
proxied by wrapper objects (the *vnodes*),
using getter methods. So, they won't behave exactly the same way,
in all circumstances, as the original *config*.]

*Recipes* are *cnodes* that are special functions. When the *config*
is accessed to get the value at this *cnode*, rather than returning
the *recipe*, it is executed, and the result is returned instead.
*Recipes* must only ever return an *atom* or an *object*. 

*Configs* don't know anything about defaults or overrides. 
*configs* are only accessed in the context of a *view*, which stores
that information.

*Configs* are wrapped into *views*. *Views* provide access to the
resolved data values. Internally, a *view* is a list  
of *configs*. When the *view* is queried for a value, the chain is 
searched in the order from
highest precedence (latest overrides) to lowest (defaults).

When used to retrieve the configuration data, a *view* appears as 
a static tree, with no *recipes*. This virtual tree is the final,
fully resolved configuration data that client applications use.
The nodes of the tree are *atoms* and *vnodes*.

*Recipes* are all lazily evaluated by the *vnodes*. The argument passed
to a *recipe* is the *view* (at the root of the hierarchy). 

Each *view* memoizes the results of calling the *recipes*.


## Implementation notes

* ES2015's proxy objects would be ideal for this, but not widely supported 
  yet. 



## Limitations

* To-do item: we need to be 100% clear on what kinds of objects can be *proxied*,
  and what kinds can be *deep copied*, and what the relationship is. 
    * In the user documentation, don't make a distinction -- just specify what 
      kinds of objects are safe to use.
    * Provide a quick test method that a user could use to check his/her object
    * Nail down what is by default an *atom*.
    * Should we allow users to declare a predicate that determines that 
      their objects are *atoms*? What if they do that, but their object is still
      not safe to *deep copy*? That might be very confusing.

* Inside a recipe, the objects corresponding to the config
  nodes are not the nodes themselves, they are resolvers that proxy
  the members of the config node. So, they don't behave 100% the same.
  You can't mutate one, for example. This is illegal:
  `λ(c => c.x++)`

* The resolvers only proxy "own enumerable properties", so you can't
  access methods of a class, for example. But note that if an object
  has a function as its *own* property, then you can call it through
  a resolver, no problem.  


## Prior work

### node-config

As mentioned in the README, this is a great library.

When I first encountered it, I had just finished the first
release of [settings-resolver]() (see below), and discovered that node-config
had the same feature. Amazingly, the author of that feature, [Mark
Stosberg](https://github.com/markstos), used almost identical terminology as
mine, including the terms "deferred", "resolve", and "resolver".

I later changed to use "recipe", "view", and "freeze". I did this, mostly, to
avoid confusion with JavaScript promises (or futures), since "defer" and
"resolve" are often used in those libraries.

I submitted [this pull
request](https://github.com/lorenwest/node-config/pull/318) (from
[this branch](https://github.com/Klortho/node-config/blob/resolver/defer.js)),
largely based on the algorithm described by Mark in [this
comment](https://github.com/lorenwest/node-config/issues/266#issuecomment-207520735),
under "Proposed design: lazy resolution using getters".

### xmltools

(Not released publicly yet.)

This has a cool feature whereby you can instantiate new "toolboxes" from existing
ones, while overriding config values, in a cascade, recursively:

```
var toolbox = require('xmltools');  // encapsulates a set of defaults
...
// Now, create a new toolbox, overriding a setting. From an API point of view,
// this is indistinguishable from the first:
var myToolbox = xmltools({haltOnError: false});
// Ad-infinitum
var hisToolbox = myToolbox({verbose: true});
```

`config-one` makes this trivial, and even better: because the logic encoded in
the *recipes* functions is preserved.

### settings-resolver

[settings-resolver](https://github.com/Klortho/settings-resolver) is a Python
library, implemented originally to help with Django settings.

### ChainTreeMap

[ChainTreeMap.py](https://github.com/Klortho/chain-tree-map/blob/master/ChainTreeMap.py) -
an implementation of the *view* class, in Python. It is an enhancement of this
[Chainmap](http://code.activestate.com/recipes/305268/) class, which is a
view of a Python dictionary (and where I learned the term). ChainTreeMap
enhances it to work on *hierarchical* dictionaries.

### grunt-template-functions

[grunt-template-functions](https://github.com/Klortho/grunt-template-functions) -
a very early attempt at this, to reimplement Grunt's string templates as
first-class JS functions. Never finished -- if I were to revisit it, it would be
to implement it as a skin on top of config-one.

----

## Other notes -- need culling



`ConfigOne` - the main *class*. When you `require` this module, you get
and instance of this.

Each instance is:

- A function that creates new Views 
- An object with properties (either own, or through prototype) providing 
  access to all of the functions and utilities of this library.
- Highly configurable, using this library itself to manage options.
  When you override options, you get a new ConfigOne instance.

Just about everything in the module is exposed through `C1`, but things 
that are prefixed with an underscore are not part of the official API, 
and are subject to change.

Some rationale:

- The simplest use-cases should be the default behavior. That means 
  passing in config objects and getting back views
- But we also want it to be easy to override *this* module's default 
  options. Since there's no way to distinguish a generic config object
  from something intended as overrides to this module's options, we 
  need a method for the latter case.




// The purpose of a View object is to proxy the cnodes, so that they
// can participate in expressions inside recipe functions.
// This constructor itself does not recurse (everything is lazily
// evaluated). It only defines the getters for the immediate children,
// and then returns.


***The following is out-of-date. It's from my write-up of how the similar
algorithm works in node-config. Maybe there is some text here I can reuse.***


In order to enable other config values to be used inside the bodies of
recipes, proxy objects called *views* are used to represent those
config objects during those evaluations.

For example, suppose you have config files with:

```javascript
// default.js:
var config = {
  siteTitle : 'Site title',
  header :  defer(cfg => 'Welcome to ' + cfg.siteTitle),
};

// local.js:
var config = {
  fadOfTheWeek = 'Big Data',
  siteTitle : defer(cfg => cfg.fadOfTheWeek + ' Experts!'),
};
```

During resolution, the deferred function for `header` is executed. If the
value of the `cfg` argument inside that function were the actual config
object, then that could cause problems, because the value for `siteTitle` also
comes from a deferred. If the `header` function is evaluated first, then the
value would be garbled -- it would include the default string representation
of the DeferredConfig instance.

Instead, the value of the `cfg` argument inside the deferred function body is
not the actual config object, but an instance of the Resolver class. It has
getter functions for each of the properties of the real config object. In the
example above, when the `header` deferred is executed, the expression `cfg.
siteTitle` is evaluated, which causes that getter function to be executed.
That function is smart enough to recognize that the value of `siteTitle` comes
from a deferred function; so it executes it, and returns the correct result.

This approach is very powerful, and enables complex interdependencies among
config variables, without ever having to worry about the time-ordering of the
evaluations. Of course, circular references are not allowed.
So, for example, this wouldn't work:

```javascript
name: defer(cfg => ({
  first: 'Robert',
  nickname: cfg.name.first == 'Robert' ? 'Bob' : 'Bruce',
})),
```

At first glance, it might seem that this isn't circular, since `nickname` is
referencing a sibling, not itself. However, when evaluating `nickname`, the
reference to `cfg.name` must be evaluated first, and it's inside it's own
deferred function, which makes it circular. This could be fixed easily,
however, using a nested deferred:

```javascript
name: defer(cfg => ({
  first: 'Robert',
  nickname: defer(cfg => cfg.name.first == 'Robert' ? 'Bob' : 'Bruce'),
})),
```

To avoid making this mistake, you could adopt the convention that any "leaf"
value that depends on other config information should be wrapped in its own
deferred function.


## Algorithm

During resolution, the software maintains two trees of data:

1. config tree, which is the original config data, that includes atoms,
  objects, and deferreds (no resolvers)
2. resolver tree, which proxies the config tree, and has nodes *only* of type
  atom and resolver (no objects or deferreds). The resolver tree nodes are
  constructed dynamically by the getters, but the tree can be thought of as
  static.

These routines are involved during the resolution process:

***resolve(config)***

The main entry point. This function resolves the entire config tree,
evaluating and replacing all deferreds.

It creates a new Resolver object (the "main resolver") from `config` (which is
the "main" config, or the root of the config tree) and delegates to its
`resolve()` method. Note that this "main resolver" is the object that gets
passed in as the `cfg` argument of the deferred functions.

***resolver.resolve()***

This resolves the config subtree corresponding to this resolver. It is a very
simple recursive process: it iterates over its child nodes, which must be
either atoms or resolvers:

* If atom, it is inserted into the config object.
* If resolver:
    * Recurse: call its `resolve()` method
    * Insert this child resolver's config node into our config object

***resolver getters***

These invoke `.newNode()` to construct new nodes in the resolver tree, and
store the results (each node is only created once).

***resolver.newNode()***

The argument to this is a node from either the config tree or the resolver
tree (in other words, it can be of any type). If it's an atom or resolver,
this merely passes it along. If it is a deferred, this executes the deferred
recursively, until the return value is something else. If it is an object,
then a new Resolver object is created to wrap it, and that is returned.


