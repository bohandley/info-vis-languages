const colors = require('./colors.js');
const sD = require('./stateDisplay');
const pG = require('./pieGraph');
const bG = require('./barGraph');
const usMap = require('./usMap');

// let state.id = '';
let state = {
  id: "",
  data: [],
  filtered: [],
  leftovers: [],
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
      


      let stateDisplay = sD.buildStateDisplay(svg, state, getDataOnSelect, pG, bG);

      // display the stateDisplay on clicking a state
      states
        .on("click", function(d) {
          d3.selectAll(".state-shapes")
            .attr("fill", "#00acc1")

          $(this).attr("fill", "steelblue");  

          state.id = d.id;       
          
          stateDisplay.selectAll("#pie-graph").remove();
          stateDisplay.selectAll("#legend").remove();
          stateDisplay.selectAll(".bar-graph").remove();
          // stateDisplay expands, shows text, shows select
          sD.stateDisplayEntrance(stateDisplay);

          let xPosition = d3.mouse(this)[0]*$("#container").width()/970 - 5;
          let yPosition = d3.mouse(this)[1]*$("#container").width()/970 - 5;

          if(xPosition > $("#container").width() - 300)
            xPosition -= 300;

          if(yPosition > $("#container").height() - 330)
            yPosition -= 330;

          stateDisplay.style("display", null)
          stateDisplay.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
          stateDisplay.select(".state-name").text(d.properties.name);
          
          stateDisplay.select(".exit").text("X")
            .on("click", ()=>{
              d3.selectAll(".state-display")
                .style("display", "none");

              d3.selectAll(".state-shapes")
                .attr("fill", "#00acc1");
            });;

          let choice = $("#lan-select").val();

          getDataOnSelect(state, choice)
            .then(data=>{
              console.log(data);
              state.data = data;
              
              if(choice == 'LAN7')
                pG.buildPieGraph(stateDisplay, state, choice)
              else if(choice == 'LAN39')
                bG.buildBarGraph(stateDisplay, state)
              else if(choice == 'LAN'){
                // remove headers and null values
                let preData = data.slice(1).filter(el=> el[0] != null)


                preData.sort((a,b) => {
                    if (+b[0] < +a[0])
                      return -1;

                    if (+b[0] > +a[0])
                      return 1;

                    return 0;
                });

                // group into top 5 languages plus other
                let top5 = preData.slice(0,5);
                let other = preData.slice(5);

                let otherVal = other.reduce((acc, cur)=> +cur[0] + acc, 0)
                let otherArray = [[otherVal].concat(['Other'])];

                let top5PlusOther = top5.concat(otherArray);

                state.filtered = top5PlusOther;
                state.leftovers = other;

                pG.buildPieGraph(stateDisplay, state, choice);

              }

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
  console.log(stateData)
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