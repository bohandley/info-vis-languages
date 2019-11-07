$(document).ready(function() {

  async function callCensusData(url, opts, params={}) {
  	const response = await fetch(url, opts);
  	const myJson = await response.json();
  	console.log(response);
  	console.log(JSON.stringify(myJson));
  }

  let opts = {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': window._token
      },
      body: JSON.stringify({}) // body data type must match "Content-Type" header
  };

  callCensusData("/data", opts);

  var svg = appendSvg();

  var path = d3.geoPath();

  d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json", function(error, us) {
    if (error) throw error;

    var s = transition(100, 1000);

    states.transition(s)
      .attr("transform", "scale(" + $("#container").width()/970 + ")");

    states
      .on('mouseover', function(d, i) {
        console.log(d.properties.name)
        d3.select(this)
          .style('fill', 'steelblue');
      })
      .on('mouseleave', function() {
        d3.select(this)
          .style('fill', 'grey');
      })

    var borders = buildBorders(svg, path, us);

    borders.transition(s)
      .attr("transform", "scale(" + $("#container").width()/970 + ")");

    $("svg").height($("#container").width()*0.618);
  });
});

function appendSvg() {
  return d3.select("#container")
    .append("svg")
    .attr("width", "100%");
}

function transition(delay, length) {
  return d3.transition()
    .delay(delay)
    .duration(length);
}

function buildStates(svg, path, us) {
  return svg.append("g")
      .attr("class", "states")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.states).features)
    .enter().append("path")
      .attr("d", path)
      .attr("transform", "scale(0)")
      .style('fill', 'grey');
}

function buildBorders(svg, path, us) {
  return svg.append("path")
    .attr("class", "state-borders")
    .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })))
    .attr("transform", "scale(0)");
}