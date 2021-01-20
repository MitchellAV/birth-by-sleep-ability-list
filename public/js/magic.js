const recipes = [];
let header = {};
const rows = document.querySelectorAll("tr");
rows.forEach((row, key) => {
	const b = row.querySelectorAll("td")[0].innerText;
	const a1 = row.querySelectorAll("td")[1].innerText;
	const a2 = row.querySelectorAll("td")[2].innerText;
	const type = row.querySelectorAll("td")[3].innerText;
	const chance = row.querySelectorAll("td")[5].innerText;
	let chars = [];
	if (key == 0) {
		chars = row.querySelectorAll("td")[4].innerText;
		header = { b, a1, a2, type, chars, chance };
	} else {
		const charImgs = row.querySelectorAll("td")[4].querySelectorAll("img");
		charImgs.forEach((char) => {
			const name = char.src.split("/")[4];
			switch (name) {
				case "dlterra1.png":
					chars.push("terra");
					break;
				case "dlventus1.png":
					chars.push("ventus");
					break;
				case "dlaqua1.png":
					chars.push("aqua");
					break;
				case "blank.png":
					break;

				default:
					break;
			}
		});
		const recipe = { b, a1, a2, type, chars, chance };
		recipes.push(recipe);
	}
});

axios
	.post("/magic", {
		header: header,
		recipes: recipes
	})
	.then(
		(response) => {
			console.log(response);
		},
		(error) => {
			console.log(error);
		}
	);
