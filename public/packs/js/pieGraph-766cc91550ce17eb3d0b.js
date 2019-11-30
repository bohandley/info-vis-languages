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
        hoverInfo.select("#hover-state-pop").text(d.value);
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
        return [el.label + " (" + el.value + ")", el.label];
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

/***/ })

/******/ });
//# sourceMappingURL=pieGraph-766cc91550ce17eb3d0b.js.map