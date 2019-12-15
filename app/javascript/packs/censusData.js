const colors = require('./colors.js');
const sD = require('./stateDisplay');
const pG = require('./pieGraph');
const bG = require('./barGraph');
const usMap = require('./usMap');
const pCrds = require('./paraCoords');

// let state.id = '';
let state = {
  id: "",
  data: [],
  filtered: [],
  leftovers: [],

};

$(document).ready(function() {

  // Build the map
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
            .attr("fill", "#f2f2f2")

          $(this).attr("fill", "#ccebc5");  

          state.id = d.id;       

          d3.select("#radio-buttons").remove();
          stateDisplay.selectAll(".hover-info").remove();
          stateDisplay.select("#revert").remove();
          stateDisplay.select("#other-display-select").remove();
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
                .attr("fill", "#f2f2f2");
            });;

          let choice = $("#lan-select").val();
          state.choice = choice;

          getDataOnSelect(state, choice)
            .then(data=>{
              console.log(data);
              state.data = data;
              
              if(choice == 'LAN7')
                pG.buildPieGraph(stateDisplay, state, choice)
              else if(choice == 'LAN39'){
                bG.buildBarGraph(stateDisplay, state)
                sD.buildGrowBarButton(state, bG);
              }
              else if(choice == 'LAN'){
                // remove headers and null values
                let preData = data.slice(1).filter(el=> el[0] != null)

                preData.sort((a,b) => +b[0] - +a[0]);

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

getData()
  .then(langs=>{

    let margin = {top: 66, right: 60, bottom: 20, left: 130},
        width = document.body.clientWidth - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        innerHeight = height - 2,
        devicePixelRatio = window.devicePixelRatio || 1;

    let measures = {
      mar: margin,
      wid: width,
      hgt: height,
      inHgt: innerHeight,
      dPixRat: devicePixelRatio
    };

    let types = pCrds.createTypes(innerHeight); 

    // create an alphabetical list of states
    // can be sliced to filter data
    let stateSet = pCrds.createStateSet(langs)//.slice(25);

    // create a set of languages ordered from most spoke in the US to least spoken
    // can be sliced to filter data
    let langSet = pCrds.createLangSet(langs)//.slice(0,10);

    // build each select for filtering the parallel coordinate visualization
    buildSelect("multi-st-select", "state-coords", "m-state", stateSet)
    
    let multiSelect = buildSelect("multi-st-select", "lang-coords", "m-lang", langSet)

    multiSelect.append("button")
      .attr("type", "button")
      .attr("id", "multi-select-submit")
      .text("Submit");
      
    d3.select("#multi-select-submit")
      .on("click", function(d) {
        // to rebuild the whole parallel coordinate vis
        removeParaCoords();

        let statesChoice = $("#state-coords").val();
        let langsChoice = $("#lang-coords").val();

        // build a data set collection
        // each object of the array has all states(as keys) and a LANLABEL(key)
        // the values are the population and the language
        let newDataCollection = pCrds.createNewDataColl(statesChoice, langsChoice, langs);

        // build an dimensions array used to create each axis, 
        // start with language axis
        // continue with states
        // finish with a langugage axis without labels
        let dimensions = pCrds.createDimensions(statesChoice, langsChoice, types);
        
        // build the parallel coordinate vis
        pCrds.buildParaCoords(measures, stateSet, langSet, dimensions, newDataCollection);
        
      });
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

// Get all the language data for all languages for all states
async function getData(){
      var params = {
        "get": "EST,LANLABEL,NAME",
        "for": "state:*",
        "LAN": '' //+ state.id
      };
  const response = await fetch("/data", opts(params));
  const stateData = await response.json();
  // console.log(stateData)

  return stateData;
  
}

function appendSvg() {
  return d3.select("#container")
    .append("svg")
    .attr("width", "100%");
}

function resize(){
  d3.select("#container").selectAll("path").attr("transform", "scale(" + $("#container").width()/970 + ")");  
  $("svg").height($("#container").width()*0.618);
}

function buildSelect(divId, selectId, optClass, opts){
  let multiSelect = d3.select("#" + divId);

    multiSelect.append("xhtml:select")
      .attr("id", selectId)
      .attr("multiple", "")

    multiSelect.select("select#" + selectId)
      .selectAll("option")
      .data(opts)
      .enter()
      .append("xhtml:option")
      .text(function(d){
        return d.replace(/ /g,"_");
      })
      .attr("value", function(d){
        return d.replace(/ /g,"_");
      })
      .attr("class", optClass);

  return multiSelect;
}

function removeParaCoords(){
  d3.selectAll(".parcoords").remove();
  d3.selectAll("pre").remove();
}