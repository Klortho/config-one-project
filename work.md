
# Demo files cleanup

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


* Tests:
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