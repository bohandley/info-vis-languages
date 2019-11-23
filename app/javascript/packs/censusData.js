const colors = require('./colors.js');

let width = $("#container").width();

// let state.id = '';
let state = {
  id: "",
  data: []
};

$(document).ready(function() {
  let svg = appendSvg();

  let path = d3.geoPath();

  buildMap(svg, path)
    .then(function(data){
      // build the tooltip
      let svg = data["svg"],
          states = data["states"];
      
      let tooltip = createTooltip(svg, state);

      // display the tooltip on clicking a state
      states
        .on("click", function(d) {   
          state.id = d.id;       
          
          tooltip.selectAll("#pie-graph").remove();
          tooltip.selectAll("#legend").remove();
          // tooltip expands, shows text, shows select
          tooltipEntrance(tooltip);

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

          getDataOnSelect(state)
            .then(data=>{
              console.log(data);
              state.data = data;
              
              lanSevenPieChart(tooltip, state);

              
            });
          
        });
    })
    .catch(function(error) {
      console.error(error);
    });

  d3.select(window).on('resize', resize);
});

function lanSevenPieChart(tooltip, state) {
  tooltip.selectAll("#pie-graph").remove();
  // set the dimensions and margins of the graph
  var width = 290,
      height = 220,
      margin = 40;

  // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
  var radius = Math.min(width, height) / 2 - margin;

  // append the svg object to the div called 'my_dataviz'
  var svg = tooltip
    .append("svg")
      .attr("id", "pie-graph")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + ((height / 2) + 15) + ")");

  // create real data
  var //key1 = state.data[2][1], 
    key2 = state.data[4][1],
    key3 = state.data[5][1],
    key4 = state.data[6][1];

  var keys = [key2, key3, key4];

  var //val1 = state.data[2][0],
    val2 = state.data[4][0],
    val3 = state.data[5][0],
    val4 = state.data[6][0];

  var vals = [val2, val3, val4];

  var data = {};

  keys.forEach((el, i)=>{
    data[el] = vals[i];
  })
  
  // set the color scale
  var color = d3.scaleOrdinal()
    .domain(data)
    .range(["#8a89a6", "#7b6888", "#6b486b"]);

  // Compute the position of each group on the pie:
  var pie = d3.pie()
    .value(function(d) {return d.value; });

  var data_ready = pie(d3.entries(data));

  // make this into a function to rebuild the graph every time USCensu is called
  // setTimeout(function(){ 
  svg
    .selectAll('whatever')
    .data(data_ready)
    .enter()
    .append('path')
    .attr('d', d3.arc()
      .innerRadius(0)
      .outerRadius(radius)
    )
    .attr('fill', function(d){ return(color(d.data.key)) })
    .attr("stroke", "black")
    .style("stroke-width", "1px")
    .on("click", function(d) {
        hoverInfo.style("display", "none");
        hoverInfo.style("display", null);
        var xPosition = d3.mouse(this)[0] - 5;
        var yPosition = d3.mouse(this)[1] - 5;
        hoverInfo.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        hoverInfo.select("text").text(d.value);
    });

  tooltip.selectAll("#legend").remove();
  tooltip.append('svg')
    .attr("id", "legend")
    .attr("dy", width)
      // .attr("height", height)
  // Add one dot in the legend for each name.
  var legend = d3.select("#legend")

  legend.selectAll("mydots")
    .data(keys)//data)
    .enter()
    .append("circle")
      .attr("class", "circle")
      .attr("cx", 20)
      .attr("cy", function(d,i){ return 220 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("r", 7)
      .style("fill", function(d){ return color(d)})

  // Add one dot in the legend for each name.
  legend.selectAll("mylabels")
    .data(keys)//data)
    .enter()
    .append("text")
      .attr("x", 40)
      .attr("y", function(d,i){ return 220 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
      .style("fill", function(d){ return color(d)})
      .text(function(d){ return d})
      .attr("text-anchor", "left")
      .attr("font-size", "12px")
      .style("alignment-baseline", "middle")
      // .style("opacity", 0.7)

  // create hover info
  var hoverInfo = svg.append("g")
    .attr("class", "hover-info")
    .style("display", "none");
      
  // TASK 2: build rect display for the tool tip  
  hoverInfo.append("rect")
    .attr("width", 60)
    .attr("height", 20)
    .attr("rx", 5)
    .attr("ry", 5)
    .attr("fill", "white")
    .style("opacity", 1);

  // TASK 2: configure the text for the hoverInfo
  hoverInfo.append("text")
    .attr("x", 30)
    .attr("dy", "1.2em")
    .style("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("font-weight", "bold");

}

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
function createTooltip(svg, state){
  let tooltip = svg.append("g")
    .attr("class", "tooltip")
    .style("display", "none");
        
  // TASK 2: build rect display for the tool tip  
  tooltip.append("rect")
    .attr("width", 0)
    .attr("height", 0)
    .attr("rx", 5)
    .attr("ry", 5)
    .attr("fill", "lightgrey")
    .style("opacity", 1);

  // TASK 2: configure the text for the tooltip
  tooltip.append("text")
    .attr("x", 10)
    .attr("dy", "1.2em")
    .style("text-align", "center")
    .attr("font-size", "12px")
    .attr("font-weight", "bold")

  tooltip = createSelect(tooltip, state);

  return tooltip;
}

function createSelect(object, state) {
    // <foreignObject x="20" y="20" width="160" height="160">
  object.append("foreignObject")
    .attr("x", 20)
    .attr("y", 20)
    .attr("width", 250)
    .attr("height", 250)

  object.select("foreignObject")
    .append("xhtml:div")
    .attr("id","lan")

  object.select("#lan")
    .append("xhtml:select")
    .attr("id", "lan-select")

  let selectOpts = [
    ["Language Snapshot", "LAN7"],
    ["Language families in 39 major categories", "LAN39"],
    ["Choose a detailed language", "LAN"]
  ];

  object.select("select")
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

  object.select("select")
    .on("change", function(d) {
      getDataOnSelect(state)
        .then(data=>{
          state.data = data;
          lanSevenPieChart(object, state)
        });
    });

  return object;
}

async function getDataOnSelect(state){
  let choice = $("#lan-select").val();

  var params = {
        "get": "EST,LANLABEL,NAME",
        "for": "state:" + state.id
      };

  params[choice] = '';
  
  const response = await fetch("/data", opts(params));
  const stateData = await response.json();
  
  return stateData; 
}

// async function USCensusShow(url, opts) {
//   const response = await fetch(url, opts);
//   const stateData = await response.json();
  
//   return stateData;
// }

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

function resize(){
  d3.selectAll("path").attr("transform", "scale(" + $("#container").width()/970 + ")");  
  $("svg").height($("#container").width()*0.618);
}