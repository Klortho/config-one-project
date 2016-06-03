# Future enhancments

These are things that would be nice to have, and hopefully will get implemented. Pull
requests always welcome!

## Settings definitions

The actual configs could be the result of arbitrary computations. So,
why not define a config-definition format, that tells this library
how to find/compute the configs? You could define all your config
variables in a JSON file, along with descriptions, default values,
data types, etc. There could be steps defined that can read this, and
know how to use it to retrieve settings from files of various formats,
environment variables, and command-line arguments.

## Profiles

It would be pretty easy, I think, to write some pre-defined options (as
config-one objects, obviously) that encode how to get this library to mimic
the default behavior of other libraries out there.

What would make it easy is that the options to this library that produce the
default list of configs to process are *functions*. So, for example, you could
pass in a function that reads a JSON file at a URL, parses URLs inside *that*,
fetches them, and uses those as the configs.

For example, there could be a `node-config` profile, a `configly` profile, etc.
We couldn't expect that it would be 100% compatible, but such profiles could,
potentially, ease the ability of other users to adopt this one.

In fact, as I'm thinking about this, there's no reason such a profile couldn't
be published on npm as a very thin wrapper around `config-one`. It would just
declare `config-one` as a dependency, override the default options, and export
that new object.

## Submodule configuration.

You *should* be able to (needs to be tested) use this in a Node.js application
to configure submodules, in a way that *just works*. They could be
implemented with hierarchical configs, or nested views (see above).
Then, submodules wouldn't have to try to do anything to integrate with the
larger environment. They just provide a local view into any config sources
they know about, and the app plugs that view into its config chain, wherever
it wants. Right now, there are lots of problems with this feature
in node-config -- see the issues.

### Nested views

This is not the same as child *views* underneath other *views* in the main
*view* hierarchy. Rather, this is about using *views* within the
lists of *configs* that that are used to look up values

### Config format plugins

See, for example, configly.

Should have plugins for lots of file formats, as well as:

* URL query-string params, or POST params
* environment variables
* browser cookies
* ini files
* xml

And, of course, there's no reason that more primitive mechanisms like template
strings couldn't be implemented with *recipes*.

### Relative views

It should be possible to pass a "relative view" into a *recipe*.
This would be a *view* that
represents the *current* node. You could subscript it with '..' to go
up (meaning it would have to have a getter for that string). You could
use this feature to create aliases for any config node.

### Restore-default feature

Would it be possible to implement a way to retrieve the default value of some
config anywhere in the tree? That is, could a recipe access the view chain?

That way, for example, a recipe could say, "this setting is the default
value with '-test' appended".

Conceivably, there could be methods to step through it, or go all the way back
to the "default default". Or maybe even "the first view where some given node was
defined" -- that would be better, because, for example, prepending an empty
config, with no default values anywhere, should be a transparent operation.
