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

    var states = buildStates(svg, path, us);

    states.transition(s)
      .attr("transform", "scale(" + $("#container").width()/970 + ")");

          // TASK 2: start to build the tooltips  
  var tooltip = svg.append("g")
      .attr("class", "tooltip")
      .style("display", "none");
      
  // TASK 2: build rect display for the tool tip  
  tooltip.append("rect")
    .attr("width", 60)
    .attr("height", 20)
    .attr("fill", "white")
    .style("opacity", 1);

  // TASK 2: configure the text for the tooltip
  tooltip.append("text")
    .attr("x", 30)
    .attr("dy", "1.2em")
    .style("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("font-weight", "bold");

    states
      .on("click", function(d) {
        var xPosition = d3.mouse(this)[0];
        var yPosition = d3.mouse(this)[1];
        tooltip.style("display", null)
        tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        tooltip.select("text").text(d.properties.name);
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
      // .style('fill', 'grey');
}

function buildBorders(svg, path, us) {
  return svg.append("path")
    .attr("class", "state-borders")
    .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })))
    .attr("transform", "scale(0)");
}