// config
const config = {
  xPos: 110, // position
  yPos: 100,
  hPadding: 210, // horizontall padding
  vPadding: 20, // vertical padding
  largeRectangle: {
    width: 230,
    height: 80,
  },
  smallRectangle: {
    width: 100,
    height: 40
  },
  green: '#33667b',
  purple: '#3F4D7A',
  blue: '#192B3D',
  linkCurvature: .7,
  sourceYOffset: 0, // y-offset of link from top of source node
  destinationYOffset: 0, // y-offset of link from top of destination node
  linkHeight: 0, // link height
}

// data
const data = {
  left: [
    { '_id': 'l0' },
    { '_id': 'l1' },
    { '_id': 'l2' },
    { '_id': 'l3' },
  ],
  middle: [
    { '_id': 'm0' },
    { '_id': 'm1' },
    { '_id': 'm2' },
    { '_id': 'm3' },
    { '_id': 'm4' },
    { '_id': 'm5' },
    { '_id': 'm6' },
    { '_id': 'm7' },
    { '_id': 'm8' },
  ],
  right: [
    { '_id': 'r0' },
    { '_id': 'r1' },
    { '_id': 'r2' },
    { '_id': 'r3' },
    { '_id': 'r4' },
  ],
  links: [
    { 'source': 'l1', 'destination': 'm1' },
    { 'source': 'l1', 'destination': 'm5' },
    { 'source': 'm1', 'destination': 'r2' },
    { 'source': 'm8', 'destination': 'r3' },
    { 'source': 'm0', 'destination': 'r0' },
    { 'source': 'm5', 'destination': 'r1' },
    { 'source': 'm3', 'destination': 'r4' },
  ]
}

// lib

// computes the X position for drawing the rectangle
function computeXPos(index) {
  switch (index) {
    case 1:
      return config.xPos;
      break;
    case 2:
      return config.xPos + config.largeRectangle.width + config.hPadding;
      break;
    case 3:
      return config.xPos + config.largeRectangle.width + config.smallRectangle.width + (2 * config.hPadding);
      break;
  }
}

// computes the Y position for drawing the rectangle
function computeYPos(index, rectangleHeight) {
  return config.yPos + (index * rectangleHeight) + (index * config.vPadding);
}

// color cassification
function getColor(index) {
  if (index === 1) {
    return config.purple;
  } else if (index > 4) {
    return config.blue;
  } else {
    return config.green;
  }
}

// for each rectangle adds a series of attribute: coordinates, size, color
function enhanceData(data) {
  let leftData = data.left.map((object, index) => {
    return Object.assign({}, object, {
      'meta': {
        'x': computeXPos(1),
        'y': computeYPos(index, config.largeRectangle.height),
        'width': config.largeRectangle.width,
        'height': config.largeRectangle.height,
        'fill': getColor(index)
      }
    });
  });

  let middleData = data.middle.map((object, index) => {
    return Object.assign({}, object, {
      'meta': {
        'x': computeXPos(2),
        'y': computeYPos(index, config.smallRectangle.height),
        'width': config.smallRectangle.width,
        'height': config.smallRectangle.height,
        'fill': config.blue
      }
    });
  });

  let rightData = data.right.map((object, index) => {
    return Object.assign({}, object, {
      'meta': {
        'x': computeXPos(3),
        'y': computeYPos(index, config.smallRectangle.height),
        'width': config.smallRectangle.width,
        'height': config.smallRectangle.height,
        'fill': config.blue
      }
    });
  });

  return leftData.concat(middleData, rightData);
}

function getMeta(id, endpoints) {
  let currentMeta = {};
  endpoints.map((endpoint) => {
    if (endpoint._id === id) {
      currentMeta = endpoint.meta;
    }
  });

  return currentMeta;
}

// function that is adding to data link the coordinates for source and destination
function enhanceLinksData(links, endpoints) {
  let enhancedData = [];

  links.map((link) => {
    enhancedData.push({
      'source': getMeta(link.source, endpoints),
      'destination': getMeta(link.destination, endpoints)
    });
  });
  return enhancedData;
}

// function that returns the path between source and destination
function computeLinkPath(d) {
  let x0 = d.source.x + d.source.width,
    x1 = d.destination.x,
    xi = d3.interpolateNumber(x0, x1),
    x2 = xi(config.linkCurvature),
    x3 = xi(1 - config.linkCurvature),
    y0 = d.source.y + config.sourceYOffset + config.linkHeight / 2,
    y1 = d.destination.y + config.destinationYOffset + config.linkHeight / 2;

  return 'M' + x0 + ',' + y0
    + 'C' + x2 + ',' + y0
    + ' ' + x3 + ',' + y1
    + ' ' + x1 + ',' + y1
    + 'L' + x1 + ',' + (y1 + d.destination.height)
    + 'C' + x3 + ',' + (y1 + d.destination.height)
    + ' ' + x2 + ',' + (y0 + d.source.height)
    + ' ' + x0 + ',' + (y0 + d.source.height)
    + 'L' + x0 + ',' + y0;
}

// augment data
let augmentedEndpointData = enhanceData(data);
let augmentedLinksData = enhanceLinksData(data.links, augmentedEndpointData);

// setup

let svg = d3
  .select('body')
  .append('svg')
  .attr('width', 1200)
  .attr('height', 800);

let layer0 = svg.append('g');

// draw the left part
layer0.selectAll('left')
  .data(augmentedEndpointData)
  .enter().append('rect')
  .attr('x', (d) => { return d.meta.x; })
  .attr('y', (d) => { return d.meta.y; })
  .attr('width', (d) => { return d.meta.width })
  .attr('height', (d) => { return d.meta.height; })
  .style('fill', (d) => { return d.meta.fill; });

// draw the links between the columns
layer0.selectAll('link')
  .data(augmentedLinksData).enter()
  .append('path')
  .attr('d', (d) => { return computeLinkPath(d) })
  .style('fill', 'rgba(25,43,61,0.35)');
// rgba(78,81,137, 0.35)
