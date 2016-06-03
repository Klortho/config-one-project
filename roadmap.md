# Roadmap

* Presentation: work on this as you go. Don't let it get so far behind.
* First priority right now is to get a working tree display 
  showing how the algorithm works. It should animate, illuminate
  the code in
  https://github.com/Klortho/config-one/blob/master/src/seed.js 
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

## Fancy use-cases

***Profiles***

* Publishing an app, for example, with multiple settings profiles, that can be
  selected as an option. So, you can either specify options a-la-carte, or you
  can bring in a profile, or you can even do both: bring in a profile and then
  override some things.
    * Profiles are defined using the instantiator to copy/graft the "a-la-carte"
      section, and then override things.





## tree-chart to do

* Demo:

    - A little status console would be nice. It should list keyboard shortcuts
    - Make the demo chart size dynamic - the svg should grow as the chart
      does. But: don't make it as complicated as dtd-diagram was


## Follow-on work

After the core of this is done, need to refactor the following
projects to use it.

* d3-flextree
* dtd-diagram

