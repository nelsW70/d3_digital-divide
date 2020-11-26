import * as d3 from 'd3';
import { attrs } from 'd3-selection-multi';

let dim = { width: 600, height: 400 };
let svg = d3
  .select('body')
  .append('svg')
  .style('background', 'lightgrey')
  .attrs(dim);

let dataset = {
  nodes: [
    { id: 'Point0' },
    { id: 'Point1' },
    { id: 'Point2' },
    { id: 'Point3' },
    { id: 'PointA' },
    { id: 'PointB' },
    { id: 'PointC' }
  ],
  links: [
    { source: 'Point1', target: 'Point0', value: 20 },
    { source: 'Point2', target: 'Point0', value: 60 },
    { source: 'Point3', target: 'Point0', value: 100 },
    { source: 'Point0', target: 'PointA', value: 200 },
    { source: 'PointB', target: 'PointA', value: 30 },
    { source: 'PointC', target: 'PointA', value: 30 }
  ]
};

let sim = d3.forceSimulation();

sim.nodes(dataset.nodes);

let drag = d3
  .drag()
  .on('start', startDragging)
  .on('drag', dragging)
  .on('end', endDragging);

let nodes = svg
  .append('g')
  .selectAll('circle')
  .data(dataset.nodes)
  .enter()
  .append('circle')
  .attrs({ r: 10 })
  .call(drag);

let links = svg
  .append('g')
  .selectAll('line')
  .data(dataset.links)
  .enter()
  .append('line')
  .attrs({ stroke: 'black' });

sim.on('tick', function (d) {
  nodes.attrs({
    cx: d => d.x,
    cy: d => d.y
  });
  links.attrs({
    x1: d => d.source.x,
    y1: d => d.source.y,
    x2: d => d.target.x,
    y2: d => d.target.y
  });
});

sim
  .force('center', d3.forceCenter(300, 200))
  .force('collide', d3.forceCollide(15))
  .force('manyBody', d3.forceManyBody())
  .force('radial', d3.forceRadial(150, 300, 200))
  .force('xForce', d3.forceX())
  .force('yForce', d3.forceY())
  .force(
    'link',
    d3.forceLink(dataset.links).id(d => d.id)
  );

sim.force('link').distance(d => d.value);
sim.force('radial').strength(0.5);
sim.force('xForce').strength(0.2);
sim.force('yForce').strength(0.28);

// dragging

function startDragging(d) {
  if (!d3.event.active) sim.alphaTarget(0.125).restart();
  d.fx = d.x;
  d.fy = d.y;
}
function dragging(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}
function endDragging(d) {
  if (!d3.event.active) sim.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
