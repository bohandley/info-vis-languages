const stateDisplay = {
	buildStateDisplay: function(svg, state, callback, pG, bG){
	  let stateDisplay = svg.append("g")
	    .attr("class", "state-display")
	    .style("display", "none");
	        
	  // TASK 2: build rect display for the tool tip  
	  stateDisplay.append("rect")
	    .attr("width", 0)
	    .attr("height", 0)
	    .attr("rx", 5)
	    .attr("ry", 5)
	    .attr("fill", "lightgrey")
	    .style("opacity", 1);

	  // TASK 2: configure the text for the stateDisplay
	  stateDisplay.append("text")
	    .attr("x", 10)
	    .attr("dy", "1.2em")
	    .style("text-align", "center")
	    .attr("font-size", "12px")
	    .attr("font-weight", "bold")

	  stateDisplay = this.createSelect(stateDisplay, state, callback, pG, bG);

	  return stateDisplay;
	},

	stateDisplayEntrance: function(stateDisplay) {
	  stateDisplay.select("rect")
	    .attr("width", 330)
	    .attr("height", 0)

	  stateDisplay.select("text")
	    .style("display", "none")

	  stateDisplay.select("select")
	    .style("display", "none")

	  let s = d3.transition()
	    .delay(0)
	    .duration(300);

	  stateDisplay.select("rect")
	    .transition(s)
	    .attr("height", 330)

	  let s2 = d3.transition()
	    .delay(300)
	    .duration(0);

	  stateDisplay.select("text")
	    .transition(s2)
	    .style("display", null)

	  stateDisplay.select("select")
	    .transition(s2)
	    .style("display", null)
	},

	createSelect: function(object, state, callback, pG, bG) {
    let opts = [
      ["Language Snapshot", "LAN7"],
      ["Language families in 39 major categories", "LAN39"],
      ["Choose a detailed language", "LAN"]
    ];

	  // <foreignObject x="20" y="20" width="160" height="160">
	  object.append("foreignObject")
	    .attr("x", 40)
	    .attr("y", 20)
	    .attr("width", 250)
	    .attr("height", 250)

	  object.select("foreignObject")
	    .append("xhtml:div")
	    .attr("id","lan")

	  object.select("#lan")
	    .append("xhtml:select")
	    .attr("id", "lan-select")

	  object.select("select")
	    .selectAll("option")
	    .data(opts)
	    .enter()
	    .append("xhtml:option")
	    .text(function(d){
	      return d[0];
	    })
	    .attr("value", function(d){
	      return d[1];
	    })
	    .attr("class", "year");

	  object.select("select")
	    .on("change", function(d) {
	    	let choice = $("#lan-select").val();

        object.selectAll("#pie-graph").remove();
        object.selectAll("#legend").remove();
        object.selectAll(".bar-graph").remove();

	      callback(state, choice)
	        .then(data=>{
	          state.data = data;




	          if(choice == 'LAN7')
	          	pG.buildPieGraph(object, state)
	          else if(choice == 'LAN39')
	          	bG.buildBarGraph(object, state)
	        });
	    });

	  return object;
	}
};

module.exports = stateDisplay;