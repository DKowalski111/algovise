import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export interface GraphNode extends d3.SimulationNodeDatum {
  id: number;
  label: string;
}

interface GraphVisualizerProps {
  nodes: GraphNode[];
  edges: { source: number; target: number; weight: number }[];
}

const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ nodes, edges }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const width = 600;
    const height = 400;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove();

    const simulation = d3
      .forceSimulation(nodes)
      .force("link", d3.forceLink(edges).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-150))
      .force("center", d3.forceCenter(width / 2, height / 2));

    // Add the links
    const linkElements = svg
      .selectAll(".link")
      .data(edges)
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("stroke", "#999")
      .attr("stroke-width", 2);

    // Add the nodes with drag behavior
    const nodeElements = svg
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("class", "node")
      .attr("r", 10)
      .attr("fill", "#1f77b4")
      .call(
        d3
          .drag<SVGCircleElement, any>()
          .on("start", (event) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.x;
            event.subject.fy = event.y;
          })
          .on("drag", (event) => {
            // Constrain the node inside the box during dragging
            const margin = 10; // margin to avoid nodes touching the boundary
            event.subject.fx = Math.min(Math.max(event.x, margin), width - margin);
            event.subject.fy = Math.min(Math.max(event.y, margin), height - margin);
          })
          .on("end", (event) => {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
          })
      );

    // Add the node labels
    svg
      .selectAll(".label")
      .data(nodes)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("dy", -15)
      .attr("text-anchor", "middle")
      .attr("fill", "red")
      .text((d: any) => d.label);

    // Update positions on each tick of the simulation
    simulation.on("tick", () => {
      linkElements
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      nodeElements
        .attr("cx", (d: any) => Math.min(Math.max(d.x, 10), width - 10))
        .attr("cy", (d: any) => Math.min(Math.max(d.y, 10), height - 10));

      svg
        .selectAll(".label")
        .attr("x", (d: any) => d.x)
        .attr("y", (d: any) => d.y);
    });
  }, [nodes, edges]);

  return <svg ref={svgRef}></svg>;
};

export default GraphVisualizer;
