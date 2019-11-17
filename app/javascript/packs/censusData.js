var colors = require('./colors.js');

let width = $("#container").width();

$(document).ready(function() {
  var svg = appendSvg();

  var path = d3.geoPath();

  buildMap(svg, path)
    .then(function(data){
      // build the tooltip
      var svg = data["svg"],
          states = data["states"];
      
      var tooltip = createTooltip(svg);

      // display the tooltip on clicking a state
      states
        .on("click", function(d) {
          var data = {
            "get": "EST,LANLABEL,NAME",
            "for": "state:" + d.id,
            "LAN39": ""
          }

          // tooltip expands, shows text, shows select
          tooltipEntrance(tooltip);  
      
          callCensusData("/data", opts(data));

          var xPosition = d3.mouse(this)[0]*$("#container").width()/970 - 5;
          var yPosition = d3.mouse(this)[1]*$("#container").width()/970 - 5;
          tooltip.style("display", null)
          tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
          tooltip.select("text").text(d.properties.name);
        });
    })
    .catch(function(error) {
      console.error(error);
    });
  

  d3.select(window).on('resize', resize);
});

function tooltipEntrance(tooltip) {
  tooltip.select("rect")
    .attr("width", 0)
    .attr("height", 0)

  tooltip.select("text")
    .style("display", "none")

  tooltip.select("select")
    .style("display", "none")

  var s = d3.transition()
    .delay(0)
    .duration(500);

  tooltip.select("rect")
    .transition(s)
    .attr("width", 200)
    .attr("height", 200)

  var s2 = d3.transition()
    .delay(300)
    .duration(0);

  tooltip.select("text")
    .transition(s2)
    .style("display", null)

  tooltip.select("select")
    .transition(s2)
    .style("display", null)
}

// create a select with options
function createTooltip(svg){
  var tooltip = svg.append("g")
    .attr("class", "tooltip")
    .style("display", "none");
        
  // TASK 2: build rect display for the tool tip  
  tooltip.append("rect")
    .attr("width", 0)
    .attr("height", 0)
    .attr("fill", "lightgrey")
    .style("opacity", 1);

  // TASK 2: configure the text for the tooltip
  tooltip.append("text")
    .attr("x", 10)
    .attr("dy", "1.2em")
    .style("text-align", "center")
    .attr("font-size", "12px")
    .attr("font-weight", "bold")

    // <foreignObject x="20" y="20" width="160" height="160">
  tooltip.append("foreignObject")
    .attr("x", 20)
    .attr("y", 20)
    .attr("width", 160)
    .attr("height", 160)


  tooltip.select("foreignObject")
    .append("xhtml:div")
    .attr("id","lan")

  tooltip.select("#lan")
    .append("xhtml:select")

  tooltip.select("select")
    .selectAll("option")
    .data([1,2,3])
    .enter()
    .append("xhtml:option")
    .text(function(d){
      return d;
    })
    .attr("value", function(d){
      return d;
    })
    .attr("class", "year");

  // start with a selected value
  // d3.select("option[value='" + 1 + "']")
  //   .attr("selected", true);

  return tooltip;
}

function buildMap(svg, path, resize) {
  return new Promise(function(resolve, reject) {
    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json", function(error, us) {
      if (error) {
        reject(error);
      } else {

        var s = transition(0, 0);

        var states = buildStates(svg, path, us);          

        var borders = buildBorders(svg, path, us);

        $("svg").height($("#container").width()*0.618);

        resolve({svg: svg, states: states})
      }
    });
  });
}

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
  var accent = d3.scaleOrdinal()
    .range(colors)
    .domain([...Array(50).keys()]);
  
  return svg.append("g")
      .attr("class", "states")
      
    .selectAll("path")
    .data(topojson.feature(us, us.objects.states).features)
    .enter().append("path")
      .attr("fill", function(d) { 
        return accent(d.id);
      })
      .attr("d", path)
      .attr("transform", "scale(" + $("#container").width()/970 + ")");
}

function buildBorders(svg, path, us) {
  return svg.append("path")
    .attr("class", "state-borders")
    .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })))
    .attr("transform", "scale(" + $("#container").width()/970 + ")");
}

async function callCensusData(url, opts, params={}) {
  const response = await fetch(url, opts);
  const myJson = await response.json();
  // console.log(response);
  console.log(JSON.stringify(myJson));
}

function opts(data={}) {
  return {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': window._token
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  };
}

function resize(){
  d3.selectAll("path").attr("transform", "scale(" + $("#container").width()/970 + ")");  
  $("svg").height($("#container").width()*0.618);
}