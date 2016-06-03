# Cookbook

This page is for describing some of the less-obvious features of the library,
and how they can be used to solve an array of use-cases.

## Source specifiers / converters

[This description needs to be updated. When I first wrote it, it seemed like
such a novel, crazy idea. Now, it's fundamental: source specifications.]

These are analogous to the config format plugins of configly.

The actual configs could be the result of arbitrary computations. So,
why not define a config-definition format, that tells this library
how to find/compute the configs? You could define all your config
variables in a JSON file, along with descriptions, default values,
data types, etc. There could be steps defined that can read this, and
know how to use it to retrieve settings from files of various formats,
environment variables, and command-line arguments.

We should have plugins for lots of file formats, as well as:

* URL query-string params, or POST params
* environment variables
* browser cookies
* ini files
* xml



## When are two views the same?

It all boils down to this, I think. Let `E` be shorthand for 1C1.extend1:

```
// Let's say we have these:
cfg0A = E({});
cfg0B = E({});

// Two views constructed from source data are *always* different views, because
// there is no way for us to know or control whether or not the source mutated
E({}) != E({});

// However, any two views that comprise an identical chain of (sub)views, no matter
// what order they were composed in, are the same:

cfg0 = E({});
E(cfg0) == E(cfg0);

// Combine them in any order, it makes no difference:

cfg1 = E({cfg: 1});
cfg2 = E({cfg: 2});
cfg3 = E({cfg: 3});

E(cfg1, cfg2, cfg3) == E(E(cfg1, cfg2), cfg3)
                    == E(cfg1, E(cfg2, cfg3))
                    == E(E(cfg1), E(cfg2), E(cfg3))
                    == ...

-> This means we have a requirement to generate a uid for a view, in such a
way that they combine deterministically.
Could we use symbols for these?



## Integrating options overides with class inheritance

See the tree-chart demo hierarchy for a good example.

This is the right way to do it, I think. A good pattern for coding a class, that
allows for it to be inherited from, is:


```
const C1 = require('config-one');

// Define the default settings for this class
const defaults = {
  color: 'blue',
  verbose: false,
  ...
};

class Super {

  // The `opts` argument should be first on the constructor of every class
  // that uses config-one.
  constructor(opts) {

    // Extend the options. Here we're putting them in a "private" variable, and
    // defining a getter.
    this._options = C1.extend(defaults, opts);

    ...
  }

  // Users can get any instance's settings with `instance.options`.
  get options() {
    return this._options;
  }

  // Make the class defaults accessible through the instances, for convenience
  get defaults() {
    return defaults;
  }

};

// Make defaults into a class property
Super.defaults = defaults;
```


A class that inherits from the above would look like this:

```
// This class' default settings are an extension of the super's defaults. 
// Declare the extension while the module is
// being evaluated -- then you're guaranteed it will be used when any instances 
// are created.

const defaults = C1.extend(Super.defaults, { 
  verbose: true,
};

class Derived extends Super {

  // Every class that uses config-one should have the `opts` argument first.
  constructor(opts) {

    // We must not call the `super` constructor until we are sure that all of 
    // the overrides are in place. (Note that you can't use `this` before
    // invoking the super constructor -- hence the intermediate variabe).
    const _options = C1.extend(defaults, opts);
    super(_options);
    this._options = _options;

    ...
  }

  // The rest is the same

  get options() { return this._options; }
  get defaults() { return defaults; }
}

Derived.defaults = defaults;
```

## Retrieving settings at runtime

Here's an added twist: suppose you have a setting that resolves at runtime,
and itself creates a tree of settings? This is actually a common use case;
for example, UI widgets that provide the ability to override settings in a
@data attribute on the target element.

So let's say `Shazzam` allows settings to be specified in this manner. For
example:

```
<div class='shazzam' data-shazzam='{"color":"green"}' />
```

This is handled easily by config-one, through the use of a "settings gatherer".

[How about "harvester" as the name for this?]

[I think this takes the place of my "instantiator", describes elsewhere. On 
the other hand, maybe not. That seems more general -- any time you want to
have aggregated objects, rather than inherited.]

A settings gatherer is almost exactly the same as a recipe, but there is one
crucial difference: a gatherer is unpredicable -- it might return a different 
result each time. This is usually because it goes to an outside source to
get the settings. That outside source, or the larger context in general, can
be thought of as a parameter to the function, such that every time the function
is called, the context parameter might be different.


The `Shazzam` class would be:

```
const defaults = { 
  'color', 'blue',
  optionsSelector: '.shazzam',
};

class Shazzam {
  constructor(opts) {

    // Here is where to apply the gatherer, since it operates per-instance:
    this._options = C1.extend(defaults, DataAttributeJsonGatherer, opts);

    ...
  }

  get options() { return this._options; }
  get defaults() { return defaults; }
};

Shazzam.defaults = defaults;
```

But how does it work, really?

The `DataAttributeJsonGatherer` object is defined something like the following.
It is a function that returns a two element array. The first element is a 
recipe, that is resolved to get the settings. The second is just an empty
object that "poisons the view". When config-one
sees this, it can no longer consider the master view to be 
immutable, and it must resolve the entire view in context. Which
is exactly what we want.

The whole object is marked with a Symbol, that tells config-one to evaluate it
and to substitute its return value into the position it occupies -- just as it
does for recipes.

Hah! C1, when called `C1()` is, itself, just a gatherer, isn't it?




```
// Source of all gatherers:
const defaults = {};
const gatherer = function() {
  ...
};
gatherer.new = function(opts) {
  // clone self with overriden options
}

// ... till we get to something like

const defaults = {
  ...
};
const DataAttributeJsonGatherer = function() {
  return [
    C1(X=> {
      const optsSel = X.optionsSelector;
      const elem = document.querySelector(optsSel);
      const attrName = 
      return JSON.parse()
    }),
    {}
  ]
};

// Mark it indelibly with an ES6 symbol.

DataAttributeJsonGatherer[Symbol(config-one)] = {'type': 'gatherer'};


```





## Profiles

* Publishing an app, for example, with multiple settings profiles, that can be
  selected as an option. So, you can either specify options a-la-carte, or you
  can bring in a profile, or you can even do both: bring in a profile and then
  override some things.
    * Profiles are defined using the instantiator to copy/graft the "a-la-carte"
      section, and then override things.

## Extending with views

Views can nest in one of two ways: 

1. Heirarchically - in the tree hierarchy, views typically have child views.
2. In the extension chain

The second method of nesting is less obvious. And, in a sense, it's not really
"nesting", because the chain is always flattened. 

But, it's very powerful that you can include views in the lists of overrides
when you are extending a configuration.


## Restore-default feature

It should be possible to implement a way to retrieve the default value of some
config anywhere in the tree? That is, could a recipe access the view chain?

That way, for example, a recipe could say, "this setting is the default
value with '-test' appended".

Conceivably, there could be methods to step through it, or go all the way back
to the "default default". Or maybe even "the first view where some given node was
defined" -- that would be better, because, for example, prepending an empty
config, with no default values anywhere, should be a transparent operation.


## Publishing module extensions

New packages could be published on npmjs, or whereever, that are just very
thin wrappers around base modules. They needn't do anything more than declare
a dependency on a base module, and override some settings.
