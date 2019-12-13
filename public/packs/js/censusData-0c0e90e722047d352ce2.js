/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/packs/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./app/javascript/packs/censusData.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/javascript/packs/barGraph.js":
/*!******************************************!*\
  !*** ./app/javascript/packs/barGraph.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var barGraph = {
  buildBarGraph: function buildBarGraph(stateDisplay, state) {
    var data = state.data.slice(1).sort(function (a, b) {
      return +b[0] - +a[0];
    });
    var greatestPop = data[0][0];
    var widthScale = d3.scaleLinear().domain([1, greatestPop]).range([0, 300]);
    var color = d3.scaleOrdinal(d3.schemePastel1.concat(d3.schemePastel1)).domain(data.map(function (el) {
      return el[1];
    })); // .attr("height", function(d) {return myscale(d);})

    var rects = stateDisplay.selectAll('this').data(data).enter().append("rect").attr("class", "bar-graph").attr("transform", "translate(0, 40)").attr("x", 10).attr("y", function (d, i) {
      return 10 + i * (10 + 10); // return padding + i * (barHeight + padding);
    }).attr("height", 15).style("fill", function (d, i) {
      return color(i);
    }).on("click", function (d) {
      hoverInfo.style("display", null);
      var xPosition = d3.mouse(this)[0] - 5;
      var yPosition = d3.mouse(this)[1] - 5 + 40;
      hoverInfo.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
      hoverInfo.select("#hover-state-pop").text((+d[0]).toLocaleString());
    });
    var s = d3.transition().delay(1000).duration(1000);
    rects.transition(s).attr("width", function (d) {
      return widthScale(d[0]);
    });
    var texts = stateDisplay.selectAll('thing').data(data).enter().append("text").attr("class", "bar-graph").attr("transform", "translate(0, 40)").attr('x', 10).attr('y', function (d, i) {
      return (i + 1) * (10 + 10);
    }).attr('font-size', 12).text(function (d) {
      return d[1];
    }).on("click", function (d) {
      hoverInfo.style("display", null);
      var xPosition = d3.mouse(this)[0] - 5;
      var yPosition = d3.mouse(this)[1] - 5 + 40;
      hoverInfo.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
      hoverInfo.select("#hover-state-pop").text((+d[0]).toLocaleString());
    });
    stateDisplay.selectAll(".hover-info").remove(); // create hover info

    var hoverInfo = stateDisplay.append("g").attr("class", "hover-info").style("display", "none");
    var width, height, x, dy; // if(choice=="LAN7"){

    width = 60;
    height = 20;
    x = 30;
    dy = "1.2em"; // } else if(choice=="LAN"){
    // 	width = 90;
    // 	height = 33;
    // 	x = 45;
    // 	dy = "2.2em";
    // }
    // TASK 2: build rect display for the tool tip  

    hoverInfo.append("rect").attr("id", "hover-info-rect").attr("width", width).attr("height", height).attr("rx", 5).attr("ry", 5).attr("fill", "white").style("opacity", 1); // // TASK 2: configure the text for the hoverInfo
    // if(choice=="LAN"){
    //  hoverInfo.append("text")
    //  	.attr("id", "hover-state-name")
    //    .attr("x", x)
    //    .attr("dy", "1.2em")
    //    .style("text-anchor", "middle")
    //    .attr("font-size", "12px")
    //    .attr("font-weight", "bold");
    // }

    hoverInfo.append("text").attr("id", "hover-state-pop").attr("x", x).attr("dy", dy).style("text-anchor", "middle").attr("font-size", "12px").attr("font-weight", "bold");
  }
};
module.exports = barGraph;

/***/ }),

/***/ "./app/javascript/packs/censusData.js":
/*!********************************************!*\
  !*** ./app/javascript/packs/censusData.js ***!
  \********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);


function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var colors = __webpack_require__(/*! ./colors.js */ "./app/javascript/packs/colors.js");

var sD = __webpack_require__(/*! ./stateDisplay */ "./app/javascript/packs/stateDisplay.js");

var pG = __webpack_require__(/*! ./pieGraph */ "./app/javascript/packs/pieGraph.js");

var bG = __webpack_require__(/*! ./barGraph */ "./app/javascript/packs/barGraph.js");

var usMap = __webpack_require__(/*! ./usMap */ "./app/javascript/packs/usMap.js"); // let state.id = '';


