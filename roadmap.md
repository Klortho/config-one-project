# Roadmap

* Presentation: work on this as you go. Don't let it get so far behind.


* First priority right now is to get a working tree display 
  showing how the algorithm works. It should animate, illuminate
  the code in
  https://github.com/Klortho/config-one/blob/master/src/seed.js 

* Implement template strings within *recipes*, and tout this up. Even though
  it's pretty trivial, I think it'll be a big selling point.

* **Ramda:** I have a love/hate relationship here, but I think I should keep it
  for now.

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


## Implement a new class: Instantiator

* This is a standardization of the mechanism for 
  including and overriding another class. 
* In effect, it lets you
  create an instance of an object, with options overrides defined "on the side"
* Can also be used for copy/grafting other sections of a config
  tree -- something which I've already found I do a lot.
* The first bits of code to use with this is the config-one
  source specifiers, used to bootstrap the config-one options.

* This will make it more palatable to treat all "function" types as atomic
  by default. Options for those can be specified on the side.


An instantiator is either an instance of a class, or else a class reference 
plus a set of options specific to that class, that can be used to instantiate
a new instance.

So, and instantiator can be passed around as a C1 option. But, it is not the
same as a recipe. When these are encountered in a view, they are
immediately evaluated and the replaced with the results of calling that
constructor.


```
<instance>
```

or 

```
{ C1.construct: {   // C1.construct is an ES6 symbol
    'class': <class object>,
    'options': <options> }
  }
```



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


# New architecture

## Musings

- I need to think some more about the similarities between config-one and the
  default data model of tree-chart. Much more than a coincidence. They need to
  inform each other.

- The views I've been describing are almost perfectly modelled by config1
  views.
- A crucial design feature is that they are not tied to root. IOW, they are
  detachable at any point.
- That means no links to `parent`. Instead, they emit events, and the parent(s)
  subscribe.
- config1 views are not like that -- or, are they? When the view hits a recipe,
  it recursively resolves stuff, but nothing says it has to start at the root,
  does it? There isn't even any good reason to require that the view inside
  the resolver is part of the same config1 object.

- And that's another thing! in config-one, the original data shouldn't, in general,
  be accessible at all.


## config-one API changes

I'm pretty happy with the API, but I think a few tweaks are in order.

"read-only" means that the property never changes its value, even when C1 is
extended.

- `const C1 = require('config-one')` - read-only - the configuration manager. 

- `const appConfig = C1()` - This is evaluated in a context (environment) to provide an 
  immutable config view. This sheilds us from problems related to environment
  variables or current-working-directory changes.

  IOW, keep in mind that `C1` is not a pure function. It might resolve to 
  different things depending on the environment.

  Remove the feature that C1(<func>) is a shortcut for recipe.

- `C1.recipe`

- `C1.options` - The options of `C1` control how the `C1()` function behaves.
  So, they specify how to figure out what environment it is in, and
  how to read default configuration data based on that environment.
 
Among the options, in `options.source`, is an *instantiator* for a Source. It
describes how to construct a source from files, environment variables, etc.
It is heirarchical, and could produce a (flat) list of Sources (for example,
from a path glob).

- `const C2 = C1.new(_opts)` - Create a new clone, with new options. When
  you do this:
    - C2.options <- C1.extend(C1.options, _opts);

- `C1.seed` - read-only - the *base* configuration manager, without any options.
  C1 itself is an extension of this: `C1 = C1.seed.new(C1.defaults)`

- `C1.defaults` - read-only

- `C1.extend(...configs)` - create a new view over the supplied config source
  objects. Note that any of the objects can be an instantiator, or could include
  instantiators! Does this solve the vexing problem of conflating app options with
  C1 options?



## Tree-chart refactoring

This is major, but I want to keep everything working while doing it. I'm going
to mark new code with these fences:

```
//--------------------------------------- phase 2 code
//--------------------------------------- end phase 2 code
```

Conventions:

- All the methods defined here use / return cnodes, not nodes



## Class hierarchy

* TreeChart: a set of options, and a mutable list of Views. 

* View: has a reference to a root cnode, and a table of layout information
  for every cnode in this view. A View is really just a two-element array:
    [root, layout]

* CNode - wrapper for user-supplied nodes.

* Renderer - completely separate; listens for change events from the TreeChart

* NodeSelector

* ChangeAction - a data representation of one of the tree change methods

* Diff - used by renders, esp. to animate changes



## NodeSelector

A NodeSelector picks out a cnode from among the self-or-descendants of a cnode.
Usually, that would be the root cnode, and thus it would pick out a cnode from
the current view, but there is nothing special about that object.

If no match is found, then it returns null. So, these can be used as
`find` methods.

Most of the tree changing methods take a NodeSelector.

It can be any of:

- cnode - if this cnode is not in this subtree, `null` is returned. Otherwise
  this cnode itself is echoed back.
- node
- nodeId
- guid


## TreeChart

Has no info about renderer or knowledge about the original data structure

In many ways, the TreeChart object acts as a "master root"; i.e. as the parent
of all of the root cnodes. It differs, though, because:

* It is mutable. It maintains the list of views, which changes
* It does more.

TreeChart does the layout in response to the current root cnode's change
events. Note that only the current root cnode is allowed to change.

***Note that that doesn't mean the renderer can't step back and forth. Whichever
view the renderer is on is independent of the current state of the TreeChart.***

*** There *is* a difference between a view and a root cnode. *** The view has
the layout info. The TreeChart instance is actually a mutable list of view
objects.


### Constructor

Options:

* function getId(node) - tell the chart how to get the id value of a node.
  Defaults to: {
      (id in node) ? node.id : { generate uid, attach it to node with a
        symbol, return it }
    } 
