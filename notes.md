* Switch to these conventions *everywhere*:
    - `C1` from the get-go, not `config1` or anything else
    - `X1' instead of `C1.extend`
    - what to use as the dummy variable for a recipe?
    - `options` and `defaults` for property names; `opts` for argument.


* To fix: use [object method 
  shorthand](https://github.com/airbnb/javascript#es6-object-shorthand)
    * Also property value shorthand.

* Question: how will this work (will it at all) with computed property names?
  Can they be recipes?  E.g.

    ```
    const obj = {
      id: 5,
      [C1(X=> X.current)]: true,
    };
   ```

   Maybe they could be flagged with a symbol somehow, but I doubt it.


* In config-one: ppConsole et. al. should auto-convert source objects into
  views (that it, they should auto- `extend` )


## tree-charts for the demo.

Left to do:

* Transition
* Trigger transition with click
* Layer them


* Can we somehow animate the steps when making the view?


## Make sure to show / talk about

* The configuration in tree-chart/main:
    - Note the method of inheritance




* FP musings: diff. between assignment and declaration can be subtle:
    * This is a declaration: `const myvar = 5;` (ES6 new rules for
      block scoped `let` and `const` tighten this up)
    * This is unambiguously an assignment: `obj.v = 5`

* In D3, lots of settings are *functor*, that can take either a value
  or a function that returns a value.

* Partitioning the app into reusable parts and app-specific parts
  becomes a lot easier. For example, the tree chart: I put all the bits having
  to do with the config-one demo (recipes, object keys, etc) into an override.

* Talk about the functional aspects of XSLT: what's nice, what it lacks
  (functions as 1st class objects).. XSLT 1, for example, it's always very 
  hard to do pipelines.



## config-one itself

* Unicode fun. Trying to reduce the syntactic noise.
    * `ℂ(Ɔ=> ...)`
    * `ℂ` - U+2102 DOUBLE-STRUCK CAPITAL C - my favorite
        - Because it's reminiscent of "config 1"
    * `Ɔ` - U+0186 LATIN CAPITAL LETTER OPEN O
        - Because this acts like a mirror of the configuration, plus it's 
          pleasantly symmetrical
    * Others I looked at -- look at test-unicode.js


## FP examples

* Stuff from defaults.js


## Misc / to be sorted

* The fact that this is "meta-programming". ES6 proxy objects will make it much
  easier.
  
* I have a bunch of ideas on my phone
* "Parameterize all the things" -- https://memegenerator.net/instance/55390138

* How important syntax is -- I knew that I had to get the syntax as simple and
  clean as possible, to ever have a hope of it being accepted. And sure enough,
  Eric W's first impression was very negative, no doubt in large part because of
  the ugly ***lambda***!
    * JS beats python here
    * Syntax is important, and should be -- because it reduces the cognitive
      burden when you're reading and trying to understand a program

* Creating new apps by simply overriding the settings of an existing one.
    * Ties in to "resolvers are everywhere" (next)
    * It would be really nice to be able to demo doing this with "tree" with
      the push of a button -- get a tree with a different color scheme.
    * Use sinopia, and write a super-simple js script like this:

        ```
        overrideAndPublish('svg-flextree-green', 'svg-flextree', 
          { fill: 'green' });
        ```

* resolvers
    * Everywhere you look:
        * all the variables in you program
        * `require`, `import`, `include`
        * npm, bower, pip, cpan
        * XML catalog resolvers, Apache redirect rules, LBOS, DNS
    * What if the resolver itself were a setting?

* Make sure you stress that order doesn't matter at all: programs are just 
  bags of declarations. You can put them in whatever order makes them easiest
  to grok (consider literate programming)

* Question to self: is it true that all of the big nasty debugging problems
  I've had with this are related to order of operations?


## Some notes on The Two Pillars of JavaScript

Pure functions

- idempotent
- no side-effects
- stronger guarantee of encapsulation
- "a self-documenting public interface (the function signature)"
- "independence from outside code, the ability to move code around freely between files, modules, projects, and so on"

This I don't agree with:

> Obviously, most programs need to produce output, so complex programs 
> usually can’t be composed using only pure functions, but wherever it’s 
> practical, it’s a good idea to make your functions pure.

I would say, they don't "produce output", rather, they "emit data streams".
Something/someone had to run the programs, and they are the agents that can
be thought of as saving the state.

***generics*** - functions that work on a range of diff. datatypes.

Collections are more generic than you probably realize, and map can act any
kind of container obj.

*duck typing*



## References

* Reference: [The Two Pillars of JavaScript — Pt 2: Functional 
  Programming](https://medium.com/javascript-scene/the-two-pillars-of-javascript-pt-2-functional-programming-a63aa53a41a4#.7d3zqx3kp) - 
  some notes below.
* [FantasyLand specification](https://github.com/fantasyland/fantasy-land)
* "Hey, underscore"
* Read/watch [Reactive programming 
  tutorial](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754)
* Ramda
* lodash - was this by the "hey underscore" guy?


# To do

* Maybe even this: combine config-one with tree-chart, and do everything in a
  very literate-programming style. The distros of both could be kept small.
  For the purposes of publishing on npm, we'd want to have separate package.json
  files, that could be in separate subdirectories.
    - The "demo" could be the slide-show! It already has a lot of features like
      stepping. Publish that separately too.
* Eliminate redundancy among the demo-boxes and demo-words.js. Either with C1
  or JS inheritance, or both.
* More stuff into settings -- parameterize all the things!
* New tree type for modeling JS objects.

## Nice-to-have:

* Add other renderers; for example, a simple HTML/CSS renderer that uses boxes
  and absolute positions. (Straight-line diagonals could even be drawn with
  one border of a div that's rotated).

----

# To do

## For initial alpha release

* Build a browser version
* Integrate with tree-chart and make a demo page


## First beta release

## Package and test as a *library*

* Get it working (for runtime, not dev) in earlier versions of node. 
    * How to get travis to test runtime-only in those environments?
    * Using Sinopia for testing, build and publish using node 6
    * Install and `require` into node 6 and node 4 test projects

* Integrate webpack for the browser version into an integrated build.

* Finish the documentation. Go through:
    * Content below the fold, below
    * [implementation.md](implementation.md)
    * [future.md](future.md)

* Finish implementing these sources for config:
    * envPrefix
    * envJson

* Get it working robustly with arrays and functions.
    * See the GitHub issue
    * See get-all-property-names.js for some experiments
    * Verify you fix the problem in test-examples/readme3

* Add some of the write-up of "motivation", in
  [settings-resolver](https://github.com/Klortho/settings-resolver), to
  the README.


## Improve presentation / demo

* Document with literate programming technique. The "implementation section
  is huge, and the comments in the code are extensive, and there's a lot of 
  overlap. I think a literate programming library could turn it into a really
  nice document.

* Get "cookieman" working, then demo overriding settings at runtime, live.


## Implementation improvements

* Instead of my current mix-in strategy for the new C1 objects, use an ES6 
  class with a Symbol.species of `Function` (see 
  [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Species))

* Also use a Symbol to identify recipe instances. Read this [intro to 
  species](http://blog.keithcirkel.co.uk/metaprogramming-in-es6-symbols/)


----

Integrate all this content into the README, after going through it.


Caveats:

* Don't expect to change the config files, and then be able to reload them
  using the same C1 object. If you ever want to reload files that have been
  loaded before, use `C1.new()`.


Add to "future":

* Any override can reach in and access any layer of the chain. You could make
  alias top-level keys for this purpose, like, `C.__layer[5]...`. The
  current layer number could be `C.__currentLayer`.
* Inside recipes, be able to access config info through relative references.


## How tos / use cases

* This could be used to implement a universal configuration handler for an
  application. Build configuration and runtime configuration could be managed
  the same way. For example, request time info like cookies or query-string
  parameters could be used to override selected configuration data to aid in
  debugging.

* *Recipes* could be leveraged to provide validation and/or normalization of
  data values. See this [feature
  request](https://github.com/lorenwest/node-config/issues/319) against
  node-config, for example.

### Recursive option-setting API

A very useful pattern for a software library is to provide a way for users to override
settings values. To maximize the potential for reuse, and handy software pattern is
to return an object to the user that behaves just like the original object (same API)
but with modified options.

Extending that idea to its logical conclusion, the returned object should itself
expose the same interface for allowing options to be overridden. To any user of
*that* object, the overridden settings look like the defaults.


### Frozen configs

A *frozen config* is a *config* that has had
all of its *recipes* evaluated (think of cooking all the dishes, packing them
in tupperware, and putting them in the freezer).

There are no artifacts of this library left
in the tree. All objects remaining in the tree are plain JavaScript (note that
that's not the same as "plain old JSON" -- they can include any kind of
JavaScript object, class, function, etc., *except* the ones from this
library.)

This would have to be a deep copy of the original, since we depend on
the immutability of the original *objects*.



