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
/******/ 	return __webpack_require__(__webpack_require__.s = "./app/javascript/packs/stateDisplay.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/javascript/packs/stateDisplay.js":
/*!**********************************************!*\
  !*** ./app/javascript/packs/stateDisplay.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var stateDisplay = {
  buildStateDisplay: function buildStateDisplay(svg, state, callback, graph) {
    var stateDisplay = svg.append("g").attr("class", "state-display").style("display", "none"); // TASK 2: build rect display for the tool tip  

    stateDisplay.append("rect").attr("width", 0).attr("height", 0).attr("rx", 5).attr("ry", 5).attr("fill", "lightgrey").style("opacity", 1); // TASK 2: configure the text for the stateDisplay

    stateDisplay.append("text").attr("x", 10).attr("dy", "1.2em").style("text-align", "center").attr("font-size", "12px").attr("font-weight", "bold");
    stateDisplay = this.createSelect(stateDisplay, state, callback, graph);
    return stateDisplay;
  },
  stateDisplayEntrance: function stateDisplayEntrance(stateDisplay) {
    stateDisplay.select("rect").attr("width", 290).attr("height", 0);
    stateDisplay.select("text").style("display", "none");
    stateDisplay.select("select").style("display", "none");
    var s = d3.transition().delay(0).duration(300);
    stateDisplay.select("rect").transition(s).attr("height", 290);
    var s2 = d3.transition().delay(300).duration(0);
    stateDisplay.select("text").transition(s2).style("display", null);
    stateDisplay.select("select").transition(s2).style("display", null);
  },
  createSelect: function createSelect(object, state, callback, graph) {
    var opts = [["Language Snapshot", "LAN7"], ["Language families in 39 major categories", "LAN39"], ["Choose a detailed language", "LAN"]]; // <foreignObject x="20" y="20" width="160" height="160">

    object.append("foreignObject").attr("x", 20).attr("y", 20).attr("width", 250).attr("height", 250);
    object.select("foreignObject").append("xhtml:div").attr("id", "lan");
    object.select("#lan").append("xhtml:select").attr("id", "lan-select");
    object.select("select").selectAll("option").data(opts).enter().append("xhtml:option").text(function (d) {
      return d[0];
    }).attr("value", function (d) {
      return d[1];
    }).attr("class", "year");
    object.select("select").on("change", function (d) {
      var choice = $("#lan-select").val();
      callback(state, choice).then(function (data) {
        state.data = data;
        if (choice == 'LAN7') graph.buildPieGraph(object, state);
      });
    });
    return object;
  }
};
module.exports = stateDisplay;

/***/ })

/******/ });
//# sourceMappingURL=stateDisplay-3008b73621a9d8d7c474.js.map