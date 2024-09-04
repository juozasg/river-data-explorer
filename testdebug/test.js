console.log('hello from test.js');

export const test = async () =>  {
	const r = await fetch('http://localhost:8080/a');
	console.log('r', r);
	const j = await r.json();
	console.log('j', j);
}

// test();
