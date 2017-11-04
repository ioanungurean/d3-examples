// array of d3 sankey nodes
const data = [{
  dy: 100, // link height, same as source.dy?
  source: {
    dx: 36, // node width
    dy: 40, // node height
    x: 0, // node position
    y: 125
  },
  sy: 0, // y-offset of link from top of source node
  target: {
    dx: 36, // node width
    dy: 100, // node height
    x: 664, // node position
    y: 0
  },
  ty: 0, // y-offset of link from top of target node
  value: 2
}]

svg.selectAll("path")
  .data(data)
  .enter()
  .append("path")
  .attr("d", function (d) { return link(d) });

/**
 * draws one a line from top of source to top of target,
 * top of target to bottom of target,
 * bottom of target to bottom of source,
 * bottom of source to top of source
 */
function link(d) {
  const curvature = 0.6;
  const x0 = d.source.x + d.source.dx;
  const x1 = d.target.x;
  const  xi = d3.interpolateNumber(x0, x1);
  const x2 = xi(curvature);
  const x3 = xi(1 - curvature);
  const y0 = d.source.y + d.sy + d.dy / 2;
  const y1 = d.target.y + d.ty + d.dy / 2;

  return "M" + x0 + "," + y0
    + "C" + x2 + "," + y0
    + " " + x3 + "," + y1
    + " " + x1 + "," + y1
    + "L" + x1 + "," + (y1 + d.target.dy)
    + "C" + x3 + "," + (y1 + d.target.dy)
    + " " + x2 + "," + (y0 + d.source.dy)
    + " " + x0 + "," + (y0 + d.source.dy)
    + "L" + x0 + "," + y0;
}
