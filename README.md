# config-one project

This repo holds the master documentation for 
[config-one](https://github.com/klortho/config-one) and the demo app,
[tree-chart](https://github.com/klortho/tree-chart), that I'm building with it. 

### User documentation

For installation instructions and basic usage examples, see the README files:

* [config-one](https://github.com/klortho/config-one)
* [tree-chart](https://github.com/klortho/tree-chart)

Other pages

* In development: [slide show intro/tutorial](slides/) - not much here yet.
  See also these [notes on the slide](slides.md), including a to-do list.

* [Cookbook](cookbook.md). Practical how-tos. These features are either
  complete, or nearly so.

* [Future](future.md). Hypothetical, wacky ideas.


### Developer documentation

* [To do](). Stuff I'm working on currently

* [Roadmap](roadmap.md). High-level direction; broad, long term to-do items.

* [Implementation](implementation.md). Detailed technical notes.

* [More notes](notes.md). Miscellaneous notes that have yet to be organized


### Links to test / demo pages

If you're viewing this in a browser with config-one and tree-chart as 
subdirectories or soft-links from this project repo's root, then these links
should work:

* Test pages;

    * config-one/test/index.html - web-page driver for the mocha test suite

### Developing, building, and testing

Here's very abbreviated rundown of the tools that are implementd here.

Here are the various build steps available, in *roughly* the order that
they'd typically be performed.

```
# Install all the dependencies
npm install   #=> they are installed to node_modules/

# Run mocha tests against the *sources*
npm test      #=> report at ../test/reports/src/test-report.html

# Build the distribution bundle
webpack       #=> dist/config-one.js

# Run the same mocha tests against the newly built distribution bundle.
npm run test-dist   #=> http://localhost:9000/config-one/test/reports/src/test-report.html


```
