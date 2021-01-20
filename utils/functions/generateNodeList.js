const Recipe = require("../classes/recipe");
const Node = require("../classes/node");
const { json } = require("d3");

const isNodeIncluded = (node, array) => {
	let found = false;
	for (let i = 0; i < array.length; i++) {
		if (array[i].id == node.id) {
			found = true;
		}
	}
	return found;
};
const isLinkIncluded = (link, array) => {
	let found = false;
	for (let i = 0; i < array.length; i++) {
		if (array[i].target == link.target && array[i].source == link.source) {
			found = true;
		}
	}
	return found;
};

// const getNodes = (nodeList, recipes, chars) => {
// 	recipes.forEach((recipe) => {
// 		const r = new Recipe(recipe);
// 		if (r.canBeUsedBy(chars)) {
// 			let notFound = true;
// 			for (let i = 0; i < nodeList.length; i++) {
// 				if (nodeList[i].isSameProduct(r)) {
// 					nodeList[i].addRecipe(r);
// 					notFound = false;
// 					break;
// 				}
// 			}
// 			if (notFound) {
// 				const n = new Node(r);
// 				nodeList.push(n);
// 			}
// 		}
// 	});
// };

const getNodes = (nodeList, recipes, chars) => {
	// Add recipe to list if it has not been added already
	recipes.forEach((recipe) => {
		const r = new Recipe(recipe);
		// only add if it can be used by these chars
		if (r.canBeUsedBy(chars)) {
			const rProduct = recipe.b;
			let isCounted = false;
			// create a new ingredient from the data
			let n = new Node(rProduct);
			nodeList.forEach((ing) => {
				if (ing.getProduct() == rProduct) {
					isCounted = true;
					n = ing;
				}
			});
			// if it is not counted for already add to list
			n.addRecipe(r);
			if (!isCounted) {
				nodeList.push(n);
			}

			// each recipe has two ingredients
			const possibleNewIngs = [recipe.a1, recipe.a2];
			possibleNewIngs.forEach((newIng) => {
				let ing = new Node(newIng);
				let notFound = true;
				for (let i = 0; i < nodeList.length; i++) {
					// if new ing is already in list
					if (nodeList[i].getProduct() == newIng) {
						notFound = false;
						ing = nodeList[i];
						// adds children to recipe if not already added
						if (!r.isChild(nodeList[i])) {
							r.addChild(nodeList[i]);
						}
						break;
					}
				}

				if (notFound) {
					nodeList.push(ing);
				}
				if (!r.isChild(ing)) {
					r.addChild(ing);
				}
				if (!ing.isParentCounted(r)) {
					ing.addParent(r);
				}
			});
		}
	});
};

// const getLinks = (nodeList) => {
// 	nodeList.forEach((nodeToFind) => {
// 		nodeList.forEach((nodeToCompare) => {
// 			for (let i = 0; i < nodeToCompare.getRecipies().length; i++) {
// 				const recipe = nodeToCompare.getRecipies()[i];
// 				// console.log(nodeToCompare.isChild(nodeToFind));
// 				if (
// 					recipe.getFirstIng() == nodeToFind.getProduct() ||
// 					recipe.getSecondIng() == nodeToFind.getProduct()
// 				) {
// 					// console.log(nodeToFind, nodeToCompare);
// 					if (!nodeToFind.isParent(nodeToCompare)) {
// 						nodeToFind.addParent(nodeToCompare);
// 					}
// 					if (!nodeToCompare.isChild(nodeToFind)) {
// 						nodeToCompare.addChild(nodeToFind);
// 					}
// 					break;
// 				}
// 			}
// 		});
// 	});
// };

const generateNodeList = (chars) => {
	let nodeList = [];
	const action = require("../../json/action.json").recipes;
	const attack = require("../../json/attack.json").recipes;
	const magic = require("../../json/magic.json").recipes;
	const shotlock = require("../../json/shotlock.json").recipes;

	// const chars = ["terra", "ventus", "aqua"];

	getNodes(nodeList, action, chars);
	getNodes(nodeList, attack, chars);
	getNodes(nodeList, magic, chars);
	getNodes(nodeList, shotlock, chars);

	// getLinks(nodeList);

	// console.log(nodeList);

	return nodeList;
};

const generateD3JsonHelper = (node, jsonData) => {
	const node1 = {
		id: null,
		type: null
	};
	node1.id = node.getProduct();
	node1.type = "Ingredient";
	if (!isNodeIncluded(node1, jsonData.nodes)) {
		jsonData.nodes.push(node1);

		node.getRecipes().forEach((recipe) => {
			const node2 = {
				id: null,
				type: null
			};
			node2.id = recipe.printName;
			node2.type = "Recipe";

			if (!isNodeIncluded(node2, jsonData.nodes)) {
				jsonData.nodes.push(node2);

				const link1 = {
					source: recipe.printName,
					target: node.getProduct()
				};
				if (!isLinkIncluded(link1, jsonData.links)) {
					jsonData.links.push(link1);
					try {
						recipe.getChildren().forEach((childNode) => {
							const link2 = {
								source: childNode.getProduct(),
								target: recipe.printName
							};
							if (!isLinkIncluded(link2, jsonData.links)) {
								jsonData.links.push(link2);
								generateD3JsonHelper(childNode, jsonData);
							}
						});
					} catch (error) {}
				}
			}
		});
	}
	return jsonData;
};

const generateD3Json = (node, jsonData) => {
	jsonData = {
		nodes: [],
		links: []
	};

	return generateD3JsonHelper(node, jsonData);
};

const getRoots = (nodeList) => {
	temp = [];
	nodeList.forEach((node) => {
		if (node.getParents().length == 0) {
			temp.push(node);
		}
	});
	nodeList = temp;
	return rootList;
};

module.exports = { generateNodeList, generateD3Json, getRoots };
