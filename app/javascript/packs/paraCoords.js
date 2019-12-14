const paraCoords = {

	createTypes: function(innerHeight){
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

		return types;
	},
	createStateSet: function(langs){
		let allStates = langs.slice(1).map(el=> el[2]);
    //slice state det to display on ly certain slices of the states
    let stateSet = [...new Set(allStates)].sort();

    return stateSet;
	},

	createLangSet: function(langs){
		// create a set of languages ordered from most spoke in the US to least spoken
    let allLangs = langs.slice(1).map(el=> el[1]);
    let langSet = new Set(allLangs);

    // create a hash of languages with their totals, use this to sort
    let langOrd = {}
    langSet.forEach(el=>{
      langs.slice(1).forEach(el2=>{
        if(el == el2[1] && langOrd[el] == null)
          langOrd[el] = +el2[0];
        else if(el == el2[1])
          langOrd[el] += +el2[0];
      });      
    });
    
    //  build an array to sort language object
    let langOrdArr = [];
    for(var key in langOrd){
      langOrdArr.push([key, langOrd[key]]);
    }
    // sort the langugages
    langOrdArr.sort((a,b)=> +b[1] - +a[1]);
    // create an array of sroted langugages
    langSet = langOrdArr.map(el=> el[0]); 
    // SLICE TO DISPLAY
    return langSet = [...langSet];
	},

	createNewDataColl: function(stateSet, langSet, langs){
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

    return newDataCollection;
	},

	createDimensions: function(stateSet, langSet, types){
		let dimensions = [];

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

    // Have the languages reconnect to the final axis, similar to wear they start
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

    return dimensions;
	},

	buildParaCoords: function(measures, stateSet, langSet, dimensions, data){
    let margin = measures.mar,
    	width = measures.wid,
    	height = measures.hgt,
    	innerHeight = measures.inHgt,
    	devicePixelRatio = measures.dPixRat;

		var color = d3.scaleOrdinal()
      .domain(langSet)
      .range(["#DB7F85", "#50AB84", "#4C6C86", "#C47DCB", "#B59248", "#DD6CA7", "#E15E5A", "#5DA5B3", "#725D82", "#54AF52", "#954D56", "#8C92E8", "#D8597D", "#AB9C27", "#D67D4B", "#D58323", "#BA89AD", "#357468", "#8F86C2", "#7D9E33", "#517C3F", "#9D5130", "#5E9ACF", "#776327", "#944F7E"]);

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
// begin building with the data
let x;
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
    }

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

      ctx.clearRect(0,0,width,height);
      ctx.globalAlpha = d3.min([0.85/Math.pow(selected.length,0.3),1]);
      render(selected);

      output.text(d3.tsvFormat(selected.slice(0,24)));
    }


    function d3_functor(v) {
      return typeof v === "function" ? v : function() { return v; };
    };
	}
}

module.exports = paraCoords;
