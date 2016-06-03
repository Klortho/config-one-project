var slideshow = remark.create({
  sourceUrl: 'slides.md'
});

function getCurrentSlide() {
  const i = slideshow.getCurrentSlideIndex();
  return slideshow.getSlides()[i];
}

function getChart(slide) {
  var slideName = slide.properties.name || null;
  if (!slideName) return null;
  return document.querySelector('#slide-agenda .chart') || null;
}


// Create and draw the chart (after a short delay to accommodate transition 
// animations)
function drawChart(slideName) {
  window.setTimeout(function() {
    const treeChart = new TreeChart({select: `#slide-${slideName} .chart`});
    treeChart.draw(chartData[slideName]);
  }, 1000);
}

// Event listeners

// When a new slide is shown, draw the chart if there is one
slideshow.on('showSlide', function(slide) {
  const chart = getChart(slide);
  if (chart) {
    const slideName = slide.properties.name;
    drawChart(slideName);
  }
});

// Also when the document loads (don't get a `showSlide` event)
document.onreadystatechange = function () {
  if (document.readyState == 'complete') {
    drawChart(getCurrentSlide().properties.name);
  }
};


/* Here are all the events that slideshow emits
var events = [ 'showSlide', 'hideSlide', 'beforeShowSlide', 'afterShowSlide', 
  'beforeHideSlide', 'afterHideSlide', 'toggledPresenter'];
events.forEach(function(evt) {
  slideshow.on(evt, function (slide) {
    console.log(evt + ' event!');
    return;
  });
});
*/

/*
slideshow.on('hideSlide', function (slide) {
  const chart = getChart(slide);
  if (!chart) return;
  console.log('removing svg');
  var svgs = chart.getElementsByTagName('svg');
  if (!svgs || !svgs.length) return;
  chart.removeChild(svgs[0]);
});
*/

const chartData = {
  'agenda': {
    text: 'defaults',
    children: [
      { text: 'cdnUrl',
        children: [
          { text: 'https://cdnjs.org/',
            class: 'string', }
        ]},
      { text: 'cache',
        children: [
          { text: 'local/cache/',
            class: 'string',  }
        ]},
    ]
  },
  'slide2': {
    text: 'defaults',
    children: [
      { text: 'cdnUrl',
        children: [
          { text: 'https://cdnjs.org/',
            class: 'string', }
        ]},
      { text: 'cache',
        children: [
          { text: 'local/cache/',
            class: 'string',  }
        ]},
    ]
  },
};
