var svg = d3.select("body").append("svg")
  .attr("width", 500)
  .attr("height", 300);

var gradient = svg.append("defs")
  .append("linearGradient")
  .attr("id", "gradient")
  .attr("x1", "0%")
  .attr("x2", "100%")
  .attr("y1", "0%")
  .attr("y2", "0%")
  .attr("spreadMethod", "pad");

gradient.append("stop")
  .attr("offset", "0%")
  .attr("stop-color", "#274B67")
  .attr("stop-opacity", 0.1);

gradient.append("stop")
  .attr("offset", "100%")
  .attr("stop-color", "#3F4D7A")
  .attr("stop-opacity", 1);

svg.append("rect")
  .attr("width", 500)
  .attr("height", 100)
  .style("fill", "url(#gradient)");
