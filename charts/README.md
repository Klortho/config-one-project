# config-one example

This page is for integrating tree-chart with config-one, for these reasons:

* Tree chart is the perfect vehicle for illustrating the config-one algorithm
* Tree chart is a refactoring of the code from dtd-diagram, and I think the
  techniques I'm exploring with config-one will go a long way to making the
  code better and easier to use
* This will provide a great test-bed and proof-of-concept for using config-one
  in a realistic project.


Here is the sample configuration:

```
defaults = {
  cdnUrl: 'https://cdnjs.org/',
  cache: 'local/cache/',
  // order of evaluation doesn't matter
  d3path: d(()=> 'd3/' + c.d3.ver + c.d3.filename),
  d3: {
    ver: '1.2',
    minified: true,
    filename: d(() => 'd3.' + (c.d3.minified ? 'min.' : '') + 'js'),
  }
}

apps = {
  app1: {
    libs: [
      jig: '...',
      d(()=> c.d3),
    ],
  },
}

template = {
  host
  cache: d(()=> c.host == 'iwebdev' ? 'project/cache/' : 'share/cache')
  app1: {
    libs: [
      d3: {
        minified: false,
      }
    ]
  }
}

prod = {
  host: 'ncbipc7867'
}
```


