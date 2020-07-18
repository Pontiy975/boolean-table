document.querySelector("input").focus();

document.querySelector("button").onclick = function() {

	let variables = unique(Array.from(document.querySelector("input").value.replace(/\W/g, "")));
	if (variables+"".search(/[^а-я]/i) != -1) {
		if (document.querySelector("table") != null) document.querySelector("table").remove();
		createTABLE(variables.length, variables);
		calculate();
	}
	else {
		alert('Invalid Input!');
	}
}

document.addEventListener("keypress", function (event) {
	if (event.keyCode == 13) {
		let variables = unique(Array.from(document.querySelector("input").value.replace(/\W/g, "")));
		if (variables+"".search(/[^а-я]/i) != -1) {
			if (document.querySelector("table") != null) document.querySelector("table").remove();
			createTABLE(variables.length, variables);
			calculate();
		}
		else {
			alert('Invalid Input!');
		}
	}
});

function createTABLE(colCount, variables) {
	let table = document.createElement("TABLE");
	
	let thead = document.createElement("THEAD");
	thead.appendChild(createTR(colCount, true));

	let tbody = document.createElement("TBODY");

	for (let i = 0; i < Math.pow(2, colCount); i++) {
		tbody.appendChild(createTR(colCount));
	}

	table.appendChild(thead);
	table.appendChild(tbody);
	document.querySelector(".container").appendChild(table);

	let headers = thead.querySelectorAll("th");
	for (let i = 0; i < headers.length - 1; i++) {
		headers[i].innerHTML = variables[i];
	}

	let rows = tbody.querySelectorAll("tr");
	let values = generate_number(rows.length, colCount);

	for (let i = 0; i < rows.length; i++) {
		let cells = rows[i].querySelectorAll("td");
		for (let j = 0; j < cells.length - 1; j++) {
			cells[j].innerHTML = values[i][j];
		}
	}

	headers[headers.length - 1].innerHTML = document.querySelector("input").value;
}

function createTR(colCount, isHead = false) {
	let tr = document.createElement("TR");

	for (let i = 0; i <= colCount; i++) {
		if (isHead) tr.appendChild(document.createElement("TH"));
		else tr.appendChild(document.createElement("TD"));
	}

	return tr;
}

function unique(arr) {
	let result = [];

	for (let str of arr)
		if (!result.includes(str)) result.push(str);

	return result;
}

function generate_number(n, m, prefics=[], result=[])
{
	prefics = prefics || [];
	result = result || [];

	if(m == 0) {
		// console.log(prefics);
		result.push(prefics.map(value => value));
		return;
	}

	for(let i = 0; i <= 1; i++) {
		prefics.push(i);
		generate_number(n, m - 1, prefics, result);
		prefics.pop();
	}
	return result;
}

function calculate() {
	let rows = document.querySelector("tbody").querySelectorAll("tr");
	let varsName = document.querySelectorAll("th");

	for (let i = 0; i < rows.length; i++) {
		row = rows[i].querySelectorAll("td");

		let expression = document.querySelector("input").value;
		expression = expression.replace(/[=]/g, "==");
		if (expression.search(/\w!\w/g) != -1) {
			let sub = expression.substr(expression.search(/\w!\w/g), 3);
			sub = sub.replace(/[!]/g, "!=");
			expression = expression.replace(/\w!\w/g, sub);
		}
		
		let vars = new Map();
		for (let j = 0; j < row.length - 1; j++) {
			name = varsName[j].innerHTML;
			vars.set(name, row[j].innerHTML);

			var r = new RegExp(name, 'g');

			expression = expression.replace(r, vars.get(name) == 1 ? true : false);
			console.log('!!'+expression);
		}
		try {
			row[row.length - 1].innerHTML = eval(`!!(${expression})`) == true ? 1 : 0;
		} catch (e) {
			if (e instanceof ReferenceError) {
			    alert('ReferenceError');
			    document.querySelector("table").remove();
			    break;
			}
		}
	}
}