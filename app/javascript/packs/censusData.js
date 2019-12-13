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
            .attr("fill", "#f2f2f2")

          $(this).attr("fill", "#ccebc5");  

          state.id = d.id;       

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
              else if(choice == 'LAN39')
                bG.buildBarGraph(stateDisplay, state)
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


getData()
  .then(langs=>{
    var elms = langs[0];

    var fltrd = langs.slice(1).sort((a,b)=> +b[0] - +a[0]);

    var langs1 = [elms];
    langs = langs1.concat(fltrd);

    var dimensions = [];
    var allStates = langs.slice(1).map(el=> el[2]);
    var stateSet = [...new Set(allStates)].sort();
    
    var allLangs = langs.slice(1).map(el=> el[1]);

    // top 20 languages

    var langSet = new Set(allLangs);

    let langOrd = {}
    langSet.forEach(el=>{
      langs.slice(1).forEach(el2=>{
        if(el == el2[1] && langOrd[el] == null)
          langOrd[el] = +el2[0];
        else if(el == el2[1])
          langOrd[el] += +el2[0];
      });      
    });
    
    let langOrdArr = [];

    for(var key in langOrd){
      langOrdArr.push([key, langOrd[key]]);
    }

    langOrdArr.sort((a,b)=> +b[1] - +a[1]);

    langSet = langOrdArr.map(el=> el[0]); 
    // SLICE TO DISPLAY
    langSet = [...langSet].slice(0,10);

    var margin = {top: 66, right: 60, bottom: 20, left: 130},
        width = document.body.clientWidth - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        innerHeight = height - 2;

    var devicePixelRatio = window.devicePixelRatio || 1;

    var color = d3.scaleOrdinal()
      .domain(langSet)
      // .domain(["Radial Velocity", "Imaging", "Eclipse Timing Variations", "Astrometry", "Microlensing", "Orbital Brightness Modulation", "Pulsar Timing", "Pulsation Timing Variations", "Transit", "Transit Timing Variations"])
      .range(["#DB7F85", "#50AB84", "#4C6C86", "#C47DCB", "#B59248", "#DD6CA7", "#E15E5A", "#5DA5B3", "#725D82", "#54AF52", "#954D56", "#8C92E8", "#D8597D", "#AB9C27", "#D67D4B", "#D58323", "#BA89AD", "#357468", "#8F86C2", "#7D9E33", "#517C3F", "#9D5130", "#5E9ACF", "#776327", "#944F7E"]);

    var types = {
      "Number": {
        key: "Number",
        coerce: function(d) { return +d; },
        extent: d3.extent,
        within: function(d, extent, dim) { return extent[0] <= dim.scale(d) && dim.scale(d) <= extent[1]; },
        defaultScale: d3.scaleLinear().range([innerHeight, 0])
      },
      "String": {
        key: "String",
        coerce: String,
        extent: function (data) { return data.sort(); },
        within: function(d, extent, dim) { return extent[0] <= dim.scale(d) && dim.scale(d) <= extent[1]; },
        defaultScale: d3.scalePoint().range([0, innerHeight])
      },
      "Date": {
        key: "Date",
        coerce: function(d) { return new Date(d); },
        extent: d3.extent,
        within: function(d, extent, dim) { return extent[0] <= dim.scale(d) && dim.scale(d) <= extent[1]; },
        defaultScale: d3.scaleTime().range([innerHeight, 0])
      }
    };



    // create the collection for each language
      // has all states with a value or not
    var newDataCollection = [];

    var dataObj = {};

    stateSet.forEach(el=> dataObj[el.replace(/ /g,"_")] = '0');

    var newdata = langSet.forEach(lang=>{
      var nObj = Object.assign({}, dataObj)

      nObj["LANLABEL"] = lang;
      langs.forEach(langArr=>{
        if(langArr[1] == lang){
          nObj[langArr[2].replace(/ /g,"_")] = langArr[0]
        }
      });
      newDataCollection.push(nObj);
    });

    stateSet.forEach(el=>{
      var obj = {
        key: el.replace(/ /g,"_"),
        description: el,
        type: types["Number"]
      }
      dimensions.push(obj);
    })

    var langScaleObj = {
      key: "LANLABEL",
      description: "Languages",
      type: types["String"],
      domain: [...langSet],
      axis: d3.axisLeft()
        .tickFormat(function(d,i) {
          return d;
        })
    };

    var langScaleObj2 = {
      key: "LANLABEL",
      description: "",
      type: types["String"],
      domain: [...langSet],
      // axis: d3.axisLeft()
      //   .tickFormat(function(d,i) {
      //     return d;
      //   })
    };
    
    dimensions.unshift(langScaleObj);
    dimensions.push(langScaleObj2);
    // var dimensions = [
    //   {
    //     key: "pl_discmethod",
    //     description: "Discovery Method",
    //     type: types["String"],
    //     axis: d3.axisLeft()
    //       .tickFormat(function(d,i) {
    //         return d;
    //       })
    //   },
    //   {
    //     key: "pl_letter",
    //     description: "Planet Letter",
    //     type: types["String"]
    //   },
    //   {
    //     key: "pl_pnum",
    //     description: "Number of Planets in System",
    //     type: types["Number"]
    //   },
    //   {
    //     key: "pl_orbper",
    //     type: types["Number"],
    //     description: "Planet Orbital Period",
    //     scale: d3.scaleLog().range([innerHeight, 0])
    //   },
    //   {
    //     key: "pl_orbsmax",
    //     type: types["Number"],
    //     description: "Planet Semi-Major Axis",
    //     scale: d3.scaleLog().range([innerHeight, 0])
    //   },
    //   {
    //     key: "pl_orbeccen",
    //     description: "Planet Eccentricity",
    //     type: types["Number"]
    //   },
    //   {
    //     key: "pl_orbincl",
    //     description: "Planet Inclination",
    //     type: types["Number"]
    //   },
    //   {
    //     key: "pl_bmassj",
    //     description: "Mass in Jupiters",
    //     type: types["Number"]
    //   },
    //   {
    //     key: "pl_rade",
    //     description: "Planet Radius in Earth Radii",
    //     type: types["Number"]
    //   },
    //   {
    //     key: "pl_eqt",
    //     description: "Planet Equilibrium Temperature (K)",
    //     type: types["Number"]
    //   },
    //   {
    //     key: "pl_imppar",
    //     description: "Impact Parameter",
    //     type: types["Number"]
    //   },
    //   {
    //     key: "pl_trandep",
    //     description: "Transit Depth (%)",
    //     type: types["Number"]
    //   },
    //   {
    //     key: "pl_trandur",
    //     description: "Transit Duration (days)",
    //     type: types["Number"]
    //   },
    //   {
    //     key: "pl_ratror",
    //     description: "Planet-Star Radius Ratio",
    //     type: types["Number"]
    //   },
    //   {
    //     key: "st_spstr",
    //     description: "Star Spectral Type",
    //     type: types["String"],
    //     axis: d3.axisLeft()
    //       .tickFormat(function(d,i) {
    //         if (i % 4) return;
    //         return d;
    //       })
    //   },
    //   {
    //     key: "pl_locale",
    //     description: "Locale",
    //     type: types["String"],
    //     axis: d3.axisLeft()
    //       .tickFormat(function(d,i) {
    //         if (d == "Multiple Locales") return "Multiple";
    //         return d;
    //       })

    //   },
    //   {
    //     key: "pl_disc",
    //     description: "Year of Discovery",
    //     type: types["Date"]
    //   },
    //   {
    //     key: "pl_facility",
    //     description: "Facility",
    //     type: types["String"],
    //     domain: ["Kepler", "La Silla Observatory", "K2", "W. M. Keck Observatory", "SuperWASP", "Multiple Observatories", "HATNet", "Haute-Provence Observatory", "Anglo-Australian Telescope", "OGLE", "Lick Observatory", "HATSouth", "CoRoT", "McDonald Observatory", "Okayama Astrophysical Observatory", "MOA", "Bohyunsan Optical Astronomical Observatory", "Las Campanas Observatory", "SuperWASP-South", "Roque de los Muchachos Observatory", "Paranal Observatory", "Gemini Observatory", "KELT", "Subaru Telescope", "Thueringer Landessternwarte Tautenburg", "XO", "Multiple Facilities", "Hubble Space Telescope", "Fred Lawrence Whipple Observatory", "TrES", "kepler", "KELT-South", "Spitzer Space Telescope", "Arecibo Observatory", "United Kingdom Infrared Telescope", "Large Binocular Telescope Observatory", "Xinglong Station", "Cerro Tololo Inter-American Observatory", "Palomar Observatory", "SuperWASP-North", "Qatar", "Teide Observatory", "European Southern Observatory", "Leoncito Astronomical Complex", "Infrared Survey Facility", "KMTNet", "Parkes Observatory", "Apache Point Observatory", "Oak Ridge Observatory", "MEarth Project", "Yunnan Astronomical Observatory", "Kitt Peak National Observatory"],
    //     axis: d3.axisRight()
    //       .tickFormat(function(d,i) {
    //         return d;
    //       })
    //   }
      /*
      {
        key: "pl_telescope",
        description: "Telescope",
        type: types["String"],
        axis: d3.axisRight()
          .tickFormat(function(d,i) {
            return d;
          })
      }
      */
      /*
      {
        key: "pl_instrument",
        description: "Instrument",
        type: types["String"],
        axis: d3.axisRight()
          .tickFormat(function(d,i) {
            return d;
          })
      }
      */
    // ];


    var xscale = d3.scalePoint()
        .domain(d3.range(dimensions.length))
        .range([0, width]);

    var yAxis = d3.axisLeft()
      .tickValues([]);

    var container = d3.select("body").append("div")
        .attr("class", "parcoords")
        .style("width", width + margin.left + margin.right + "px")
        .style("height", height + margin.top + margin.bottom + "px");

    var svg = container.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var canvas = container.append("canvas")
        .attr("width", width * devicePixelRatio)
        .attr("height", height * devicePixelRatio)
        .style("width", width + "px")
        .style("height", height + "px")
        .style("margin-top", margin.top + "px")
        .style("margin-left", margin.left + "px");

    var ctx = canvas.node().getContext("2d");
    ctx.globalCompositeOperation = 'darken';
    ctx.globalAlpha = 0.15;
    ctx.lineWidth = 1.5;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    var output = d3.select("body").append("pre");

    var axes = svg.selectAll(".axis")
        .data(dimensions)
      .enter().append("g")
        .attr("class", function(d) { return "axis " + d.key.replace(/ /g, "_"); })
        .attr("transform", function(d,i) { return "translate(" + xscale(i) + ")"; });
//////////
    d3.csv("planets.csv", function(error, data) {
      if (error) throw error;

      data = newDataCollection;
      data.forEach(el=>{
        
        for(var key in el) {
          if(el[key] == null){
            
            el[key] = "0";
          }
        }
      });

      data.forEach(function(d) {
        dimensions.forEach(function(p) {
          d[p.key] = !d[p.key] ? null : p.type.coerce(d[p.key]);
        });

        // truncate long text strings to fit in data table
        for (var key in d) {
          if (d[key] && d[key].length > 35) d[key] = d[key].slice(0,36);
        }
      });

      // type/dimension default setting happens here
      dimensions.forEach(function(dim) {
        if (!("domain" in dim)) {
          // detect domain using dimension type's extent function
          let dataExtent = data.map(function(d) { return d[dim.key]; });
          dataExtent.sort((a,b)=>a-b);
          let total = dataExtent.reduce((acc, el)=> acc+el,0)
          // let greaterVal = dataExtent[dataExtent.length - 1]/5 + dataExtent[dataExtent.length - 1]
          // dataExtent.push(greaterVal);
          dataExtent.push(total);
          
          dim.domain = d3_functor(dim.type.extent)(dataExtent)//(data.map(function(d) { return d[dim.key]; }));
        }
        if (!("scale" in dim)) {
          // use type's default scale for dimension
          dim.scale = dim.type.defaultScale.copy();
        }
        dim.scale.domain(dim.domain);
      });

      var render = renderQueue(draw).rate(30);

      ctx.clearRect(0,0,width,height);
      ctx.globalAlpha = d3.min([1.15/Math.pow(data.length,0.3),1]);
      render(data);

      axes.append("g")
          .each(function(d) {
            var renderAxis = "axis" in d
              ? d.axis.scale(d.scale)  // custom axis
              : yAxis.scale(d.scale);  // default axis
            d3.select(this).call(renderAxis);
          })
        .append("text")
          .attr("class", "title")
          .attr("text-anchor", "start")
          .text(function(d) { return "description" in d ? d.description : d.key; });

      // Add and store a brush for each axis.
      axes.append("g")
          .attr("class", "brush")
          .each(function(d) {
            d3.select(this).call(d.brush = d3.brushY()
              .extent([[-10,0], [10,height]])
              .on("start", brushstart)
              .on("brush", brush)
              .on("end", brush)
            )
          })
        .selectAll("rect")
          .attr("x", -8)
          .attr("width", 16);

      d3.selectAll(".axis.LANLABEL .tick text")
        .style("fill", color);
        debugger

      output.text(d3.tsvFormat(data.slice(0,24)));

      function project(d) {
        return dimensions.map(function(p,i) {
          // check if data element has property and contains a value
          if (
            !(p.key in d) ||
            d[p.key] === null
          ) return null;

          return [xscale(i),p.scale(d[p.key])];
        });
      };

      function draw(d) {
        ctx.strokeStyle = color(d.LANLABEL);
        ctx.beginPath();
        var coords = project(d);
        coords.forEach(function(p,i) {
          // this tricky bit avoids rendering null values as 0
          if (p === null) {
            // this bit renders horizontal lines on the previous/next
            // dimensions, so that sandwiched null values are visible
            if (i > 0) {
              var prev = coords[i-1];
              if (prev !== null) {
                ctx.moveTo(prev[0],prev[1]);
                ctx.lineTo(prev[0]+6,prev[1]);
              }
            }
            if (i < coords.length-1) {
              var next = coords[i+1];
              if (next !== null) {
                ctx.moveTo(next[0]-6,next[1]);
              }
            }
            return;
          }
          
          if (i == 0) {
            ctx.moveTo(p[0],p[1]);
            return;
          }

          ctx.lineTo(p[0],p[1]);
        });
        ctx.stroke();
      }

      function brushstart() {
        d3.event.sourceEvent.stopPropagation();
      }

      // Handles a brush event, toggling the display of foreground lines.
      function brush() {
        render.invalidate();

        var actives = [];
        svg.selectAll(".axis .brush")
          .filter(function(d) {
            return d3.brushSelection(this);
          })
          .each(function(d) {
            actives.push({
              dimension: d,
              extent: d3.brushSelection(this)
            });
          });

        var selected = data.filter(function(d) {
          if (actives.every(function(active) {
              var dim = active.dimension;
              // test if point is within extents for each active brush
              return dim.type.within(d[dim.key], active.extent, dim);
            })) {
            return true;
          }
        });

        // show ticks for active brush dimensions
        // and filter ticks to only those within brush extents
        /*
        svg.selectAll(".axis")
            .filter(function(d) {
              return actives.indexOf(d) > -1 ? true : false;
            })
            .classed("active", true)
            .each(function(dimension, i) {
              var extent = extents[i];
              d3.select(this)
                .selectAll(".tick text")
                .style("display", function(d) {
                  var value = dimension.type.coerce(d);
                  return dimension.type.within(value, extent, dimension) ? null : "none";
                });
            });

        // reset dimensions without active brushes
        svg.selectAll(".axis")
            .filter(function(d) {
              return actives.indexOf(d) > -1 ? false : true;
            })
            .classed("active", false)
            .selectAll(".tick text")
              .style("display", null);
        */

        ctx.clearRect(0,0,width,height);
        ctx.globalAlpha = d3.min([0.85/Math.pow(selected.length,0.3),1]);
        render(selected);

        output.text(d3.tsvFormat(selected.slice(0,24)));
      }
    });

    function d3_functor(v) {
      return typeof v === "function" ? v : function() { return v; };
    };

  })

    
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