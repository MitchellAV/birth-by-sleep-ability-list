const express = require("express");
const router = express.Router();

const {
	generateNodeList,
	generateD3Json,
	getRoots
} = require("../utils/functions/generateNodeList");
// magic, attack, action, shotlock

router.get("/:char/:ability", (req, res) => {
	const nodeList = generateNodeList([req.params.char]);
	const ability = req.params.ability;

	const searchedNode = nodeList.find((node) => {
		return node.url == ability;
	});
	console.log(searchedNode);
	const d3Json = generateD3Json(searchedNode, nodeList);
	try {
		searchedNode.parents.forEach((recipe) => {
			recipe.children = null;
		});
	} catch (error) {}
	try {
		searchedNode.recipes.forEach((recipe) => {
			recipe.children = null;
		});
	} catch (error) {}

	res.render("./pages/ability", { data: d3Json, node: searchedNode });
});

router.get("/", (req, res) => {
	res.render("./pages/home", { data });
});

module.exports = router;
