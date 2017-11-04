// config
const config = {
  svg: {
    width: 300,
    height: 700,
  },
  package: {
    width: 350,
    height: 40,
    marginBottom: 70
  },
  interface: {
    width: 160,
    height: 60,
    marginBottom: 10
  },
  color: {
    green: '#33667b',
    purple: '#3F4D7A',
    blue: '#192B3D',
  },
  linkCurvature: .7,
  sourceYOffset: 0, // y-offset of link from top of source node
  destinationYOffset: 0, // y-offset of link from top of destination node
  linkHeight: 0, // link height
}

// data
const data = {
  left: [
    { '_id': 'm1' },
    { '_id': 'm2' },
    { '_id': 'm3' },
    { '_id': 'm4' },
    { '_id': 'm5' },
    { '_id': 'm6' },
  ],
  right: [
    { '_id': 'r1' },
    { '_id': 'r2' },
    { '_id': 'r3' },
    { '_id': 'r4' },
  ],
  links: [
    { 'source': 'm1', 'destination': 'r1' },
    { 'source': 'm2', 'destination': 'r4' },
    { 'source': 'm3', 'destination': 'r2' },
    { 'source': 'm4', 'destination': 'r4' },
    { 'source': 'm5', 'destination': 'r2' },
    { 'source': 'm6', 'destination': 'r3' },
  ]
}

// function that returns coordinates for each package and interface
function augmentShapeData(packages, interfaces) {
  let packagesData = [];
  let interfacesData = [];

  packages.forEach((package, index) => {
    packagesData.push({
      pos: {
        x: 0,
        y: index * (config.package.marginBottom + package.offsetHeight),
        height: package.offsetHeight,
      },
      data: {
        _id: package.__data__._id
      }
    });
  });

  interfaces.forEach((interface, index) => {
    interfacesData.push({
      pos: {
        x: config.svg.width,
        y: index * (config.interface.marginBottom + interface.offsetHeight),
        height: interface.offsetHeight,
      },
      data: {
        _id: interface.__data__._id
      }
    });
  });

  return {
    packages: packagesData,
    interfaces: interfacesData,
  };
}

// function that returns the path between source and destination
function computeLinkPath(d) {
  let x0 = d.source.x,
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

// function that returns position given an id
function getMetadata(id, shapeData) {
  let currentMetadata = {};

  shapeData.interfaces.map((interface) => {
    if (interface.data._id === id) {
      currentMetadata = interface.pos;
    }
  });

  shapeData.packages.map((package) => {
    if (package.data._id === id) {
      currentMetadata = package.pos;
    }
  });

  return currentMetadata;
}

// function that returns an array with coordinates for every package or interface that has a link
function augmentLinksData(links, shapeData) {
  let augmentedLinksData = [];

  links.map((link) => {
    augmentedLinksData.push({
      'source': getMetadata(link.source, shapeData),
      'destination': getMetadata(link.destination, shapeData)
    });
  });
  return augmentedLinksData;
}

// make the first container for packages
d3.select('.container')
  .append('div')
  .attr('class', 'packages-container')
  .attr('min-width', `${config.package.width}px`);

// make the svg for drawing the paths between the packages and interfaces
let svg = d3.select('.container')
  .append('svg')
  .attr('width', config.svg.width)
  .attr('height', config.svg.height);

// make the second container for interfaces
d3.select('.container')
  .append('div')
  .attr('class', 'interfaces-container')
  .attr('min-width', `${config.interface.width}px`);

// draw the packages
d3.select('.packages-container').selectAll('div')
  .data(data.left)
  .enter().append('div')
  .attr('class', 'package')
  .style('width', `${config.package.width}px`)
  .style('height', `${config.package.height}px`)
  .style('margin', `0 0 ${config.package.marginBottom}px auto`)
  .style('background-color', config.color.blue)
  .html('<span>3 Clases | 14 Methods | 340 Parameters</ span>');

// draw the interfaces
d3.select('.interfaces-container').selectAll('div')
  .data(data.right)
  .enter().append('div')
  .attr('class', 'interface')
  .style('width', `${config.interface.width}px`)
  .style('height', `${config.interface.height}px`)
  .style('margin', `0 auto ${config.interface.marginBottom}px 0`)
  .style('background-color', config.color.blue)
  .html('<span> Interface </ span>');

let layer0 = svg.append('g');
let packages = d3.selectAll('.package');
let interfaces = d3.selectAll('.interface');
let augmentedShapeData = augmentShapeData(packages._groups[0], interfaces._groups[0]);
let augmentedLinksData = augmentLinksData(data.links, augmentedShapeData);

// draw the links between the columns
layer0.selectAll('link')
  .data(augmentedLinksData)
  .enter().append('path')
  .attr('d', (d) => { return computeLinkPath(d) })
  .style('fill', 'rgba(25,43,61,0.35)');
