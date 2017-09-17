var svg = d3.select("#d3_01_grafico"),
    margin = {top: 20, right: 20, bottom: 50, left: 40},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"),
    widthScale = d3.scaleBand().range([0, width]).paddingInner(0.05).align(0.1),
    heightScale = d3.scaleLinear().range([height,0]),
    ColorScale = d3.scaleOrdinal(d3.schemeCategory20);

//Carga del archivo de datos y cálculo de la cariable total
d3.csv("resources/data/resumen_01.csv", function(d, i, columns) {
    for (i = 2, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
    d.total = (t);
    return d;
}, 
    //Arroja un error en caso que no se carguen bien los datos
    function(error, data) {
    if (error) throw error;
    
    //Imprime los datos en la consola
    console.log("resources/data/resumen_01.csv");
    console.log(data);
    
    //Se define la variable keys que corresponde a los valores numéricos
    var keys = data.columns.slice(2);

    //Se ordenan los datos y se define el dominio de X, Y y Z
    data.sort(function(a, b) { return b.total - a.total; });
    widthScale.domain(data.map(function(d) { return d.Iniciales; }));
    heightScale.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
    ColorScale.domain(keys);
    
    g.append("g")
        .selectAll("g")
        .data(d3.stack().keys(keys)(data))
        .enter().append("g")
            .attr("fill", function(d) { return ColorScale(d.key); }) 
        .selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")                 
            .attr("class", "bar")
            .attr("x", function(d) { return widthScale(d.data.Iniciales); })
            .attr("y", function(d) { return heightScale(d[1]); })    
            .attr("height", function(d) { return heightScale(d[0]) - heightScale(d[1]); })      
            .attr("width", widthScale.bandwidth())
  			.on("mousemove", function(d){    				
                tooltip                
              .style("left", d3.event.pageX + 50 + "px")
              .style("top", d3.event.pageY - 50 +  "px")
              .style("display", "inline-block")
      				.html("<strong>Departamento:</strong> " + d.data.Departamento +"<br>" +
                          "<strong>Cantidad Incautada:</strong> " + d3.format(",d")((d[1]-d[0])/1000) + " Kg."                          
                         );})
    		    .on("mouseout", function(d, i) { tooltip.style("display", "none");})
    
    //.transition().duration(1000).delay(function(d,i) { return i * 50; })
    
    var tooltip = d3.select("body").append("div").attr("class", "toolTip");
        
    //Creación de las etiquetas del eje x
    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")    
        .call(d3.axisBottom(widthScale))
    .append("text")
        .attr("x", width/2)
        .attr("y", 40 )
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("text-anchor", "start")
        .text("Departamentos")
        .attr("font-size","18px");
     
    //Creación de las etiquetas del eje y
    g.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(heightScale).ticks(null, "s"))
    .append("text")
        .attr("x", 5)
        .attr("y", heightScale(heightScale.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("text-anchor", "start")
        .text("Cantidad de Estupefacientes Incautados")
        .attr("font-size","18px");

    //Caja de nomenclaturas
    var legend = g.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 12)
        .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", ColorScale);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function(d) { return d; });    
    
});