// GraphVisualizer.tsx
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface Node extends d3.SimulationNodeDatum {
  id: number;
  label: string;
}

interface GraphVisualizerProps {
  nodes: Node[];
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

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3.forceLink(edges).id((d: any) => d.id).distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-150))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const linkElements = svg
      .selectAll(".link")
      .data(edges)
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("stroke", "#999")
      .attr("stroke-width", 2);

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
            event.subject.fx = event.x;
            event.subject.fy = event.y;
          })
          .on("end", (event) => {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
          })
      );

    svg
      .selectAll(".label")
      .data(nodes)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("dy", -15)
      .attr("text-anchor", "middle")
      .text((d: any) => d.label);

    simulation.on("tick", () => {
      linkElements
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      nodeElements
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);

      svg
        .selectAll(".label")
        .attr("x", (d: any) => d.x)
        .attr("y", (d: any) => d.y);
    });
  }, [nodes, edges]);

  return <svg ref={svgRef}></svg>;
};

export default GraphVisualizer;
