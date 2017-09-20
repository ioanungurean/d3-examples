// config
const config = {
  svgWidth: 1200,
  svgHeight: 900,
  chordRadius: 380, // chord inner radius
  chordStroke: 5, // chord outer radius
  labelPadding: -10, // distance between labels and the arc to wich belongs
  flowBlue: '#507092',
  flowOrange: '#F6A623',
  flowStroke: 2,
  flowBeta: 0.2, // 0 - 1: how much the flow should draw close the center
  flowPadding: 10,
  triangleSize: 12,
  radiansFlipLabel: Math.PI / 1.6, // below x-axis (-90 rotation) or grater than PI/2
};

let arcsCentroids = {}; // list of centroids for every arc

let data = {
  interfaces: [
    {
      _id: 'i0',
      name: 'Network',
      order: 0,
      value: 60,
    },
    {
      _id: 'i1',
      name: 'Salesforce',
      order: 0,
      value: 60,
    },
    {
      _id: 'i2',
      name: 'Google Analytics',
      order: 0,
      value: 60,
    },
    {
      _id: 'i3',
      name: 'Logger',
      order: 0,
      value: 60,
    },
    {
      _id: 'i4',
      name: 'Dashboard',
      order: 0,
      value: 80,
    },
  ],
  flows: [
    {
      _id: 'f0',
      start: 'i0',
      end: 'i1',
      dataType: 'PII',
      libraryType: 'Deprecated',
      bidirectional: false,
      parent: 'idOfCommit'
    },
    {
      _id: 'f1',
      start: 'i0',
      end: 'i2',
      dataType: 'PII',
      libraryType: 'Deprecated',
      bidirectional: false,
      parent: 'idOfCommit'
    },
    {
      _id: 'f2',
      start: 'i0',
      end: 'i3',
      dataType: 'PII',
      libraryType: 'Deprecated',
      bidirectional: false,
      parent: 'idOfCommit'
    },
    {
      _id: 'f3',
      start: 'i0',
      end: 'i4',
      dataType: 'PII',
      libraryType: 'Deprecated',
      bidirectional: false,
      parent: 'idOfCommit'
    },
    {
      _id: 'f4',
      start: 'i1',
      end: 'i3',
      dataType: 'PII',
      libraryType: 'Deprecated',
      bidirectional: false,
      parent: 'idOfCommit'
    },
    {
      _id: 'f5',
      start: 'i2',
      end: 'i3',
      dataType: 'PII',
      libraryType: 'Deprecated',
      bidirectional: false,
      parent: 'idOfCommit'
    },
    {
      _id: 'f6',
      start: 'i3',
      end: 'i4',
      dataType: 'PII',
      libraryType: 'Deprecated',
      bidirectional: false,
      parent: 'idOfCommit'
    },
  ],
  issueFlows: ['f1', 'f3']
}

// converts from degrees to radians.
Math.toRadians = (degrees) => {
  return degrees * Math.PI / 180;
};

// converts from radians to degrees.
Math.toDegrees = (radians) => {
  return radians * 180 / Math.PI;
};

// returns the angle given a point on the circle
function getAngle(point) {
  return (Math.toDegrees(-1 * Math.atan2(point.y, point.x)) + 360) % 360;
}

// returns the angle you have to rotate the triangle interface
function linearInterpolation(angle) {
  return (((90 - 180) * (angle - 90)) / (180 - 90)) + 180;
}

function augmentDataFlows(centroids, flows) {
  let augmentedData = [];

  flows.map((flow) => {
    augmentedData.push([
      { _id: flow._id,
        x: centroids[flow.start].x, y: centroids[flow.start].y },
      { x: -1 * centroids[flow.end].x, y: -1 * centroids[flow.end].y },
      { x: -1 * centroids[flow.start].x, y: -1 * centroids[flow.start].y },
      { x: centroids[flow.end].x, y: centroids[flow.end].y },
    ]);
  });

  return augmentedData;
}

// moves the centroid coordinates inside the circle to make space for interface traingles
function adjustCentroidCoord(centroid) {
  let point = {};
  let d = Math.sqrt(Math.pow(centroid['0'], 2) + Math.pow(centroid['1'], 2)); // Euclidean distance

  // moving the point inside the circle on the radius path
  point.x = ((config.chordRadius - config.triangleSize) / d) * centroid['0'];
  point.y = ((config.chordRadius - config.triangleSize) / d) * centroid['1'];

  return point;
}

// function that takes an array with issueFlows  and returns the interfaces connected to those flows
function mapFlowsIssuesToInterfaces(issueFlows) {
  let interfacesIssue = [];

  data.flows.map((flow) => {
    if (issueFlows.includes(flow._id)) {
      if (!interfacesIssue.includes(flow.start)) {
        interfacesIssue.push(flow.start);
      }

      if (!interfacesIssue.includes(flow.end)) {
        interfacesIssue.push(flow.end);
      }
    }
  });
  return interfacesIssue;
}

