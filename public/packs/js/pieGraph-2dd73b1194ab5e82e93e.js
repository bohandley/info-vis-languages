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
/******/ 	return __webpack_require__(__webpack_require__.s = "./app/javascript/packs/pieGraph.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/javascript/packs/pieGraph.js":
/*!******************************************!*\
  !*** ./app/javascript/packs/pieGraph.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var pieGraph = {
  buildPieGraph: function buildPieGraph(stateDisplay, state, choice) {
    var customArray, colorRange, data;

    if (choice == 'LAN7') {
      customArray = [4, 5, 6];
      colorRange = ["#8a89a6", "#7b6888", "#6b486b"];
      data = this.createPieData(customArray, state.data);
    } else if (choice == 'LAN') {
      customArray = state.filtered.map(function (el, i) {
        return i;
      });
      colorRange = ['#AFB42B', '#9E9D24', '#827717', '#F4FF81', '#EEFF41'];
      data = this.createPieData(customArray, state.filtered);
    }

    var keys = data[1];
    data = data[0];

    function makeData() {
      var data = Array();

      for (i = 0; i < keys.length; i++) {
        if (Math.random() < 0.7) {
          var ob = {};
          ob["label"] = keys[i];
          ob["value"] = randomCount(1, 100);
          data.push(ob);
        }
      }

      var sortedData = data.sort(function (a, b) {
        return d3.ascending(a.label, b.label);
      });
      return sortedData;
    }

    function randomCount(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    var t = makeData(); // set the dimensions and margins of the graph

    var width = 330,
        height = 270,
        margin = 40;
    var radius = Math.min(width, height) / 2 - margin;
    var svg = stateDisplay.append("svg").attr("id", "pie-graph").attr("width", width).attr("height", height).append("g").attr("transform", "translate(" + width / 2 + "," + (height / 2 + 15) + ")");
    svg.append("g").attr("class", "slices");
    var pie = d3.pie().sort(null).value(function (d) {
      return d.value;
    });
    var arc = d3.arc().outerRadius(radius * 1.0).innerRadius(radius * 0.0);
    var outerArc = d3.arc().innerRadius(radius * 0.5).outerRadius(radius * 1);

    var key = function key(d) {
      return d.data.label;
    };

    var color = d3.scaleOrdinal(d3.schemePastel1).domain(keys);
    update(data); // var inter = setInterval(function() {
    //   update(data);
    // }, 2000);

    function mergeWithFirstEqualZero(first, second) {
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
    }

    function update(data) {
      var duration = 500;
      var oldData = svg.select(".slices").selectAll("path").data().map(function (d) {
        return d.data;
      });
      if (oldData.length == 0) oldData = data;
      var was = mergeWithFirstEqualZero(data, oldData);
      var is = mergeWithFirstEqualZero(oldData, data);
      var slice = svg.select(".slices").selectAll("path").data(pie(was), key);
      slice.enter().insert("path").attr("class", "slice").style("fill", function (d) {
        return color(d.data.label);
      }).each(function (d) {
        this._current = d;
      }).on("click", function (d) {
        hoverInfo.style("display", "none");
        hoverInfo.style("display", null);
        var xPosition = d3.mouse(this)[0] - 5;
        var yPosition = d3.mouse(this)[1] - 5;
        hoverInfo.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        hoverInfo.select("text").text(d.value);
      });
      slice = svg.select(".slices").selectAll("path").data(pie(is), key);
      slice.transition().duration(duration).attrTween("d", function (d) {
        var interpolate = d3.interpolate(this._current, d);

        var _this = this;

        return function (t) {
          _this._current = interpolate(t);
          return arc(_this._current);
        };
      });
      slice = svg.select(".slices").selectAll("path").data(pie(data), key);
      slice.exit().transition().delay(duration).duration(0).remove();
    }

    ; //  // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    //  var radius = Math.min(width, height) / 2 - margin;
    //  // append the svg object to the div called 'my_dataviz'
    //  var svg = stateDisplay
    //    .append("svg")
    //      .attr("id", "pie-graph")
    //      .attr("width", width)
    //      .attr("height", height)
    //    .append("g")
    //      .attr("transform", "translate(" + width / 2 + "," + ((height / 2) + 15) + ")");
    //  let customArray, colorRange, data;
    //  if(choice == 'LAN7'){
    //  	customArray = [4,5,6];
    //  	colorRange = ["#8a89a6", "#7b6888", "#6b486b"];
    //  	data = this.createPieData(customArray, state.data);
    //  } else if(choice == 'LAN'){
    //  	customArray = state.filtered.map((el,i)=> i);
    //  	colorRange = ['#AFB42B',
    // 		'#9E9D24',
    // 		'#827717',
    // 		'#F4FF81',
    // 		'#EEFF41',
    // 	];
    // 	data = this.createPieData(customArray, state.filtered);
    //  }
    // let keys = data[1];
    // data = data[0];
    //  // set the color scale
    //  var color = d3.scaleOrdinal()
    //    .domain(data)
    //    .range(colorRange);
    //  // Compute the position of each group on the pie:
    //  var pie = d3.pie()
    //    .value(function(d) {return d.value; });
    //  var data_ready = pie(d3.entries(data));
    //  // make this into a function to rebuild the graph every time USCensu is called
    //  // setTimeout(function(){ 
    //  svg
    //    .selectAll('whatever')
    //    .data(data_ready)
    //    .enter()
    //    .append('path')
    //    .attr('d', d3.arc()
    //      .innerRadius(0)
    //      .outerRadius(radius)
    //    )
    //    .attr('fill', function(d){ return(color(d.data.key)) })
    //    .attr("stroke", "black")
    //    .style("stroke-width", "1px")
    //    .on("click", function(d) {
    //        hoverInfo.style("display", "none");
    //        hoverInfo.style("display", null);
    //        var xPosition = d3.mouse(this)[0] - 5;
    //        var yPosition = d3.mouse(this)[1] - 5;
    //        hoverInfo.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
    //        hoverInfo.select("text").text(d.value);
    //    });

    stateDisplay.append('svg').attr("id", "legend").attr("dy", width); // .attr("height", height)
    // Add one dot in the legend for each name.

    var legend = d3.select("#legend");
    legend.selectAll("mydots").data(keys) //data)
    .enter().append("circle").attr("class", "circle").attr("cx", function (d, i) {
      if (i < 3) return 40;else return 200;
    }).attr("cy", function (d, i) {
      if (i < 3) return 265 + i * 25;else return 265 + (i - 3) * 25;
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 7).style("fill", function (d) {
      return color(d);
    }); // Add one dot in the legend for each name.

    legend.selectAll("mylabels").data(keys) //data)
    .enter().append("text").attr("x", function (d, i) {
      if (i < 3) return 60;else return 220;
    }).attr("y", function (d, i) {
      if (i < 3) return 265 + i * 25;else return 265 + (i - 3) * 25;
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", "grey") //function(d){ return color(d)})
    .text(function (d) {
      return d;
    }).attr("text-anchor", "left").attr("font-size", "12px").style("alignment-baseline", "middle"); // .style("opacity", 0.7)
    // create hover info

    var hoverInfo = svg.append("g").attr("class", "hover-info").style("display", "none"); // TASK 2: build rect display for the tool tip  

    hoverInfo.append("rect").attr("width", 60).attr("height", 20).attr("rx", 5).attr("ry", 5).attr("fill", "white").style("opacity", 1); // TASK 2: configure the text for the hoverInfo

    hoverInfo.append("text").attr("x", 30).attr("dy", "1.2em").style("text-anchor", "middle").attr("font-size", "12px").attr("font-weight", "bold");
  },
  createPieData: function createPieData(customArray, data) {
    // var //key1 = state.data[2][1], 
    //    key2 = state.data[4][1],
    //    key3 = state.data[5][1],
    //    key4 = state.data[6][1];
    //  var keys = [key2, key3, key4];
    //  var //val1 = state.data[2][0],
    //    val2 = state.data[4][0],
    //    val3 = state.data[5][0],
    //    val4 = state.data[6][0];
    //  var vals = [val2, val3, val4];
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
  }
};
module.exports = pieGraph;

/***/ })

/******/ });
//# sourceMappingURL=pieGraph-2dd73b1194ab5e82e93e.js.map