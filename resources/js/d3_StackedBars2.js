var svg2 = d3.select("#d3_02_grafico"),
    margin2 = {top: 20, right: 20, bottom: 50, left: 40},
    width2 = +svg2.attr("width") - margin2.left - margin2.right,
    height2 = +svg2.attr("height") - margin2.top - margin2.bottom,
    g2 = svg2.append("g").attr("transform", "translate(" + margin2.left + "," + margin2.top + ")"),
    widthScale2 = d3.scaleBand().range([0, width2]).paddingInner(0.05).align(0.1),
    heightScale2 = d3.scaleLinear().range([height2, 0]),
    colorScale2 = d3.scaleOrdinal(d3.schemeCategory20);

//Carga del archivo de datos y cálculo de la cariable total
d3.csv("resources/data/resumen_02.csv", function (d, i, columns) {
    for (i = 2, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
    d.total = (t);
    return d;
}, 
    //Arroja un error en caso que no se carguen bien los datos
    function(error, data) {
    if (error) throw error;
    
    //Imprime los datos en la consola
    console.log("resources/data/resumen_02.csv");
    console.log(data);
    
    //Se define la variable keys que corresponde a los valores numéricos
    var keys = data.columns.slice(2);

    //Se ordenan los datos y se define el dominio de X, Y y Z
    data.sort(function(a, b) { return b.total - a.total; });
    widthScale2.domain(data.map(function(d) { return d.Iniciales; }));
    heightScale2.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
    colorScale2.domain(keys);

    g2.append("g")
        .selectAll("g")
        .data(d3.stack().keys(keys)(data))
        .enter().append("g")
            .attr("fill", function(d) { return colorScale2(d.key); })
        .selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")                 
            .attr("class", "bar")
            .attr("x", function(d) { return widthScale2(d.data.Iniciales); })
            .attr("y", function(d) { return heightScale2(d[1]); })    
            .attr("height", function(d) { return heightScale2(d[0]) - heightScale2(d[1]); })      
            .attr("width", widthScale2.bandwidth())
            .on("mousemove", function(d){
                tooltip                
              .style("left", d3.event.pageX + 50 + "px")
              .style("top", d3.event.pageY - 50 +  "px")
              .style("display", "inline-block")
                    .html("<strong>Departamento:</strong> " + d.data.Departamento +"<br>" +
                          "<strong>Número de Incautaciones:</strong> " + d3.format(",d")((d[1] - d[0]))                          
                         );})
    		    .on("mouseout", function(d, i) { tooltip.style("display", "none");})
    
    //.transition().duration(1000).delay(function(d,i) { return i * 50; })
    
    var tooltip = d3.select("body").append("div").attr("class", "toolTip");
        
    //Creación de las etiquetas del eje x
    g2.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height2 + ")")    
        .call(d3.axisBottom(widthScale2))
    .append("text")
        .attr("x", width/2)
        .attr("y", 40 )
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("text-anchor", "start")
        .text("Departamentos")
        .attr("font-size","18px");
     
    //Creación de las etiquetas del eje y
    g2.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(heightScale2).ticks(null, "s"))
    .append("text")
        .attr("x", 5)
        .attr("y", heightScale2(heightScale2.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("text-anchor", "start")
        .text("Número de incautaciones realizadas")
        .attr("font-size","18px");

    //Caja de nomenclaturas
    var legend2 = g2.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 12)
        .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend2.append("rect")
        .attr("x", width2 - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", colorScale2);

    legend2.append("text")
        .attr("x", width2 - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function(d) { return d; });    
    
});