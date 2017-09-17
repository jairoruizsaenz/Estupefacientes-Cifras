var width3 = WIDTH,
    height3 = HEIGHT, 
    margin3 = {top: 80, right: 80, bottom: 40, left: 80},
    svg3 = d3.select("#d3_03_grafico")
            .append("svg")
            .attr("width", width3)
            .attr("height", height3)
            .append("g").attr("transform", "translate(" + margin3.left + "," + margin3.top + ")"),   
    
    widthScale3 = d3.scaleLinear().range([0,width3 - margin3.left -margin3.right]),
    heightScale3 = d3.scaleLinear().range([height3 -margin3.top - margin3.bottom,0]),
    colorScale3 = d3.scaleOrdinal(d3.schemeCategory20),
    //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    xAxis = svg3.append("g").attr("class", "x axis"),
    yAxis = svg3.append("g").attr("class", "y axis"),
    r = 5;

xAxis.append("text")
    .text("Age")
    .attr("dx", width3 - margin3.left -margin3.right)
    .attr("dy", -15);
  
yAxis.append("text")
    .text("Height")
    .attr("transform", "translate(-25," + (height3 -margin3.top - margin3.bottom - 15)+ " ) rotate(-90)");  

d3.csv("resources/data/resumen_03.csv", function(d, i, columns) {
    for (i = 2, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
    return d;
},
       
function(error, data){
    if (error) throw error;

    console.log("resources/data/resumen_03.csv");
    console.log(data);

    widthScale3.domain([0, d3.max(data, function(d) { return d.Incautaciones; })]).nice();
    heightScale3.domain([0, d3.max(data, function(d) { return d.Cantidad; })]).nice();
        
    var ps = svg3.selectAll("circle")
        .data(data);

    // Actions just for new items
    var psEnter =  ps.enter()
        .append("circle")
        .attr("r", r)
        .attr("cx",0);

    // Actions for new + updated
    ps.merge(psEnter) 
        .attr("cy", function (d) {return heightScale3(d.Cantidad); })
        .style("fill", function (d,i) { return colorScale3(i); })
        .transition().duration(2000)    
        .attr("cx", function (d) { return widthScale3(d.Incautaciones); });

    xAxis.call(d3.axisTop(widthScale3));
    yAxis.call(d3.axisLeft(heightScale3));
    
});
