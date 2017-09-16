var myData =[
	{ name: "John", age: 35, height: 1.9 },
	{ name: "Mafe", age: 35,  height: 1.65},
	{ name: "Edwin", age: 37, height: 1.85},
	{ name: "Eliza", age: 32, height: 1.7},
	{ name: "David", age: 3, height: 0.9},
	{ name: "Santi", age: 7, height: 1.32},
	{ name: "Luchi", age: 1, height: 30},
]
var  barH = 15,
  margin = {left: 80, right: 20, top: 20, bottom: 20},
	width = 800,
	height = 400,
	chart = d3.select("#chart")
		.append("svg")
    .attr("width", width )
    .attr("height", height)
    .append("g")
    	.attr("transform", "translate("+ margin.left + "," + margin.top + ")"),
   xAxis = chart.append("g")
   	.attr("class", "x axis"),
   yAxis = chart.append("g")
   	.attr("class", "y axis"),

   widthScale = d3.scaleLinear()
    .range([0, width - margin.left -margin.right]),
   colorScale = d3.scaleOrdinal(d3.schemeCategory20),
   heightScale = d3.scaleBand()
   	.range([0, height -margin.top - margin.bottom]);



function update(myData) {
	// Update the scale to the new maximum
	widthScale.domain([0, d3.max(myData, function (d) { return d.age; })]);
  heightScale.domain(myData.map(function (d) { return d.name; }));

  var ps = chart.selectAll("rect")
    .data(myData);

	// Actions just for new items
	var psEnter =  ps.enter()
    .append("rect")
    .attr("x", 0)
    .attr("width",0);

	// Actions for new + updated
  ps.merge(psEnter)
    .attr("y", function (d)  { return heightScale(d.name); })
    .style("fill", function (d, i) { return colorScale(d.name); })
    .attr("height", heightScale.bandwidth())
    .transition().duration(2000)
    .attr("width", function (d) { return widthScale(d.age); });

	// Actions for deleted items
  ps.exit().remove();

  xAxis.call(d3.axisTop(widthScale));
  yAxis.call(d3.axisLeft(heightScale));
}

update(myData);
