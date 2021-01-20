const generateD3Chart = async (graph, width, height) => {
	const radius = 5;

	graph.nodes[0].type = "Root";

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