var state = {
  id: "",
  data: [],
  filtered: [],
  leftovers: []
};
$(document).ready(function () {
  d3.select(window).on('resize', resize);
  var svg = appendSvg();
  var path = d3.geoPath();
  usMap.buildMap(svg, path, colors).then(function (data) {
    // build the stateDisplay
    var svg = data["svg"],
        states = data["states"];
    var stateDisplay = sD.buildStateDisplay(svg, state, getDataOnSelect, pG, bG); // display the stateDisplay on clicking a state

    states.on("click", function (d) {
      d3.selectAll(".state-shapes").attr("fill", "#f2f2f2");
      $(this).attr("fill", "#ccebc5");
      state.id = d.id;
      stateDisplay.selectAll(".hover-info").remove();
      stateDisplay.select("#revert").remove();
      stateDisplay.select("#other-display-select").remove();
      stateDisplay.selectAll("#pie-graph").remove();
      stateDisplay.selectAll("#legend").remove();
      stateDisplay.selectAll(".bar-graph").remove(); // stateDisplay expands, shows text, shows select

      sD.stateDisplayEntrance(stateDisplay);
      var xPosition = d3.mouse(this)[0] * $("#container").width() / 970 - 5;
      var yPosition = d3.mouse(this)[1] * $("#container").width() / 970 - 5;
      if (xPosition > $("#container").width() - 300) xPosition -= 300;
      if (yPosition > $("#container").height() - 330) yPosition -= 330;
      stateDisplay.style("display", null);
      stateDisplay.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
      stateDisplay.select(".state-name").text(d.properties.name);
      stateDisplay.select(".exit").text("X").on("click", function () {
        d3.selectAll(".state-display").style("display", "none");
        d3.selectAll(".state-shapes").attr("fill", "#f2f2f2");
      });
      ;
      var choice = $("#lan-select").val();
      state.choice = choice;
      getDataOnSelect(state, choice).then(function (data) {
        console.log(data);
        state.data = data;
        if (choice == 'LAN7') pG.buildPieGraph(stateDisplay, state, choice);else if (choice == 'LAN39') bG.buildBarGraph(stateDisplay, state);else if (choice == 'LAN') {
          // remove headers and null values
          var preData = data.slice(1).filter(function (el) {
            return el[0] != null;
          });
          preData.sort(function (a, b) {
            return +b[0] - +a[0];
          }); // group into top 5 languages plus other

          var top5 = preData.slice(0, 5);
          var other = preData.slice(5);
          var otherVal = other.reduce(function (acc, cur) {
            return +cur[0] + acc;
          }, 0);
          var otherArray = [[otherVal].concat(['Other'])];
          var top5PlusOther = top5.concat(otherArray);
          state.filtered = top5PlusOther;
          state.leftovers = other;
          pG.buildPieGraph(stateDisplay, state, choice);
        }
      });
    });
  })["catch"](function (error) {
    console.error(error);
  });

  function getData() {
    var params, response, stateData;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function getData$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            params = {
              "get": "EST,LANLABEL,NAME",
              "for": "state:*",
              "LAN": '' //+ state.id

            };
            _context.next = 3;
            return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(fetch("/data", opts(params)));

          case 3:
            response = _context.sent;
            _context.next = 6;
            return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(response.json());

          case 6:
            stateData = _context.sent;
            return _context.abrupt("return", stateData);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    });
  }

  getData().then(function (langs) {
    var elms = langs[0];
    var fltrd = langs.slice(1).sort(function (a, b) {
      return +b[0] - +a[0];
    });
    var langs1 = [elms];
    langs = langs1.concat(fltrd);
    var dimensions = [];
    var allStates = langs.slice(1).map(function (el) {
      return el[2];
    });

    var stateSet = _toConsumableArray(new Set(allStates)).sort();

    var allLangs = langs.slice(1).map(function (el) {
      return el[1];
    }); // top 20 languages

    var langSet = new Set(allLangs);
    var langOrd = {};
    langSet.forEach(function (el) {
      langs.slice(1).forEach(function (el2) {
        if (el == el2[1] && langOrd[el] == null) langOrd[el] = +el2[0];else if (el == el2[1]) langOrd[el] += +el2[0];
      });
    });
    var langOrdArr = [];

    for (var key in langOrd) {
      langOrdArr.push([key, langOrd[key]]);
    }

    langOrdArr.sort(function (a, b) {
      return +b[1] - +a[1];
    });
    langSet = langOrdArr.map(function (el) {
      return el[0];
    }); // SLICE TO DISPLAY

    langSet = _toConsumableArray(langSet).slice(0, 10);
    var margin = {
      top: 66,
      right: 60,
      bottom: 20,
      left: 130
    },
        width = document.body.clientWidth - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        innerHeight = height - 2;
    var devicePixelRatio = window.devicePixelRatio || 1;
    var color = d3.scaleOrdinal().domain(langSet) // .domain(["Radial Velocity", "Imaging", "Eclipse Timing Variations", "Astrometry", "Microlensing", "Orbital Brightness Modulation", "Pulsar Timing", "Pulsation Timing Variations", "Transit", "Transit Timing Variations"])
    .range(["#DB7F85", "#50AB84", "#4C6C86", "#C47DCB", "#B59248", "#DD6CA7", "#E15E5A", "#5DA5B3", "#725D82", "#54AF52", "#954D56", "#8C92E8", "#D8597D", "#AB9C27", "#D67D4B", "#D58323", "#BA89AD", "#357468", "#8F86C2", "#7D9E33", "#517C3F", "#9D5130", "#5E9ACF", "#776327", "#944F7E"]);
    var types = {
      "Number": {
        key: "Number",
        coerce: function coerce(d) {
          return +d;
        },
        extent: d3.extent,
        within: function within(d, extent, dim) {
          return extent[0] <= dim.scale(d) && dim.scale(d) <= extent[1];
        },
        defaultScale: d3.scaleLinear().range([innerHeight, 0])
      },
      "String": {
        key: "String",
        coerce: String,
        extent: function extent(data) {
          return data.sort();
        },
        within: function within(d, extent, dim) {
          return extent[0] <= dim.scale(d) && dim.scale(d) <= extent[1];
        },
        defaultScale: d3.scalePoint().range([0, innerHeight])
      },
      "Date": {
        key: "Date",
        coerce: function coerce(d) {
          return new Date(d);
        },
        extent: d3.extent,
        within: function within(d, extent, dim) {
          return extent[0] <= dim.scale(d) && dim.scale(d) <= extent[1];
        },
        defaultScale: d3.scaleTime().range([innerHeight, 0])
      }
    }; // create the collection for each language
    // has all states with a value or not

    var newDataCollection = [];
    var dataObj = {};
    stateSet.forEach(function (el) {
      return dataObj[el.replace(/ /g, "_")] = '0';
    });
    var newdata = langSet.forEach(function (lang) {
      var nObj = Object.assign({}, dataObj);
      nObj["LANLABEL"] = lang;
      langs.forEach(function (langArr) {
        if (langArr[1] == lang) {
          nObj[langArr[2].replace(/ /g, "_")] = langArr[0];
        }
      });
      newDataCollection.push(nObj);
    });
    stateSet.forEach(function (el) {
      var obj = {
        key: el.replace(/ /g, "_"),
        description: el,
        type: types["Number"]
      };
      dimensions.push(obj);
    });
    var langScaleObj = {
      key: "LANLABEL",
      description: "Languages",
      type: types["String"],
      domain: _toConsumableArray(langSet),
      axis: d3.axisLeft().tickFormat(function (d, i) {
        return d;
      })
    };
    var langScaleObj2 = {
      key: "LANLABEL",
      description: "",
      type: types["String"],
      domain: _toConsumableArray(langSet) // axis: d3.axisLeft()
      //   .tickFormat(function(d,i) {
      //     return d;
      //   })

    };
    dimensions.unshift(langScaleObj);
    dimensions.push(langScaleObj2); // var dimensions = [
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

    var xscale = d3.scalePoint().domain(d3.range(dimensions.length)).range([0, width]);
    var yAxis = d3.axisLeft().tickValues([]);
    var container = d3.select("body").append("div").attr("class", "parcoords").style("width", width + margin.left + margin.right + "px").style("height", height + margin.top + margin.bottom + "px");
    var svg = container.append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var canvas = container.append("canvas").attr("width", width * devicePixelRatio).attr("height", height * devicePixelRatio).style("width", width + "px").style("height", height + "px").style("margin-top", margin.top + "px").style("margin-left", margin.left + "px");
    var ctx = canvas.node().getContext("2d");
    ctx.globalCompositeOperation = 'darken';
    ctx.globalAlpha = 0.15;
    ctx.lineWidth = 1.5;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    var output = d3.select("body").append("pre");
    var axes = svg.selectAll(".axis").data(dimensions).enter().append("g").attr("class", function (d) {
      return "axis " + d.key.replace(/ /g, "_");
    }).attr("transform", function (d, i) {
      return "translate(" + xscale(i) + ")";
    }); //////////

    d3.csv("planets.csv", function (error, data) {
      if (error) throw error;
      data = newDataCollection;
      data.forEach(function (el) {
        for (var key in el) {
          if (el[key] == null) {
            el[key] = "0";
          }
        }
      });
      data.forEach(function (d) {
        dimensions.forEach(function (p) {
          d[p.key] = !d[p.key] ? null : p.type.coerce(d[p.key]);
        }); // truncate long text strings to fit in data table

        for (var key in d) {
          if (d[key] && d[key].length > 35) d[key] = d[key].slice(0, 36);
        }
      }); // type/dimension default setting happens here

      dimensions.forEach(function (dim) {
        if (!("domain" in dim)) {
          // detect domain using dimension type's extent function
          var dataExtent = data.map(function (d) {
            return d[dim.key];
          });
          dataExtent.sort(function (a, b) {
            return a - b;
          });
          var total = dataExtent.reduce(function (acc, el) {
            return acc + el;
          }, 0); // let greaterVal = dataExtent[dataExtent.length - 1]/5 + dataExtent[dataExtent.length - 1]
          // dataExtent.push(greaterVal);

          dataExtent.push(total);
          dim.domain = d3_functor(dim.type.extent)(dataExtent); //(data.map(function(d) { return d[dim.key]; }));
        }

        if (!("scale" in dim)) {
          // use type's default scale for dimension
          dim.scale = dim.type.defaultScale.copy();
        }

        dim.scale.domain(dim.domain);
      });
      var render = renderQueue(draw).rate(30);
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = d3.min([1.15 / Math.pow(data.length, 0.3), 1]);
      render(data);
      axes.append("g").each(function (d) {
        var renderAxis = "axis" in d ? d.axis.scale(d.scale) // custom axis
        : yAxis.scale(d.scale); // default axis

        d3.select(this).call(renderAxis);
      }).append("text").attr("class", "title").attr("text-anchor", "start").text(function (d) {
        return "description" in d ? d.description : d.key;
      }); // Add and store a brush for each axis.

      axes.append("g").attr("class", "brush").each(function (d) {
        d3.select(this).call(d.brush = d3.brushY().extent([[-10, 0], [10, height]]).on("start", brushstart).on("brush", brush).on("end", brush));
      }).selectAll("rect").attr("x", -8).attr("width", 16);
      d3.selectAll(".axis.LANLABEL .tick text").style("fill", color);
      debugger;
      output.text(d3.tsvFormat(data.slice(0, 24)));

      function project(d) {
        return dimensions.map(function (p, i) {
          // check if data element has property and contains a value
          if (!(p.key in d) || d[p.key] === null) return null;
          return [xscale(i), p.scale(d[p.key])];
        });
      }

      ;

      function draw(d) {
        ctx.strokeStyle = color(d.LANLABEL);
        ctx.beginPath();
        var coords = project(d);
        coords.forEach(function (p, i) {
          // this tricky bit avoids rendering null values as 0
          if (p === null) {
            // this bit renders horizontal lines on the previous/next
            // dimensions, so that sandwiched null values are visible
            if (i > 0) {
              var prev = coords[i - 1];

              if (prev !== null) {
                ctx.moveTo(prev[0], prev[1]);
                ctx.lineTo(prev[0] + 6, prev[1]);
              }
            }

            if (i < coords.length - 1) {
              var next = coords[i + 1];

              if (next !== null) {
                ctx.moveTo(next[0] - 6, next[1]);
              }
            }

            return;
          }

          if (i == 0) {
            ctx.moveTo(p[0], p[1]);
            return;
          }

          ctx.lineTo(p[0], p[1]);
        });
        ctx.stroke();
      }

      function brushstart() {
        d3.event.sourceEvent.stopPropagation();
      } // Handles a brush event, toggling the display of foreground lines.


      function brush() {
        render.invalidate();
        var actives = [];
        svg.selectAll(".axis .brush").filter(function (d) {
          return d3.brushSelection(this);
        }).each(function (d) {
          actives.push({
            dimension: d,
            extent: d3.brushSelection(this)
          });
        });
        var selected = data.filter(function (d) {
          if (actives.every(function (active) {
            var dim = active.dimension; // test if point is within extents for each active brush

            return dim.type.within(d[dim.key], active.extent, dim);
          })) {
            return true;
          }
        }); // show ticks for active brush dimensions
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

        ctx.clearRect(0, 0, width, height);
        ctx.globalAlpha = d3.min([0.85 / Math.pow(selected.length, 0.3), 1]);
        render(selected);
        output.text(d3.tsvFormat(selected.slice(0, 24)));
      }
    });

    function d3_functor(v) {
      return typeof v === "function" ? v : function () {
        return v;
      };
    }

    ;
  });
});

