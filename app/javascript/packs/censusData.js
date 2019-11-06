$(document).ready(function() {

  async function callCensusData(url, opts, params={}) {
  	const response = await fetch(url, opts);
  	const myJson = await response.json();
  	console.log(response);
  	console.log(JSON.stringify(myJson));
  }

  let opts = {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': window._token
      },
      body: JSON.stringify({}) // body data type must match "Content-Type" header
  };

  callCensusData("/data", opts);

  var svg = d3.select("svg");

  var path = d3.geoPath();

  d3.json("https://d3js.org/us-10m.v1.json", function(error, us) {
    if (error) throw error;
    console.log(us)
    svg.append("g")
        .attr("class", "states")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.states).features)
      .enter().append("path")
        .attr("d", path);

    svg.append("path")
        .attr("class", "state-borders")
        .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })));
  });
});