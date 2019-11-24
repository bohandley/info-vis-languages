const barGraph = {
	buildBarGraph: function(stateDisplay, state){
		var rects = stateDisplay.selectAll('rect')
			.data(state.data.slice(1))
	    	.enter()
	        .append("rect")
			.attr("class", "bar-graph")
			.attr("transform", "translate(0, 20)")
			.attr("x", 10)
			.attr("y", function(d, i) {
				return 10 + i * (10 + 10);
				// return padding + i * (barHeight + padding);
			})
			.attr("height", 15)
			.style("fill", "orange");
	
		var s = d3.transition()
			.delay(1000)
			.duration(1000);

		rects
			.transition(s)
			.attr("width", function(d, i) { 
				return d[0] * .001;
			});	

		var texts = stateDisplay.selectAll('text')
			.data(state.data.slice(1))
			.enter().append("text")
			.attr("class", "bar-graph")
			.attr("transform", "translate(0, 20)")
			.attr('x', 10)
			.attr('y', function(d, i) {
				return (i + 1) * (10 + 10);
			})
			.attr('font-size', 12)
			.text(function(d) {
				return d[1];
			});
	}

		
};

module.exports = barGraph;