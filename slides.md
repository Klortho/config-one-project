# Presentation

These currently are more about functional programming in general, but there's
a little bit at the end about config-one.

Implementation:

* Uses Remark
* With [animate.css](https://github.com/daneden/animate.css). See that
  README for a huge long list of animation effects you can add.


## Material to add

* Describe the open-closed principle. References:
    - [Wikipedia](https://en.wikipedia.org/wiki/Open/closed_principle): 
      "software entities (classes, modules, functions, etc.) should be open for 
      extension, but closed for modification";
    - [Lenses and Virtual DOM Support Open 
      Closed](http://joneshf.github.io/programming/2015/12/19/Lenses-and-Virtual-DOM-Support-Open-Closed.html)

* Points to mention regarding the tree-chart demo:
    * Runtime, per-node override of default node settings. See node.js.
    * tinycolor objects used in the config for specifying colors
        * atomTest, to create an extension of config1 that knows that tinycolor
          objects are atomic.
    * The idea of putting CSS in the config, and dynamically adding it to the
      DOM (even though I decided not to go that route).

* Using ES6 Symbols:
    * Symbol('tree-chart-demo') - to bind DOM elements back to the chart
    * src/seed.js:const c1symbol = Symbol('config-one'); - to flag
      certain objects as being atomic.

