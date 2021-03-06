# To do - config-one

## Tree-chart refactoring

* See the [roadmap](roadmap.js).


## Build configuration

Reference: http://stackoverflow.com/questions/32385219/mocha-tests-dont-run-with-webpack-and-mocha-loader

Some general principles:

* Try not to mix product files into the same directories as sources. So test
  reports and the like go into `build`.
* Except for the demos, I guess it's better *not* to have an index.html in a
  directory, because then you can't see it's contents.




* Get rid of C1_TARGET, or maybe replace it with "HOST_ENVIRONMENT", or
  something like that.








* Reorganize the directory structure, mixing the webpack-test stuff in:

    ```
    /
      package.json
      webpack.config.js
      ...
      src/
      dist/  - just for final distribution packages
      test/
        ✓run.sh - just runs the mocha tests without bundling - this is currently
            test.sh. It is what is invoked by the `npm test` scripts.
        ✓index.html  - driver for the mocha tests in the browser, the main JS
            this invokes are ../build-{src|dest}/test-bundle.js.
        webpack.test.config.js
        check-spec.js  - and any other utility modules

        unit/         - sources for the unit tests
            main.js   - currently this is test/index.js
            ...test.js
            subdir/ ...
        smoke/
            index.html
            smoke.js
        build/      - test bundles
            test-bundle-src.js
            test-bundle-dist.js
        reports/
            src/    - separate destination for each unit-under-test
            dist/

* Add links to all the test/demo pages from the top-level project page
* For the web-page drivers of the mocha tests, add a scriptlet that gives
  some indication if there's a bad or missing file, or js exception.

* Coverage

* Test results page enhancements:
    * Get some environment metadata up there
    * Also git SHA, date, etc.

* Make sure you have both dev and prod builds: sourcemaps, minified, etc.

* Live reload
    * Is that what "hot" is all about?

* Change the name of examples -> node-examples, because they do not work in 
  the browser.

* What about test reports / records for tests that run on the server?

* Clean up / harmonize script names in package.json

* What about babel? I had this in package.json:
  `"babel src --presets babel-preset-es2015 --out-dir dist",`, but now
  I don't think I'm even using it through webpack.


## Fix loading of JS files with dist/config1.js

I need to fix it so that the webpack-generated dist in dist/config1.js can 
dynamically load JS files. I think `require` is the way to go, but I'm having 
trouble getting webpack to ignore the dynamic require call inside defaults.js,
in "fetch".

I think maybe the IgnorePlugin will work, and I tried it with some naive attempts,
but I need to try it again.

In the meantime, test-read is disabled for the dist.



## Tool to run all the different test envs





## Performance analysis

* Size of the minified dist? How big is Ramda?

* How does it peform related to normal objects, for, say animations?


## Add logging


## Other

* Nail down conventions, and implement them everywhere.
    * No more overloading of methods
    * Long form and abbreviated form of most things
    * `const` on every line. No more comma-continuation lines.
    * `const` instead of `var`

* Code improvements:
    * Use ES6 features when possible
    * Symbols: maybe define just one symbol, and attach it to different things,
      with different values.
    * Recipes with relative resolvers

* Enhancements:
    * Harvester/instantiator


## Rework config-one recipes a bit

I have to change the definition of the parameter that gets passed to recipes.
It has to be relative, because options have to be composable, meaning these 
should be identical:

```
const a = {
  a0: 1,
  a1: C1(X=> X.a0),
};

const b = {
  b0: 1,
  b1: C1(X=> X.b0),
};


const aView = C1.extend(a);
const bView = C1.extend(b);

// Compose a new view corresponding to a aggregated with b as a sub-object
// (no problem).
const aggView0 = C1.extend(aView, {b: bView});

// What about these?

const aggView1 = C1.extend(aView, {b: b});

const aggView2 = C1.extend( R.merge(a, {b: b}) );





# To do - tree-chart

## Demo files cleanup

The class hierarchy needs to be blended harmoniously with the settings overrides.
While I'm doing this, I'm taking notes in the cookbook.

* Make Demo.js and DemoBoxes.js jibe with the cookbook example

* Use inheritance
* Clean up the options settings
* Implement the convention:
    * obj.defaults
    * obj.options

* Hierarchy
    * index.html
        * demo.js 
            - Defines `Demo` global
            - has .defaults member
            - Subclasses:
                * demo-boxes 
                * demo-words
                * demo-jsobj

## Tests

- Make sure overrides work with this precedence order:
    - Any TreeChart library defaults
    - Demo.defaults
    - Demo-subclass.defaults
    - index.html
- Other places we should be able to add overrides:
    - @data attribute on the element
- And don't forget sublayers:
    - Main renderer
        - d3svg.js
        - d3svg-subclass.js
    - Node renderer
        - d3svg-node
        - d3svg-subclass

* Start with just boxes.
* Start to add methods to demo
* Just one master list of demos.


## Build process

Reimplement what we have for config-one.




