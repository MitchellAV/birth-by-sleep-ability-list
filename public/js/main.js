let nodeList = [];
let allRecipes = [];
let temp = [];
const getNodes = async (url) => {
	try {
		const res = await fetch(url);
		const out = await res.json();
		const recipes = out.recipes;

		// Add recipe to list if it has not been added already
		recipes.forEach((recipe) => {
			const r = new Recipe(recipe);
			allRecipes.push(r);
			// only add if it can be used by these chars
			if (r.canBeUsedBy(["terra"])) {
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
	} catch (err) {
		console.error(err);
	}
	// console.log(allNodes);
	// console.log(allRecipes);
};

const addAllNodes = async () => {
	await getNodes("/magic");
	await getNodes("/attack");
	await getNodes("/shotlock");
	await getNodes("/action");
	return nodeList;
};

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
const recJsonNodes = (node) => {
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

					recipe.getChildren().forEach((childNode) => {
						const link2 = {
							source: childNode.getProduct(),
							target: recipe.printName
						};
						if (!isLinkIncluded(link2, jsonData.links)) {
							jsonData.links.push(link2);
							recJsonNodes(childNode);
						}
					});
				}
			}
		});
	}
};

const getJSONData = (index, data) => {
	jsonData = {
		nodes: [],
		links: []
	};
	// allNodes.forEach((node) => {
	// 	recJsonNodes(node);
	// });

	return recJsonNodes(data[index], jsonData);
};
const getRoots = async () => {
	nodeList = await addAllNodes();
	temp = [];
	nodeList.forEach((node) => {
		if (node.getParents().length == 0) {
			temp.push(node);
		}
	});
	nodeList = temp;
	return nodeList;
};
const drawNetwork = (graph) => {
	//initilize svg or grab svg
	const radius = 5;

	graph.nodes[0].type = "Root";
	const width = window.innerWidth;
	const height = window.innerHeight * 1.5;
	const heading = d3.select("body").append("h1").text(`${graph.nodes[0].id}`);
	const svg = d3
		.select("body")
		.append("svg")
		.attr("width", width)
		.attr("height", height);

	var simulation = d3
		.forceSimulation()
		.force(
			"link",
			d3
				.forceLink()
				.id((d) => d.id)
				.distance(100)
				.strength(0.2)
		)
		.force("charge", d3.forceManyBody().strength(-300)) // ^ change this value
		// .force("collide", d3.forceCollide(75)) // change this value
		.force("center", d3.forceCenter(width / 2, height / 2))
		.force("x", d3.forceX())
		.force("y", d3.forceY());

	svg.append("svg:defs")
		.selectAll("marker")
		.data(["end"]) // Different link/path types can be defined here
		.enter()
		.append("svg:marker") // This section adds in the arrows
		.attr("id", String)
		.attr("viewBox", "0 -5 10 10")
		.attr("refX", radius * 2)
		.attr("refY", 0)
		.attr("markerWidth", radius * 3)
		.attr("markerHeight", radius * 3)
		.attr("orient", "auto")
		.append("svg:path")
		.attr("d", "M0,-5L10,0L0,5");

	var link = svg
		.append("g")
		.attr("class", "links")
		.selectAll("line")
		.data(graph.links)
		.enter()
		.append("line")
		.attr("stroke", "black")
		.attr("marker-end", "url(#end)");

	var node = svg
		.append("g")
		.attr("class", "nodes")
		.selectAll("g")
		.data(graph.nodes)
		.enter()
		.append("g");

	var circles = node
		.append("circle")
		.attr("r", radius)
		.attr("fill", function (d) {
			if (d.type == "Ingredient") {
				return "blue";
			} else if (d.type == "Recipe") {
				return "red";
			} else {
				return "green";
			}
		})

		.call(
			d3
				.drag()
				.on("start", dragstarted)
				.on("drag", dragged)
				.on("end", dragended)
		);

	var labels = node
		.append("text")
		.text(function (d) {
			return d.id;
		})
		.attr("x", radius)
		.attr("y", radius);

	node.append("title").text(function (d) {
		return d.id;
	});

	simulation.nodes(graph.nodes).on("tick", ticked);

	simulation.force("link").links(graph.links);

	function ticked() {
		link.attr("x1", function (d) {
			return d.source.x;
		})
			.attr("y1", function (d) {
				return d.source.y;
			})
			.attr("x2", function (d) {
				return d.target.x;
			})
			.attr("y2", function (d) {
				return d.target.y;
			});

		// node.attr("transform", function (d) {
		// 	return "translate(" + d.x + "," + d.y + ")";
		// });
		node.attr("transform", function (d) {
			return (
				"translate(" +
				(d.x = Math.max(radius, Math.min(width - radius, d.x))) +
				"," +
				(d.y = Math.max(radius, Math.min(height - radius, d.y))) +
				")"
			);
		});
	}

	function dragstarted(event, d) {
		if (!event.active) simulation.alphaTarget(0.3).restart();
		d.fx = d.x;
		d.fy = d.y;
	}

	function dragged(event, d) {
		d.fx = event.x;
		d.fy = event.y;
	}

	function dragended(event, d) {
		if (!event.active) simulation.alphaTarget(0);
		d.fx = null;
		d.fy = null;
	}
};

const main = (index) => {
	getJSONData(index, nodeList);
	const json = jsonData;
	drawNetwork(json);
};

// const findNode = (ingName, depth) => {};
const loopForAllRoots = async () => {
	nodeList = await getRoots();
	console.log(nodeList);
	// main(0, allNodes);
	nodeList.forEach((element, index) => {
		main(index, nodeList);
		console.log(index);
	});
};

loopForAllRoots();