* function getChildren(node) - tell the chart how to get the child nodes of a
  node. Defaults to { 'children' in node ? node.children : [] }
* renderer instantiator - the tree-chart does nothing with this 
  except register its events with it. The renderer could also be 
  initialized separately, with event listeners. This is here so that 
  TreeChart subclasses can define default renderers.
  The DOM selector should be included in this instantiator


### Information methods

- get views() - retrieve the list of Views
- get currentView()
- get prevView()

Other convenience methods to look up nodes, get Diff's, etc.


### Tree control methods

These correspond to the change actions of cnodes, as applied to the virtual
"master root", but the main difference is that this "master root" doesn't
replace itself, I guess. Also, it does the layout when done.

- pushRoot(node) - Creates the first tree view, or, if there is an existing
  tree view, creates a new one using node to make the new root cnode.
  This must be called first, before any of the others.


## Node

Use this term exclusively for *source* objects. Rationale: this is the term 
that's exposed to users, so it should be intuitive.

- Each node has an id, which is generated by the user or attached to the 
  node objects. These are unique within one view of a tree, but not 
  globally unique. They are used to associate nodes in different tree
  views as being the same "logical node".
- Users are free to mutate these however they want. After we instantiate
  a cnode, we should not ever need this again.
- The only mutation we do is to adorn them, if necessary with an 
  ES6 symbol that contains metadata
- Any methods that we provide that work on cnodes, should also
  work transparently when given a node.

## CNode

For "chart-node" - these are objects we maintain. They are 
completely immutable: there is a different instance of these for every
node for every view of every tree.

### Methods about this instance

- guid - Globally unique id. Be careful to distinguish this from a node's 
  id (hence, always refer to this by `guid`.)
  Use RFC4122 uuids: https://github.com/broofa/node-uuid
- get nodeId()
- get sourceNode() - Purely a convenience method for users, we should not
  need it.

### Methods to get information about the current view:

- get subtree() - list of all cnodes in this subtree, starting with this
  one, in depth-first order
- get descendants() - same as subtree(), but without self.

> I used to have these here, but now I think this is bad. Any cnode shouldn't
> know about its context:
> 
> - get root() - reference to the root cnode (synonymous with tree view)
>   to which it belongs
> - get parent()
> - get ancestors() - list, starting with parent, up to root



### Methods to get info about other views

- get prev() the cnode with the same nodeId, under the prevRoot
- get instances() - list of all cnodes, across all views, with the same 
  nodeId. In order from the first view to the last.


### Tree changing methods

Each of these methods acts on a cnode, and creates a new cnode with the 
new data, and emits an event.

Parent nodes always listen for their children's change events, and call 
replaceChild, when there is a change. Thus, the event is propagated up the 
ancestor cnodes of the current view. When it gets to the top, the TreeChart
does the new layout.


***Note***

> So that means we *do* have to mutate the cnodes, in order to inject the
> layout info at the end. Alternatives:
>
> * Dig into the flextree code, and hook into its algorithm. Note that the 
>   algorithm is designed this way already, but still, it would be work.
> * Include a reference from the cnode to a layout resolver. But the main
>   reason for having cnodes in the first place is so we have a place to put
>   the layout info, so that seems silly. But, actually, I think this is
>   inevitable.


There are two forms of each of the following:

- The general form takes a node selector as the first argument, finds the
  target cnode in this subtree, and then delegates to that cnode's specific form
- The specific form performs the action on *this* cnode.

General form:

* appendChild(nodeSel:parent, node) - appends node as the new last child of parent.
* addChild(nodeSel:parent, nodeSel:prevSib-or-null, node) - this provides a 
  generic way of adding a child, either in a particular location, or first if
  the parent doesn't have any siblings.
* insertBefore(nodeSel:sib, node)
* insertAfter(nodeSel:sib, node)
* remove(nodeSel) - remove the node specified by the node selector

* replaceChild(nodeSel:parent, node) - this is a convenience method, called by 
  a parent on its child whenever the child changes. It is shorthand for
  `remove`, `addChild`.


Specific form:

* appendChild(node)
* insertBefore(node)
* insertAfter(node)
* remove()

Do a set of changes as an atomic change

* change(<change-list>) - the most general. A <change-list> comprises
  a list of individual changes, that are applied in order. E.g.:

    ```
    [ [ pushRoot, node1 ],
      [ appendChild, parentSel, node2 ],
      ...
    ]
    ```

## TreeDiff

* The difference object contains everything d3 (or any other library) needs
  to render and/or animate.
    * prevTree
    * thisTree
    * enter() - those nodes that are new
    * exit() - exiting nodes

* Methods for comparing two views (two trees) - these are used by the
  renderer, for animation, etc.
    * newNodes


# tree-chart implementation notes

# Implementation notes

## Class hierarchy

The original node/tree data: this doesn't even know that it is being rendered.
No wrappers, I don't think. We can use a Symbol to add metadata, if needed
(but for now just add it directly).

* `Node` - plain trees with rectangular boxes, but no text.
* `TextNode` - boxes for nodes, with text
* others will be needed for modeling config-one

Layout management and delegation. This is the "controller":

* `TreeChart` - handles layout management, but doesn't know how
  to draw; it delegates to a renderer. `TreeChart` takes the place of the old
  `LayoutEngine`

Renderers:

* `D3svg` - Gets events from TreeChart, manages the frame
* `D3svg_Node` - draws things specific to the Node
* `D3svg_Link` - the links between the boxes.
* `D3svg_TextNode`


## Data binding

* Every `Node` object has an __id.
* The master SVG `<g>` element for a Node has a matching @id attribute.
* Child elements of that `<g>` each also have a @data-id attribute with the
  same value
* links are identified by their *targets*, since every link has only one
  target.
* They have a <path> element (no containing <g>) with @id = 'link-#' and class 'link'


