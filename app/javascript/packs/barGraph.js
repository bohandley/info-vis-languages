const barGraph = {
	buildBarGraph: function(stateDisplay, state){

		var data = state.data.slice(1).sort((a,b)=> +b[0] - +a[0]);

		var greatestPop = data[0][0];
		
		var widthScale = d3.scaleLog()
			.domain([1, greatestPop])
			.range([0, 300]);

		var color = d3.scaleOrdinal(d3.schemePastel1.concat(d3.schemePastel1))
		    .domain(data.map(el=> el[1]));

			// .attr("height", function(d) {return myscale(d);})

		var rects = stateDisplay.selectAll('this')
			.data(data)
	    	.enter()
	        .append("rect")
			.attr("class", "bar-graph")
			.attr("transform", "translate(0, 40)")
			.attr("x", 10)
			.attr("y", function(d, i) {
				return 10 + i * (10 + 10);
				// return padding + i * (barHeight + padding);
			})
			.attr("height", 15)
			.style("fill", (d,i)=> color(i))
			.on("click", function(d){
				hoverInfo.style("display", null);
        var xPosition = d3.mouse(this)[0] - 5;
        var yPosition = d3.mouse(this)[1] - 5 + 40;
        hoverInfo.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        hoverInfo.select("#hover-state-pop").text(d[0]);
        
			});
	
		var s = d3.transition()
			.delay(1000)
			.duration(1000);

		rects
			.transition(s)
			.attr("width", (d) => widthScale(d[0]));	

		var texts = stateDisplay.selectAll('thing')
			.data(data)
			.enter().append("text")
			.attr("class", "bar-graph")
			.attr("transform", "translate(0, 40)")
			.attr('x', 10)
			.attr('y', function(d, i) {
				return (i + 1) * (10 + 10);
			})
			.attr('font-size', 12)
			.text(function(d) {
				return d[1];
			})
			.on("click", function(d){
				hoverInfo.style("display", null);
        var xPosition = d3.mouse(this)[0] - 5;
        var yPosition = d3.mouse(this)[1] - 5 + 40;
        hoverInfo.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        hoverInfo.select("#hover-state-pop").text(d[0]);
			});

		stateDisplay.selectAll(".hover-info").remove();
	   	  // create hover info
	  var hoverInfo = stateDisplay.append("g")
	    .attr("class", "hover-info")
	    .style("display", "none");
		      
	  let width, height, x, dy;
	  
	  // if(choice=="LAN7"){
	  	width = 60;
	  	height = 20;
	  	x = 30;
	  	dy = "1.2em"; 
	  // } else if(choice=="LAN"){
	  // 	width = 90;
	  // 	height = 33;
	  // 	x = 45;
	  // 	dy = "2.2em";
	  // }
	  // TASK 2: build rect display for the tool tip  
	  hoverInfo.append("rect")
	  	.attr("id", "hover-info-rect")
	    .attr("width", width)
	    .attr("height", height)
	    .attr("rx", 5)
	    .attr("ry", 5)
	    .attr("fill", "white")
	    .style("opacity", 1);

	  // // TASK 2: configure the text for the hoverInfo
	  // if(choice=="LAN"){
		 //  hoverInfo.append("text")
		 //  	.attr("id", "hover-state-name")
		 //    .attr("x", x)
		 //    .attr("dy", "1.2em")
		 //    .style("text-anchor", "middle")
		 //    .attr("font-size", "12px")
		 //    .attr("font-weight", "bold");
	  // }

	  hoverInfo.append("text")
	  	.attr("id", "hover-state-pop")
	    .attr("x", x)
	    .attr("dy", dy)
	    .style("text-anchor", "middle")
	    .attr("font-size", "12px")
	    .attr("font-weight", "bold");
	}

		
};

module.exports = barGraph;