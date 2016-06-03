# Future enhancments

See also the [roadmap](roadmap.md) for more immediate to-do lists.


## config-one profiles

Add some options profiles to config-one itself that let it mimic
the default behavior of other libraries. In particular, node-config.

Most of this could be done by providing lists of source specifiers.

For example, there could be a `node-config` profile, a `configly` profile, etc.
We couldn't expect that it would be 100% compatible, but such profiles could,
potentially, ease the ability of other users to adopt this one.

These profiles could be published as stand-alone modules on npm, that are just
very thin wrappers around `config-one`. It would just
declare `config-one` as a dependency, override the default options, and export
that new object.


## Radical reimaginings

I'm toying with the idea of developing this in an entirely new way.

### show-one - a lightweight framework for demos

This would be the evolution of my demo pages, merged with the slideshow
presentation.

- Any give demo instance consists of:
    - Renderer
    - List of steps. Each step is just a config1 view layered on the last
- The show framework has controls for stepping back and forth among the steps.
- some utilities for converting various other types of data into shows 
  and steps.


### code-one - A lightweight framework for coding JS in a literate style

- Source documents are all CommonMark
- Uses markdown-it for conversion
- Different code blocks for:
    - primary JS source
    - tests
    - examples (i.e. plain-old documentation)
- Output converters for:
    - show-one format, for slide-show and for the demo page
    - JS source - would be further processed into the dists
    - JS test





