const colors = require('./colors.js');

let width = $("#container").width();

let stateData = '';

$(document).ready(function() {
  let svg = appendSvg();

  let path = d3.geoPath();

  buildMap(svg, path)
    .then(function(data){
      // build the tooltip
      let svg = data["svg"],
          states = data["states"];
      
      let tooltip = createTooltip(svg);

      // display the tooltip on clicking a state
      states
        .on("click", function(d) {   
          stateData = d.id;       
          
          // tooltip expands, shows text, shows select
          tooltipEntrance(tooltip);

          getDataOnSelect();
          
          let xPosition = d3.mouse(this)[0]*$("#container").width()/970 - 5;
          let yPosition = d3.mouse(this)[1]*$("#container").width()/970 - 5;

          // debugger
          if(xPosition > $("#container").width() - 260)
            xPosition -= 260;

          if(yPosition > $("#container").height() - 260)
            yPosition -= 260;

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
    .attr("width", 290)
    .attr("height", 0)

  tooltip.select("text")
    .style("display", "none")

  tooltip.select("select")
    .style("display", "none")

  let s = d3.transition()
    .delay(0)
    .duration(300);

  tooltip.select("rect")
    .transition(s)
    .attr("height", 290)

  let s2 = d3.transition()
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
  let tooltip = svg.append("g")
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
    .attr("width", 250)
    .attr("height", 250)


  tooltip.select("foreignObject")
    .append("xhtml:div")
    .attr("id","lan")

  tooltip.select("#lan")
    .append("xhtml:select")
    .attr("id", "lan-select")

  let selectOpts = [
    ["Language families in 7 major categories", "LAN7"],
    ["Language families in 39 major categories", "LAN39"],
    ["Choose a detailed language", "LAN"]
  ];

  tooltip.select("select")
    .selectAll("option")
    .data(selectOpts)
    .enter()
    .append("xhtml:option")
    .text(function(d){
      return d[0];
    })
    .attr("value", function(d){
      return d[1];
    })
    .attr("class", "year");

  tooltip.select("select")
    .on("change", function(d) {
      getDataOnSelect();
    });

  return tooltip;
}

function getDataOnSelect(){
  let choice = $("#lan-select").val();

  var data = {
        "get": "EST,LANLABEL,NAME",
        "for": "state:" + stateData
      };

  data[choice] = '';
  
  USCensusShow("/data", opts(data));
}

function buildMap(svg, path, resize) {
  return new Promise(function(resolve, reject) {
    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json", function(error, us) {
      if (error) {
        reject(error);
      } else {

        let s = transition(0, 0);

        let states = buildStates(svg, path, us);          

        let borders = buildBorders(svg, path, us);

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
  let accent = d3.scaleOrdinal()
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

async function USCensusShow(url, opts, params={}) {
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