// setup
let svg = d3
  .select('body')
  .append('svg')
  .attr('width', config.svgWidth)
  .attr('height', config.svgHeight)
  .append('g')
  .attr('transform', 'translate(' + config.svgWidth / 2 + ',' + config.svgHeight / 2 + ')');

// using two layers to simulate z-index
layer0 = svg.append('g');
layer1 = svg.append('g');

// function to create an arc
let arc = d3.arc()
  .innerRadius(config.chordRadius)
  .outerRadius(config.chordRadius + config.chordStroke);
  // .padAngle(.02); // space between arcs

// turn the chord chart 90 degrees counter clockwise, so it starts at the left
let pie = d3.pie()
  .startAngle(-90 * Math.PI / 180)
  .endAngle(-90 * Math.PI / 180 + 2 * Math.PI)
  .value((d) => { return d.value; })
  .sort(null);

// create the chord slices and also the invisible arcs for the labels
let chord = layer1.selectAll('.arcSlice')
  .data(pie(data.interfaces))
  .enter().append('path')
  .attr('class', 'arcSlice')
  .attr('d', arc)
  .each(function (d, i) {
    arcsCentroids[d.data._id] = adjustCentroidCoord(arc.centroid(d));

    // search pattern for everything between the start and the first capital L
    let firstArcSection = /(^.+?)L/;

    // grab everything up to the first Line statement
    let newArc = firstArcSection.exec(d3.select(this).attr('d'))[1];

    // replace all the commas so that IE can handle it
    newArc = newArc.replace(/,/g, ' ');

    // TODO?: 1.2 * Math.PI / 2 && d.endAngle < 3 * Math.PI / 2
    if (d.endAngle > config.radiansFlipLabel) {
      let startLoc = /M(.*?)A/,		// everything between the capital M and first capital A
        middleLoc = /A(.*?)0 0 1/,	// everything between the capital A and 0 0 1
        endLoc = /0 0 1 (.*?)$/;	// everything between the 0 0 1 and the end of the string (denoted by $)

      // flip the direction of the arc by switching the start and end point (and sweep flag)
      let newStart = endLoc.exec(newArc)[1];
      let newEnd = startLoc.exec(newArc)[1];
      let middleSec = middleLoc.exec(newArc)[1];

      // build up the new arc notation, set the sweep-flag to 0
      newArc = 'M' + newStart + 'A' + middleSec + '0 0 0 ' + newEnd;
    }

    // create a new invisible arc that the text can flow along
    layer1.append('path')
      .attr('class', 'hiddenArc')
      .attr('id', 'chordArc' + i)
      .attr('d', newArc)
      .style('fill', 'none');
  });

// append triangles to interfaces
layer0.selectAll('.triangle')
  .data(data.interfaces)
  .enter().append('path')
  .attr('d', (d, i) => {
    return 'M ' + arcsCentroids[d._id].x + ' ' + arcsCentroids[d._id].y + ` l ${config.triangleSize} ${config.triangleSize} l -${2 * config.triangleSize} 0 z`;
  })
  .attr('transform', (d, i) => {
    let pointAtAngle = getAngle(arcsCentroids[d._id]); // compute the angle given a point on the circle
    let rotationAngle = linearInterpolation(pointAtAngle); // compute the rotation angle of the triangle
    return `rotate(${rotationAngle}, ${arcsCentroids[d._id].x}, ${arcsCentroids[d._id].y})`
  })
  .style('fill', (d, i) => {
    let interfacesIssue = mapFlowsIssuesToInterfaces(data.issueFlows);
    if (interfacesIssue.includes(d._id)) {
      return config.flowOrange;
     } else {
      return config.flowBlue;
     }
  });

// append the label names on the outside of the circle
layer1.selectAll('.chordLabel')
  .data(pie(data.interfaces))
  .enter().append('text')
  .attr('class', 'chordLabel')
  // move the labels below the arcs for those slices with an end angle greater than 90 degrees
  .attr('dy', (d, i) => {
    return (d.endAngle > config.radiansFlipLabel ? Math.abs(config.labelPadding) + 7 : config.labelPadding);
  })
  .append('textPath')
  .attr('startOffset', '50%')
  .style('text-anchor', 'middle')
  .attr('xlink:href', (d, i) => { return '#chordArc' + i; })
  .text((d) => { return d.data.name; });

// draw the flow line
let flowLine = d3.line()
  .x((d) => { return d.x; })
  .y((d) => { return d.y; })
  .curve(d3.curveBundle.beta(config.flowBeta));

//append each flow to the svg
layer0.selectAll('.flow')
  .data(augmentDataFlows(arcsCentroids, data.flows))
  .enter().append('path')
  .style('fill', 'none')
  .style("stroke", (d) => {
    if (data.issueFlows.includes(d[0]._id)) {
      return config.flowOrange;
    } else {
      return config.flowBlue;
    }
  })
  .style('stroke-width', config.flowStroke + 'px')
  .attr('d', flowLine);
