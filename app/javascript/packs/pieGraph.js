const pieGraph = {
	buildPieGraph: function(stateDisplay, state) {
	  // set the dimensions and margins of the graph
	  var width = 330,
	      height = 270,
	      margin = 40;

	  // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
	  var radius = Math.min(width, height) / 2 - margin;

	  // append the svg object to the div called 'my_dataviz'
	  var svg = stateDisplay
	    .append("svg")
	      .attr("id", "pie-graph")
	      .attr("width", width)
	      .attr("height", height)
	    .append("g")
	      .attr("transform", "translate(" + width / 2 + "," + ((height / 2) + 15) + ")");

	  // create real data
	  var //key1 = state.data[2][1], 
	    key2 = state.data[4][1],
	    key3 = state.data[5][1],
	    key4 = state.data[6][1];

	  var keys = [key2, key3, key4];

	  var //val1 = state.data[2][0],
	    val2 = state.data[4][0],
	    val3 = state.data[5][0],
	    val4 = state.data[6][0];

	  var vals = [val2, val3, val4];

	  var data = {};

	  keys.forEach((el, i)=>{
	    data[el] = vals[i];
	  })
	  
	  // set the color scale
	  var color = d3.scaleOrdinal()
	    .domain(data)
	    .range(["#8a89a6", "#7b6888", "#6b486b"]);

	  // Compute the position of each group on the pie:
	  var pie = d3.pie()
	    .value(function(d) {return d.value; });

	  var data_ready = pie(d3.entries(data));

	  // make this into a function to rebuild the graph every time USCensu is called
	  // setTimeout(function(){ 
	  svg
	    .selectAll('whatever')
	    .data(data_ready)
	    .enter()
	    .append('path')
	    .attr('d', d3.arc()
	      .innerRadius(0)
	      .outerRadius(radius)
	    )
	    .attr('fill', function(d){ return(color(d.data.key)) })
	    .attr("stroke", "black")
	    .style("stroke-width", "1px")
	    .on("click", function(d) {
	        hoverInfo.style("display", "none");
	        hoverInfo.style("display", null);
	        var xPosition = d3.mouse(this)[0] - 5;
	        var yPosition = d3.mouse(this)[1] - 5;
	        hoverInfo.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
	        hoverInfo.select("text").text(d.value);
	    });

	  stateDisplay.append('svg')
	    .attr("id", "legend")
	    .attr("dy", width)
	      // .attr("height", height)
	  // Add one dot in the legend for each name.
	  var legend = d3.select("#legend")

	  legend.selectAll("mydots")
	    .data(keys)//data)
	    .enter()
	    .append("circle")
	      .attr("class", "circle")
	      .attr("cx", 40)
	      .attr("cy", function(d,i){ return 265 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
	      .attr("r", 7)
	      .style("fill", function(d){ return color(d)})

	  // Add one dot in the legend for each name.
	  legend.selectAll("mylabels")
	    .data(keys)//data)
	    .enter()
	    .append("text")
	      .attr("x", 60)
	      .attr("y", function(d,i){ return 265 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
	      .style("fill", function(d){ return color(d)})
	      .text(function(d){ return d})
	      .attr("text-anchor", "left")
	      .attr("font-size", "12px")
	      .style("alignment-baseline", "middle")
	      // .style("opacity", 0.7)

	  // create hover info
	  var hoverInfo = svg.append("g")
	    .attr("class", "hover-info")
	    .style("display", "none");
	      
	  // TASK 2: build rect display for the tool tip  
	  hoverInfo.append("rect")
	    .attr("width", 60)
	    .attr("height", 20)
	    .attr("rx", 5)
	    .attr("ry", 5)
	    .attr("fill", "white")
	    .style("opacity", 1);

	  // TASK 2: configure the text for the hoverInfo
	  hoverInfo.append("text")
	    .attr("x", 30)
	    .attr("dy", "1.2em")
	    .style("text-anchor", "middle")
	    .attr("font-size", "12px")
	    .attr("font-weight", "bold");

	}
};

module.exports = pieGraph;
