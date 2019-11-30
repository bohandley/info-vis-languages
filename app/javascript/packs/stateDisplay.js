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
	    .attr("fill", "#fdfff7")
	    .style("opacity", 1);

	  // TASK 2: configure the text for the stateDisplay
	  stateDisplay.append("text")
	  	.attr("class", "state-name")
	    .attr("x", 10)
	    .attr("dy", "1.2em")
	    .style("text-align", "center")
	    .attr("font-size", "12px")
	    .attr("font-weight", "bold")

	  // // TASK 2: configure the text for the stateDisplay
	  stateDisplay.append("foreignObject")
	  	.attr("id", "close")
	    .attr("x", 303)
	    .attr("y", 2)
	    .attr("width", 25)
	    .attr("height", 20)

	  stateDisplay.select("#close")
	    .append("xhtml:button")
	    .attr("class","exit")
	  // stateDisplay.append("text")
	  // 	.attr("class", "exit")
	    .attr("x", 300)
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
	    .attr("height", 350)

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
      ["Top 5 Langugages Plus More", "LAN"],
      ["Language Snapshot", "LAN7"],
      ["Language Major Categories", "LAN39"]
    ];

	  // <foreignObject x="20" y="20" width="160" height="160">
	  object.append("foreignObject")
	  	.attr("id", "dropdown")
	    .attr("x", 75)
	    .attr("y", 20)
	    .attr("width", 250)
	    .attr("height", 250)

	  object.select("#dropdown")
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
	    	state.choice = choice;

	    	object.selectAll(".hover-info").remove();
	    	object.select("#revert").remove();
	    	object.select("#other-display-select").remove();
        object.selectAll("#pie-graph").remove();
        object.selectAll("#legend").remove();
        object.selectAll(".bar-graph").remove();

	      callback(state, choice)
	        .then(data=>{
	        	// REFACTOR THIS
	          state.data = data;


	          object.selectAll("#pie-graph").remove();
				    object.selectAll("#legend").remove();
				    object.selectAll(".bar-graph").remove();

	          if(choice == 'LAN7')
	          	pG.buildPieGraph(object, state, choice)
	          else if(choice == 'LAN39')
	          	bG.buildBarGraph(object, state)
	          else if(choice == 'LAN'){
	          	// remove headers and null values
	          	let preData = data.slice(1).filter(el=> el[0] != null)

	          	preData.sort((a,b) => +b[0] - +a[0]);
            	// group into top 5 languages plus other
	            let top5 = preData.slice(0,5);
	            let other = preData.slice(5);

	            let otherVal = other.reduce((acc, cur)=> +cur[0] + acc, 0)
	            let otherArray = [[otherVal].concat(['Other'])];

	            let top5PlusOther = top5.concat(otherArray);

	            state.filtered = top5PlusOther;

	            state.leftovers = other;
	            
	            pG.buildPieGraph(object, state, choice);
            }
	        });
	    });

	  return object;
	},
};

module.exports = stateDisplay;