const express = require("express");
const fs = require("fs");

const router = express.Router();

router.post("/attack", (req, res) => {
	console.log(req.body);
	var fileContent = req.body;

	fs.writeFile("./attack.json", JSON.stringify(fileContent), (err) => {
		if (err) {
			console.error(err);
			return;
		}
		console.log("File has been created");
	});
	res.end();
});
router.post("/magic", (req, res) => {
	console.log(req.body);
	var fileContent = req.body;

	fs.writeFile("./magic.json", JSON.stringify(fileContent), (err) => {
		if (err) {
			console.error(err);
			return;
		}
		console.log("File has been created");
	});
	res.end();
});
router.post("/action", (req, res) => {
	console.log(req.body);
	var fileContent = req.body;

	fs.writeFile("./action.json", JSON.stringify(fileContent), (err) => {
		if (err) {
			console.error(err);
			return;
		}
		console.log("File has been created");
	});
	res.end();
});
router.post("/shotlock", (req, res) => {
	console.log(req.body);
	var fileContent = req.body;

	fs.writeFile("./shotlock.json", JSON.stringify(fileContent), (err) => {
		if (err) {
			console.error(err);
			return;
		}
		console.log("File has been created");
	});
	res.end();
});

module.exports = router;
