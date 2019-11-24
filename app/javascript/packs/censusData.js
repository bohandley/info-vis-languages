const colors = require('./colors.js');
const sD = require('./stateDisplay');
const pG = require('./pieGraph');
const usMap = require('./usMap');

// let width = $("#container").width();

// let state.id = '';
let state = {
  id: "",
  data: []
};

$(document).ready(function() {
  d3.select(window).on('resize', resize);

  let svg = appendSvg();

  let path = d3.geoPath();

  usMap.buildMap(svg, path, colors)
    .then(function(data){
      // build the stateDisplay
      let svg = data["svg"],
          states = data["states"];
      


      let stateDisplay = sD.buildStateDisplay(svg, state, getDataOnSelect, pG);

      // display the stateDisplay on clicking a state
      states
        .on("click", function(d) {   
          state.id = d.id;       
          
          stateDisplay.selectAll("#pie-graph").remove();
          stateDisplay.selectAll("#legend").remove();
          // stateDisplay expands, shows text, shows select
          sD.stateDisplayEntrance(stateDisplay);

          let xPosition = d3.mouse(this)[0]*$("#container").width()/970 - 5;
          let yPosition = d3.mouse(this)[1]*$("#container").width()/970 - 5;

          if(xPosition > $("#container").width() - 260)
            xPosition -= 260;

          if(yPosition > $("#container").height() - 260)
            yPosition -= 260;

          stateDisplay.style("display", null)
          stateDisplay.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
          stateDisplay.select("text").text(d.properties.name);

          let choice = $("#lan-select").val();

          getDataOnSelect(state, choice)
            .then(data=>{
              console.log(data);
              state.data = data;
              
              pG.buildPieGraph(stateDisplay, state);

            });
          
        });
    })
    .catch(function(error) {
      console.error(error);
    });
});

async function getDataOnSelect(state, choice){
  var params = {
        "get": "EST,LANLABEL,NAME",
        "for": "state:" + state.id
      };

  params[choice] = '';
  
  const response = await fetch("/data", opts(params));
  const stateData = await response.json();
  
  return stateData; 
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

function appendSvg() {
  return d3.select("#container")
    .append("svg")
    .attr("width", "100%");
}

function resize(){
  d3.selectAll("path").attr("transform", "scale(" + $("#container").width()/970 + ")");  
  $("svg").height($("#container").width()*0.618);
}