function getDataOnSelect(state, choice) {
  var params, response, stateData;
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function getDataOnSelect$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          params = {
            "get": "EST,LANLABEL,NAME",
            "for": "state:" + state.id
          };
          params[choice] = '';
          _context2.next = 4;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(fetch("/data", opts(params)));

        case 4:
          response = _context2.sent;
          _context2.next = 7;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(response.json());

        case 7:
          stateData = _context2.sent;
          console.log(stateData);
          return _context2.abrupt("return", stateData);

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function opts() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    method: 'POST',
    // *GET, POST, PUT, DELETE, etc.
    credentials: 'same-origin',
    // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': window._token
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header

  };
}

function appendSvg() {
  return d3.select("#container").append("svg").attr("width", "100%");
}

function resize() {
  d3.selectAll("path").attr("transform", "scale(" + $("#container").width() / 970 + ")");
  $("svg").height($("#container").width() * 0.618);
}

/***/ }),

/***/ "./app/javascript/packs/colors.js":
/*!****************************************!*\
  !*** ./app/javascript/packs/colors.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var colors = [//   '#3949AB',
// '#303F9F',
// '#283593',
// '#1A237E',
// '#8C9EFF',
// '#536DFE',
// '#3D5AFE',
// '#304FFE',
// '#E3F2FD',
// '#BBDEFB',
// '#90CAF9',
// '#64B5F6',
// '#42A5F5',
// '#2196F3',
// '#1E88E5',
// '#1976D2',
// '#1565C0',
// '#0D47A1',
// '#82B1FF',
// '#448AFF',
// '#2979FF',
// '#2962FF',
// '#E1F5FE',
// '#B3E5FC',
// '#81D4FA',
'#4FC3F7', '#29B6F6', '#03A9F4', '#039BE5', '#0288D1', '#0277BD', '#01579B', '#80D8FF', '#40C4FF', '#00B0FF', '#0091EA', '#E0F7FA', '#B2EBF2', '#80DEEA', '#4DD0E1', '#26C6DA', '#00BCD4', '#00ACC1', '#0097A7', '#00838F', '#006064', '#84FFFF', '#18FFFF', '#00E5FF', '#00B8D4', // '#E0F2F1',
'#B2DFDB', '#80CBC4', '#4DB6AC', '#26A69A', '#009688', '#00897B', '#00796B', '#00695C', '#004D40', '#A7FFEB', '#64FFDA', '#1DE9B6', '#00BFA5', // '#E8F5E9',
'#C8E6C9', '#A5D6A7', '#81C784', '#66BB6A', '#4CAF50', '#43A047', '#388E3C', '#2E7D32', '#1B5E20', '#B9F6CA', '#69F0AE', '#00E676', '#00C853', // '#F1F8E9',
'#DCEDC8', '#C5E1A5', '#AED581', '#9CCC65', '#8BC34A', '#7CB342', '#689F38', '#558B2F', '#33691E', '#CCFF90', '#B2FF59', '#76FF03', '#64DD17', '#F9FBE7', '#F0F4C3', '#E6EE9C', '#DCE775', '#D4E157', '#CDDC39', '#C0CA33', '#AFB42B', '#9E9D24', '#827717', '#F4FF81', '#EEFF41' // '#C6FF00',
// '#AEEA00',
// '#FFFDE7',
// '#FFF9C4',
// '#FFF59D',
// '#FFF176',
// '#FFEE58',
// '#FFEB3B',
// '#FDD835',
// '#FBC02D',
// '#F9A825',
// '#F57F17',
// '#FFFF8D',
// '#FFFF00',
// '#FFEA00',
// '#FFD600',
// '#FFF8E1',
// '#FFECB3',
// '#FFE082',
// '#FFD54F',
// '#FFCA28',
];
module.exports = colors;

/***/ }),

