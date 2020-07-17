let alphabet = ["A", "B", "C", "D", "E", "F", "G", "H"];

document.querySelector(".add-row").onclick = function () {
	let table = document.querySelector("tbody");
	if (table.querySelectorAll("tr").length < 5) {
		let colCount = document.querySelector("tr").querySelectorAll("th").length;
		let row = document.createElement("TR");
		
		for (let i = 0; i < colCount; i++) {
			let td = addCell();
			if (i < colCount - 1) td.appendChild(addSelect());
			row.appendChild(td);
		}

		table.appendChild(row);
	}
	if (table.querySelectorAll("tr").length == 5) document.querySelector(".add-row").disabled = true;
	document.querySelector(".del-row").disabled = false;
};

document.querySelector(".add-var").onclick = function () {
	let vars = document.querySelectorAll("th");
	lastVar = vars[vars.length - 2];

	if (lastVar.innerHTML != alphabet[alphabet.length - 1]) {
		let headRow = document.querySelector("tr");

		let newCell = document.createElement("TH");
		newCell.innerHTML = alphabet[alphabet.indexOf(lastVar.innerHTML) + 1];

		lastVar.after(newCell);

		let rows = document.querySelector("tbody").querySelectorAll("tr");

		for (let i = 0; i < rows.length; i++) {
			let row = rows[i];
			let lastChild = row.lastElementChild;
			
			if (lastChild.cellIndex < vars.length) {
				let td = addCell();
				td.appendChild(addSelect());
				lastChild.before(td);
			}
		}
	}
	if (lastVar.innerHTML == alphabet[alphabet.length - 2]) document.querySelector(".add-var").disabled = true;
	document.querySelector(".del-var").disabled = false;
};

document.querySelector(".del-row").onclick = function () {
	let rows = document.querySelector("tbody").querySelectorAll("tr");

	if (rows.length == 2) document.querySelector(".del-row").disabled = true;
	rows[rows.length - 1].remove();

	document.querySelector(".add-row").disabled = false;
};

document.querySelector(".del-var").onclick = function () {
	let th = document.querySelectorAll("th");
	if (th.length == 4) document.querySelector(".del-var").disabled = true;

	th[th.length - 2].remove();

	let rows = document.querySelector("tbody").querySelectorAll("tr");
	for (let i = 0; i < rows.length; i++) {
		let td = rows[i].querySelectorAll("td");
		td[td.length - 2].remove();
	}

	document.querySelector(".add-var").disabled = false;
};

function addCell() {
	let td = document.createElement("TD");
	return td;
}

function addSelect() {
	let optionFalse = document.createElement("OPTION");
	optionFalse.innerHTML = 0;

	let optionTrue = document.createElement("OPTION");
	optionTrue.innerHTML = 1;
	
	let select = document.createElement("SELECT");
	
	select.appendChild(optionFalse);
	select.appendChild(optionTrue);

	return select;
}

document.addEventListener("keypress", function () {
	if (event.keyCode == 13) {
		try {
			let rows = document.querySelector("tbody").querySelectorAll("tr");
			let varsName = document.querySelectorAll("th");

			for (let i = 0; i < rows.length; i++) {
				row = rows[i].querySelectorAll("td");

				let expression = document.querySelector("input").value;
				expression = expression.replace(/[*]/g, "&&");
				expression = expression.replace(/[+]/g, "||");
				expression = expression.toUpperCase();

				varsName[varsName.length - 1].innerHTML = expression;
				
				let vars = new Map();
				for (let j = 0; j < row.length - 1; j++) {
					name = varsName[j].innerHTML;
					vars.set(name, row[j].querySelector("select").value);
					while (expression.indexOf(name) != -1) {
						expression = expression.replace(name, vars.get(name) == 1 ? true : false);
					}
				}

				row[row.length - 1].innerHTML = eval(expression) == true ? 1 : 0;
			}
		} catch (e) {
			alert(e);
		}
	}
});