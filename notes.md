Live the dream: let's make the tree-chart app 100% configuration:

- But first: the tree display showing how the algorithm works: code in
  https://github.com/Klortho/config-one/blob/master/src/seed.js 
- Can the demo chart size be dynamic?
- Start at the very beginning: config-one/seed.js.
- generalize/standardize the mechanism for including/overriding. This can be
  used for anything that resolves to a config object.
- config1 already does this with its defaults: it specifies a number of
  resolvers/loaders, and then bootstraps.
- get rid of ramda dependency everywhere
- By default, it should treat all function-types as atomic. Use instantiators
  to attach options to functions/classes ("I'll have mine on the side").

Work on demo:

* I want visibility into what it is doing. Some kind of repl that's lighter than
  the console, and tailored to this app, and can open in its own little popper





# Material to be dispatched



## Other


More points to add:

* [Open-closed principle](https://en.wikipedia.org/wiki/Open/closed_principle): "software entities (classes, modules, functions, etc.) should be open for extension, but closed for modification";

* Reference: [Lenses and Virtual DOM Support Open 
  Closed](http://joneshf.github.io/programming/2015/12/19/Lenses-and-Virtual-DOM-Support-Open-Closed.html)


# The tree-chart example

* Runtime, per-node override of default node settings. See node.js.

* atomTest, to create an extension of config1 that knows that tinycolor
  objects are atomic.



* Using ES6 Symbols:
    * Symbol('tree-chart-demo') - to bind DOM elements back to the chart
    * src/seed.js:const c1symbol = Symbol('config-one'); - to flag
      certain objects as being atomic.

* Definitely mention serializing CSS






Crazy thoughts:

* Can overrides be settings?  That is, I want to publish my app with a layered
  definition of settings: defaults for the base library, and other 'profiles'.
  Well, shouldn't they be configurable? I think that's basically implying
  nested views: recipes that that build layered views.

--------------------

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


* Describe the syntactic noise problem.



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