/***/ "./app/javascript/packs/pieGraph.js":
/*!******************************************!*\
  !*** ./app/javascript/packs/pieGraph.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var pieGraph = {
  buildPieGraph: function buildPieGraph(stateDisplay, state, choice) {
    // create data for either LAN& or LAN choice
    var customArray, data; // create data for building the pie graph
    // need array to map over data, 

    if (choice == 'LAN7') {
      customArray = [4, 5, 6];
      data = this.createPieData(customArray, state.data);
    } else if (choice == 'LAN') {
      customArray = state.filtered.map(function (el, i) {
        return i;
      });
      data = this.createPieData(customArray, state.filtered);
    } // set the dimensions and margins of the graph


    var width = 330,
        height = 270,
        margin = 40;
    var radius = Math.min(width, height) / 2 - margin; // attach pie graph holder

    var svg = stateDisplay.append("svg").attr("id", "pie-graph").attr("width", width).attr("height", height).append("g").attr("transform", "translate(" + width / 2 + "," + (height / 2 + 15) + ")"); // attach slices holders for pie graph

    svg.append("g").attr("class", "slices"); // attach legend placeholder for piegraph

    stateDisplay.append('svg').attr("id", "legend").attr("dy", width); // create the first pie graph with transition

    pieGraph.update(data, svg, radius, state, stateDisplay);
  },
  createPieData: function createPieData(customArray, data) {
    var keys = customArray.map(function (el) {
      return data[el][1];
    });
    var vals = customArray.map(function (el) {
      return data[el][0];
    });
    var newData = [];
    keys.forEach(function (el, i) {
      newData.push({
        label: el,
        value: vals[i]
      });
    });
    return [newData, keys];
  },
  // DEFINE THIS
  mergeWithFirstEqualZero: function mergeWithFirstEqualZero(first, second) {
    var secondSet = d3.set();
    second.forEach(function (d) {
      secondSet.add(d.label);
    });
    var onlyFirst = first.filter(function (d) {
      return !secondSet.has(d.label);
    }).map(function (d) {
      return {
        label: d.label,
        value: 0
      };
    });
    var sortedMerge = d3.merge([second, onlyFirst]).sort(function (a, b) {
      return d3.ascending(a.label, b.label);
    });
    return sortedMerge;
  },
  // REFACTOR THIS
  update: function update(data, svg, radius, state, stateDisplay) {
    var choice = state.choice;
    var pie = d3.pie().sort(null).value(function (d) {
      return d.value;
    });
    var arc = d3.arc().outerRadius(radius * 1.0).innerRadius(radius * 0.0);
    var outerArc = d3.arc().innerRadius(radius * 0.5).outerRadius(radius * 1);
    var keys = data[1];
    data = data[0]; // hard coded to check for 'other' display

    var otherDisplay = false;
    if (data.length > 7) otherDisplay = true;
    var color = d3.scaleOrdinal(d3.schemePastel1.concat(d3.schemePastel1)).domain(keys);
    var duration = 500;
    var oldData = svg.select(".slices").selectAll("path").data().map(function (d) {
      return d.data;
    });
    if (oldData.length == 0) oldData = data;
    var was = pieGraph.mergeWithFirstEqualZero(data, oldData);
    var is = pieGraph.mergeWithFirstEqualZero(oldData, data);
    var slice = svg.select(".slices").selectAll("path").data(pie(was), function (d) {
      return d.data.label;
    });
    slice.enter().insert("path").attr("class", "slice").attr("id", function (d) {
      return d.data.label.replace(/[,\s]+/g, "");
    }).style("fill", function (d) {
      return color(d.data.label);
    }).each(function (d) {
      this._current = d;
    }).on("click", function (d) {
      hoverInfo.style("display", "none");
      d3.selectAll(".slice").style("stroke", "none").style("stroke-width", 0);

      if (d.data.label == "Other") {
        customArray = state.leftovers.map(function (el, i) {
          return i;
        });
        pieGraph.update(pieGraph.createPieData(customArray, state.leftovers), svg, radius, state, stateDisplay);
        stateDisplay.append("foreignObject").attr("id", "revert").attr("x", 75).attr("y", 300).attr("width", 60).attr("height", 20);
        stateDisplay.select("#revert").append("xhtml:button").attr("class", "rev").text("Revert").attr("x", 300).attr("dy", "1.2em").style("text-align", "center").attr("font-size", "12px").attr("font-weight", "bold").on("click", function (d) {
          stateDisplay.select("#revert").remove();
          stateDisplay.select("#other-display-select").remove();
          customArray = state.filtered.map(function (el, i) {
            return i;
          });
          data = pieGraph.createPieData(customArray, state.filtered);
          pieGraph.update(data, svg, radius, state, stateDisplay);
        });
      } else {
        hoverInfo.style("display", null);
        var xPosition = d3.mouse(this)[0] - 5;
        var yPosition = d3.mouse(this)[1] - 5;
        hoverInfo.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        hoverInfo.select("#hover-state-pop").text(d.value.toLocaleString());
        hoverInfo.select("#hover-state-name").text(d.data.label);
        d3.select("#" + d.data.label.replace(/[,\s]+/g, "")).style("stroke", "black").style("stroke-width", 2);
      }
    });
    slice = svg.select(".slices").selectAll("path").data(pie(is), function (d) {
      return d.data.label;
    });
    slice.transition().duration(duration).attrTween("d", function (d) {
      var interpolate = d3.interpolate(this._current, d);

      var _this = this;

      return function (t) {
        _this._current = interpolate(t);
        return arc(_this._current);
      };
    });
    slice = svg.select(".slices").selectAll("path").data(pie(data), function (d) {
      return d.data.label;
    });
    slice.exit().transition().delay(duration).duration(0).remove(); // make the legend for LAN7 and the top 5 LAN

    var legend = d3.select("#legend");
    legend.selectAll("circle").remove();

    if (!otherDisplay) {
      var mydots = legend.selectAll("mydots").data(keys) //data)
      .enter().append("circle").attr("class", "circle").attr("value", function (d) {
        d.replace(/[,\s]+/g, "");
      }).attr("cx", function (d, i) {
        if (i < 3) return 40;else return 200;
      }).attr("cy", function (d, i) {
        if (i < 3) return 265 + i * 25;else return 265 + (i - 3) * 25;
      }) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("r", 7).style("fill", function (d) {
        return color(d);
      }).on("click", function (d) {
        hoverInfo.style("display", "none");
        var val = d.replace(/[,\s]+/g, "");
        d3.selectAll(".slice").style("stroke", "none").style("stroke-width", 0);
        d3.select("#" + val).style("stroke", "black").style("stroke-width", 2);
      });
    }

    legend.selectAll("text").remove();

    if (!otherDisplay) {
      // Add one dot in the legend for each name.
      var mylabels = legend.selectAll("mylabels").data(keys) //data)
      .enter().append("text").attr("x", function (d, i) {
        if (i < 3) return 60;else return 220;
      }).attr("y", function (d, i) {
        if (i < 3) return 265 + i * 25;else return 265 + (i - 3) * 25;
      }) // 100 is where the first dot appears. 25 is the distance between dots
      .style("fill", "grey") //function(d){ return color(d)})
      .text(function (d) {
        return d;
      }).attr("text-anchor", "left").attr("font-size", "12px").style("alignment-baseline", "middle");
    } // make a select for the other display that
    // lists all the languages


    if (otherDisplay) {
      stateDisplay.append("foreignObject").attr("id", "other-display-select").attr("x", 75).attr("y", 270).attr("width", 250).attr("height", 250);
      var oDisplay = d3.select("#other-display-select");
      var opts = data.map(function (el) {
        return [el.label + " (" + (+el.value).toLocaleString() + ")", el.label];
      });
      oDisplay.append("xhtml:div").attr("id", "other-container");
      oDisplay.select("#other-container").append("xhtml:select").attr("id", "other-select");
      oDisplay.select("#other-select").selectAll("option").data(opts).enter().append("xhtml:option").text(function (d) {
        return d[0];
      }).attr("value", function (d) {
        return d[1];
      }).attr("class", "year");
      oDisplay.select("select").on("change", function (d) {
        hoverInfo.style("display", "none");
        var val = this.value.replace(/[,\s]+/g, "");
        d3.selectAll(".slice").style("stroke", "none").style("stroke-width", 0);
        d3.select("#" + val).style("stroke", "black").style("stroke-width", 2);
      });
    }

    svg.selectAll(".hover-info").remove(); // create hover info

    var hoverInfo = svg.append("g").attr("class", "hover-info").style("display", "none");
    var width, height, x, dy;

    if (choice == "LAN7") {
      width = 60;
      height = 20;
      x = 30;
      dy = "1.2em";
    } else if (choice == "LAN") {
      width = 90;
      height = 33;
      x = 45;
      dy = "2.2em";
    } // TASK 2: build rect display for the tool tip  


    hoverInfo.append("rect").attr("id", "hover-info-rect").attr("width", width).attr("height", height).attr("rx", 5).attr("ry", 5).attr("fill", "white").style("opacity", 1); // TASK 2: configure the text for the hoverInfo

    if (choice == "LAN") {
      hoverInfo.append("text").attr("id", "hover-state-name").attr("x", x).attr("dy", "1.2em").style("text-anchor", "middle").attr("font-size", "12px").attr("font-weight", "bold");
    }

    hoverInfo.append("text").attr("id", "hover-state-pop").attr("x", x).attr("dy", dy).style("text-anchor", "middle").attr("font-size", "12px").attr("font-weight", "bold");
  }
};
module.exports = pieGraph;

/***/ }),

