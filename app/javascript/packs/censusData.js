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
