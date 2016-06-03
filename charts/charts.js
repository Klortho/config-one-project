const chart = new TreeChart({select: '#chart'});


// This function takes an array of functions to do each time the user clicks
const doNext = function(tasks) {
  let nextTaskNum = 1;  // start with task 1
  window.onclick = function() {
    if (nextTaskNum < tasks.length) {
      tasks[nextTaskNum++]();
    }
  };
};

const nodeType = config1.private.nodeType;

// makeTree is called on objects only
const makeTree = function(name, node) {
  var treeNode = {
    text: name,
  };

  const t = nodeType(node);

  treeNode.children = Object.keys(node).map(function(key) {
    var child = node[key];
    var t = nodeType(child);
    if (t === 'atom' || t === 'recipe') {
      return {
        text: key,
        'class': 'stringkey',
        children: [
          ( t === 'atom' 
            ? { text: child.toString(),
                'class': 'string' }
            : { text: 'λ',
                'class': 'recipe' }
          )
        ],
      };
    }
    else {
      return makeTree(key, child);
    }
  });

  return treeNode;
};


const chartMakers = [
  null,

  ////////////////////////////////////////////////////////////////////////////
  // chart1
  function() {

    // JS_BASE = 'https://cdn.com/'
    // JS_VER = '2.4.1'
    // JS_URL = d(lambda: s.JS_BASE + s.JS_VER + '/jslib.js')

    const chartData = {
      text: 'settings',
      children: [
        { text: 'JS_BASE: ',
          class: 'stringkey',
          children: [
            { text: 'https://cdn.com/',
              class: 'string', }
          ]},
        { text: 'JS_VER: ',
          class: 'stringkey',
          children: [
            { text: '2.4.1',
              class: 'string',  }
          ]},
        { text: 'JS_URL: ',
          class: 'stringkey',
          children: [
            { text: "λ(JS_BASE, JS_VER)",
              class: 'recipe',  }
          ]},
      ]
    };
    chart.draw(chartData);

    doNext([ null,  // start with task 1

      // task 1
      function() {
        chartData.children[2].children[0] = {
          text: 'https://cdn.com/2.4.1/jslib.js',
          class: 'string',
        };
        chart.draw(chartData);
      },

    ]);
  },

  ////////////////////////////////////////////////////////////////////////////
  // chart2
  function() {

    src = {
      JS_BASE: 'https://cdn.com/',
      JS_VER: '2.4.1',
      JS_URL: ℂ(Ɔ=> Ɔ.JS_BASE + Ɔ.JS_VER + '/jslib.js'),
      splits: {
        fleegle: 1,
        bingo: 2,
        drooper: 3,
        snorky: 4,
      }
    };

    var tree = makeTree('settings', src);
    chart.draw(tree);

    doNext([ null,  // start with task 1

      // task 1
      function() {
        var cfg = ℂ.extend(src, {
          JS_VER: '2.5.3'
        });
        var settings = ℂ.freeze(cfg);
        console.log('settings: ', settings);
        var tree = makeTree('settings', settings);

        //var next = nextTree(tree, 'settings', settings);


        chart.draw(tree);
      },
      
    ]);
  },


  ////////////////////////////////////////////////////////////////////////////
  // chart3
  function() {


    const chartData = {
    };
    chart.draw(chartData);

    doNext([ null,  // start with task 1

      // task 1
      function() {
        //..
        chart.draw(chartData);
      },
      
    ]);
  },



];