/***/ "./app/javascript/packs/stateDisplay.js":
/*!**********************************************!*\
  !*** ./app/javascript/packs/stateDisplay.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var stateDisplay = {
  buildStateDisplay: function buildStateDisplay(svg, state, callback, pG, bG) {
    var stateDisplay = svg.append("g").attr("class", "state-display").style("display", "none"); // TASK 2: build rect display for the tool tip  

    stateDisplay.append("rect").attr("width", 0).attr("height", 0).attr("rx", 5).attr("ry", 5).attr("fill", "#fdfff7").style("opacity", 1); // TASK 2: configure the text for the stateDisplay

    stateDisplay.append("text").attr("class", "state-name").attr("x", 10).attr("dy", "1.2em").style("text-align", "center").attr("font-size", "12px").attr("font-weight", "bold"); // // TASK 2: configure the text for the stateDisplay

    stateDisplay.append("foreignObject").attr("id", "close").attr("x", 303).attr("y", 2).attr("width", 25).attr("height", 20);
    stateDisplay.select("#close").append("xhtml:button").attr("class", "exit") // stateDisplay.append("text")
    // 	.attr("class", "exit")
    .attr("x", 300).attr("dy", "1.2em").style("text-align", "center").attr("font-size", "12px").attr("font-weight", "bold");
    stateDisplay = this.createSelect(stateDisplay, state, callback, pG, bG);
    return stateDisplay;
  },
  stateDisplayEntrance: function stateDisplayEntrance(stateDisplay) {
    stateDisplay.select("rect").attr("width", 330).attr("height", 0);
    stateDisplay.select("text").style("display", "none");
    stateDisplay.select("select").style("display", "none");
    var s = d3.transition().delay(0).duration(300);
    stateDisplay.select("rect").transition(s).attr("height", 350);
    var s2 = d3.transition().delay(300).duration(0);
    stateDisplay.select("text").transition(s2).style("display", null);
    stateDisplay.select("select").transition(s2).style("display", null);
  },
  createSelect: function createSelect(object, state, callback, pG, bG) {
    var opts = [["Top 5 Langugages Plus More", "LAN"], ["Language Snapshot", "LAN7"], ["Language Major Categories", "LAN39"]]; // <foreignObject x="20" y="20" width="160" height="160">

    object.append("foreignObject").attr("id", "dropdown").attr("x", 75).attr("y", 20).attr("width", 250).attr("height", 250);
    object.select("#dropdown").append("xhtml:div").attr("id", "lan");
    object.select("#lan").append("xhtml:select").attr("id", "lan-select");
    object.select("select").selectAll("option").data(opts).enter().append("xhtml:option").text(function (d) {
      return d[0];
    }).attr("value", function (d) {
      return d[1];
    }).attr("class", "year");
    object.select("select").on("change", function (d) {
      var choice = $("#lan-select").val();
      state.choice = choice;
      object.selectAll(".hover-info").remove();
      object.select("#revert").remove();
      object.select("#other-display-select").remove();
      object.selectAll("#pie-graph").remove();
      object.selectAll("#legend").remove();
      object.selectAll(".bar-graph").remove();
      callback(state, choice).then(function (data) {
        // REFACTOR THIS
        state.data = data;
        object.selectAll("#pie-graph").remove();
        object.selectAll("#legend").remove();
        object.selectAll(".bar-graph").remove();
        if (choice == 'LAN7') pG.buildPieGraph(object, state, choice);else if (choice == 'LAN39') bG.buildBarGraph(object, state);else if (choice == 'LAN') {
          // remove headers and null values
          var preData = data.slice(1).filter(function (el) {
            return el[0] != null;
          });
          preData.sort(function (a, b) {
            return +b[0] - +a[0];
          }); // group into top 5 languages plus other

          var top5 = preData.slice(0, 5);
          var other = preData.slice(5);
          var otherVal = other.reduce(function (acc, cur) {
            return +cur[0] + acc;
          }, 0);
          var otherArray = [[otherVal].concat(['Other'])];
          var top5PlusOther = top5.concat(otherArray);
          state.filtered = top5PlusOther;
          state.leftovers = other;
          pG.buildPieGraph(object, state, choice);
        }
      });
    });
    return object;
  }
};
module.exports = stateDisplay;

/***/ }),

