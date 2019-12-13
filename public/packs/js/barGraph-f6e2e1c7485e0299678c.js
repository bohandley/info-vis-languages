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
/******/ 	return __webpack_require__(__webpack_require__.s = "./app/javascript/packs/barGraph.js");
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

/***/ })

/******/ });
//# sourceMappingURL=barGraph-f6e2e1c7485e0299678c.js.map