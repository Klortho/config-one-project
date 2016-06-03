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




