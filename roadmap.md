# Roadmap

* Presentation: work on this as you go. Don't let it get so far behind.

* For now, I'm keeping all the documentation for this here, including
  implementation details that used to be in config-one, for example.
  Maybe dispatch them later if that makes sense to do

* First priority right now is to get a working tree display 
  showing how the algorithm works. It should animate, illuminate
  the code in
  https://github.com/Klortho/config-one/blob/master/src/seed.js 

* Implement template strings within *recipes*, and tout this up. Even though
  it's pretty trivial, I think it'll be a big selling point.

* **Ramda:** I have a love/hate relationship here, but I think I should keep it
  for now.

* See how close we can get to making config-one and tree-chart
  apps 100% configuration and 0% "hard-coded".

* Implement an "instantiator"
    * This is a standardization of the mechanism for 
      including and overriding another class. In effect, it lets you
      create an instance of an object, with options overrides.
    * Can also be used for copy/grafting other sections of a config
      tree -- something which I've already found I do a lot.
    * The first bits of code to use with this is the config-one
      source specifiers, used to bootstrap the config-one options.

    * This will make it more palatable to treat all "function" types as atomic
      by default. Options for those can be specified on the side.


* Relative views.
  It should be possible to pass a "relative view" into a *recipe*.
  This would be a *view* that represents the *current* node. 
    * The `recipe` could look at the first argument it gets, and if it's a 
      string, it could interpret that as a path

        ```
        { a: R('..', X=> X.b ),
          b: R('C.a.b', X=> X.c )}
        ```

    * In fact, views should be completely detachable at any level.
    * They can still be considered immutable, though -- because once they are 
      evaluated within a context, the resultant values never change.




## tree-chart to do

* Demo:

    - A little status console would be nice. It should list keyboard shortcuts
    - Make the demo chart size dynamic - the svg should grow as the chart
      does. But: don't make it as complicated as dtd-diagram was


## npm submodule configuration.

You *should* be able to use this in a Node.js application
to configure submodules, in a way that *just works*. 
Then, submodules wouldn't have to try to do anything to integrate with the
larger environment. They just provide a local view into any config sources
they know about, and the app plugs that view into its config chain, wherever
it wants. Right now, there are lots of problems with this feature
in node-config -- see the issues.


## Follow-on work

After the core of this is done, need to refactor the following
projects to use it.

* d3-flextree
* dtd-diagram

