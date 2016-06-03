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
