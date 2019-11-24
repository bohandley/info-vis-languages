const usMap = {
	buildMap: function(svg, path, colors) {
	  return new Promise(function(resolve, reject) {
	    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json", function(error, us) {
	      if (error) {
	        reject(error);
	      } else {

	        // let s = this.transition(0, 0);

	        let states = usMap.buildStates(svg, path, us, colors);          

	        let borders = usMap.buildBorders(svg, path, us);

	        $("svg").height($("#container").width()*0.618);

	        resolve({svg: svg, states: states})
	      }
	    });
	  });
	},

	// transition: function(delay, length) {
	//   return d3.transition()
	//     .delay(delay)
	//     .duration(length);
	// },

	buildStates: function(svg, path, us, colors) {
	  let accent = d3.scaleOrdinal()
	    .range(colors)
	    .domain([...Array(50).keys()]);
	  
	  return svg.append("g")
	      .attr("class", "states")
	      
	    .selectAll("path")
	    .data(topojson.feature(us, us.objects.states).features)
	    .enter().append("path")
	    	.attr("class", "state-shapes")
	      .attr("fill", function(d) { 
	      	return "#00acc1";
	        // return accent(d.id);
	      })
	      .attr("d", path)
	      .attr("transform", "scale(" + $("#container").width()/970 + ")");
	},

	buildBorders: function(svg, path, us) {
	  return svg.append("path")
	    .attr("class", "state-borders")
	    .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })))
	    .attr("transform", "scale(" + $("#container").width()/970 + ")");
	},
};

module.exports = usMap;