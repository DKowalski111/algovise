import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Node extends d3.SimulationNodeDatum {
  id: number;
  label: string;
}

interface Edge {
  source: number;
  target: number;
  weight: number;
}

// Graph Data
const graphData = {
  nodes: [
    { id: 0, label: 'A' },
    { id: 1, label: 'B' },
    { id: 2, label: 'C' },
    { id: 3, label: 'D' },
    { id: 4, label: 'E' },
  ] as Node[],  // Make sure to explicitly type it as `Node[]`
  edges: [
    { source: 0, target: 1, weight: 2 },
    { source: 0, target: 2, weight: 4 },
    { source: 1, target: 2, weight: 1 },
    { source: 1, target: 3, weight: 7 },
    { source: 2, target: 3, weight: 3 },
    { source: 3, target: 4, weight: 1 },
    { source: 2, target: 4, weight: 5 },
  ],
};

// React Component for Graph Visualization
const GraphCreator = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const width = 600;
    const height = 400;

    // Create an SVG container
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Force Simulation
    const simulation = d3.forceSimulation(graphData.nodes)
      .force('link', d3.forceLink(graphData.edges).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-150))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Create links (edges)
    const links = svg.selectAll('.link')
      .data(graphData.edges)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('stroke', '#999')
      .attr('stroke-width', 2);

    // Create nodes
    const nodes = svg.selectAll('.node')
      .data(graphData.nodes)
      .enter()
      .append('circle')
      .attr('class', 'node')
      .attr('r', 10)
      .attr('fill', '#1f77b4')
      .call(d3.drag<SVGCircleElement, Node>()  // Explicitly type the drag behavior
        .on('start', (event) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        })
        .on('drag', (event) => {
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        })
        .on('end', (event) => {
          if (!event.active) simulation.alphaTarget(0);
          event.subject.fx = null;
          event.subject.fy = null;
        })
      );

    // Add node labels
    svg.selectAll('.label')
      .data(graphData.nodes)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', (d: any) => d.x)
      .attr('y', (d: any) => d.y)
      .attr('dy', -15)
      .attr('text-anchor', 'middle')
      .text((d: any) => d.label);

    // Update positions of nodes and links
    simulation.on('tick', () => {
      links
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      nodes
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);

      svg.selectAll('.label')
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y);
    });

  }, []);

  return (
    <div>
      <h3>Graph Visualization</h3>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default GraphCreator;