/***/ "./app/javascript/packs/usMap.js":
/*!***************************************!*\
  !*** ./app/javascript/packs/usMap.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var usMap = {
  buildMap: function buildMap(svg, path, colors) {
    return new Promise(function (resolve, reject) {
      d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json", function (error, us) {
        if (error) {
          reject(error);
        } else {
          // let s = this.transition(0, 0);
          var states = usMap.buildStates(svg, path, us, colors);
          var borders = usMap.buildBorders(svg, path, us);
          $("svg").height($("#container").width() * 0.618);
          resolve({
            svg: svg,
            states: states
          });
        }
      });
    });
  },
  // transition: function(delay, length) {
  //   return d3.transition()
  //     .delay(delay)
  //     .duration(length);
  // },
  buildStates: function buildStates(svg, path, us, colors) {
    var accent = d3.scaleOrdinal().range(colors).domain(_toConsumableArray(Array(50).keys()));
    return svg.append("g").attr("class", "states").selectAll("path").data(topojson.feature(us, us.objects.states).features).enter().append("path").attr("class", "state-shapes").attr("fill", function (d) {
      return "#f2f2f2";
    }).attr("d", path).attr("transform", "scale(" + $("#container").width() / 970 + ")");
  },
  buildBorders: function buildBorders(svg, path, us) {
    return svg.append("path").attr("class", "state-borders").attr("d", path(topojson.mesh(us, us.objects.states, function (a, b) {
      return a !== b;
    }))).attr("transform", "scale(" + $("#container").width() / 970 + ")");
  }
};
module.exports = usMap;

/***/ }),

/***/ "./node_modules/@babel/runtime/regenerator/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/regenerator/index.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! regenerator-runtime */ "./node_modules/regenerator-runtime/runtime.js");


/***/ }),

/***/ "./node_modules/regenerator-runtime/runtime.js":
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : undefined
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}


/***/ })

/******/ });
//# sourceMappingURL=censusData-0c0e90e722047d352ce2.js.map