
class: animated slideInRight
name: contents

# Topics

* Functional Programming - some general principles

* Configuration settings as immutable views

* config-one and tree-chart demo





---

Functional Programming - 
=========================================

## General principles

* Variables don't vary
* Pure functions are best:
    * No side effects
    * Always produce the same result
* Statelessness
* First-class functions


---

# Iterating: not functional

For example:

```javascript
var firstTwoLetters = [];
for (var i = 0; i < words.length; ++i) {
  var word = words[i];
  firstTwoLetters.push(word.substr(0, 2));
}
```


---

# How about this?

This is functional, right?

```javascript
var firstTwoLetters = function(words) {
  return _.map(words, function(word) {
    return _.first(word, 2);
  })
}
```

---

# How about this?


```javascript
// declare a function
var firstTwo = _.map(_.first(2));

// apply when ready 
firstTwo(words);
```

Declaring processing pipelines.


[Reference: [Hey Underscore, You're Doing it
 Wrong](https://www.youtube.com/watch?v=m3svKOdZijA)]

---

# Partial application and Currying


Canonical example:

```javascript
add(3, 4) == 7;

var add3 = add(3);   //=> function (partial application)
add3(4) == 7;
```

Many libraries support auto-currying, so you can
use any function this way.


---

Composition
-----------

Combining small functions into pipelines.

```javascript
R.compose(JSON.stringify.bind(JSON), pick('meta'))
```

---


Example using Ramda
--------------------

Problem: given a list of layers from a Mapbox GL Style 
Spec style, find groups of more than one layer that have a 
specific set of properties in common.

Solution:

```javascript
var refProps = ['type', 'source', 'source-layer',
  'minzoom', 'maxzoom', 'filter', 'layout'];

// takes a layer object, returns a stripped-down version
var pickRequired = R.pick(refProps);

// compose creates a function like JSON.stringify(pickRequired(layer))
var getRefHash = R.compose(JSON.stringify.bind(JSON), pickRequired);

var candidates = R.values(R.groupBy(getRefHash, layers))
  // this is like function(l) { return l.length > 1 }, except point-free
  .filter(R.compose(R.lt(1), R.length))
  // turn a list of objects into a list of their id properties
  .map(R.pluck('id'));
```

---

# Configuration settings as immutable views

---


## The problem

Django settings.py file. 

* We use [settings-overrider](https://github.com/klortho/settings-overrider),
* So, I'd like to parameterize some settings:


```python
JS_BASE = 'https://cdn.com/'
JS_VER = '2.4.1'
JS_URL = JS_BASE + JS_VER + '/jslib.js'
...
override(globals(), ...)
```

Try to override the version, in settings-local.yaml:

```python
JS_VER = '2.5.3'
```

---

## Doesn't work


Of course, it doesn't work: 

```python
print(JS_URL)    #=> 'https://cdn.com/2.4.1/jslib.js'
```

* Override too late
* What about doing the overrides first?
* No good.

---

## Possible solution


You could do overrides first for *selected settings*, and then:

```python
JS_VER = '2.5.3'  # override

_settings = globals()
_settings.setdefault('JS_BASE', 'https://cdn.com/')
_settings.setdefault('JS_VER', '2.4.1')
_settings.setdefault('JS_URL', JS_BASE + JS_VER + '/jslib.js')
```

* Srsly?
* Doesn't scale.

---


# Settings resolver

* [settings-resolver](https://github.com/klortho/settings-resolver)
* Ugly syntax!

```python
JS_BASE = 'https://cdn.com/'
JS_VER = '2.4.1'
JS_URL = d(lambda: s.JS_BASE + s.JS_VER + '/jslib.js')

...

resolve(globals(), ...)
```

* Overrides applied
* "deferreds" evaluated late
* `s` is resolver

---

## How it works

The resolver has default getters, so:

* values can be any type (not just strings)
* can appear anywhere in an expression

* Could not get the syntax any cleaner!

---

## Limitation: heirarchical data

So, on to 
[merged_tree](https://github.com/Klortho/settings-resolver/blob/master/settings_resolver/merged_tree.py)

* It's just a view! It doesn't mutate anything
* Values are retrieved late

* Requires immutability

---


## Limitation: no cross-references

* It doesn't do deferreds.

---

## Other examplse

All the solutions I've seen have limitations

* [Grunt template strings](http://gruntjs.com/api/grunt.template) - no JS
* Lots of other solutions like that


* See my [grunt-template-functions](https://github.com/Klortho/grunt-template-functions)


---


# config-one

* GitHub [klortho/config-one](https://github.com/klortho/config-one)
* npmjs.org [config-one](https://www.npmjs.com/package/config-one)


---

## How it works

* "Recipes" are all resolved late
* Data is accessed through views


---


## Possible use-cases

* Dependency injection
    * Just inject the functionality directly, *as functions*
    * Compare how it's done in Spring, for example

* Resolvers
    * Could even put resource resolvers in your settings
    * E.g. OASIS catalog files, 

* It's the basis for a plugin framework


---









