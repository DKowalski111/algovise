import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export interface GraphNode extends d3.SimulationNodeDatum {
  id: number;
  label: string;
}

interface GraphEdge {
  source: number;
  target: number;
  weight: number;
}

interface GraphVisualizerProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  weighted: boolean;
  directed: boolean;
}

const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ nodes, edges, weighted, directed }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const width = 600;
    const height = 400;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove();

    const defs = svg.append("defs");
    defs
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 15)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#999");

    const simulation = d3
      .forceSimulation(nodes)
      .force("link", d3.forceLink(edges).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-150))
      .force("center", d3.forceCenter(width / 2, height / 2));

    // Links
    const linkElements = svg
      .selectAll(".link")
      .data(edges)
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("stroke", "#999")
      .attr("stroke-width", 2)
      .attr("marker-end", directed ? "url(#arrow)" : null);

    // **Add text for the edge weights**
    const edgeLabelElements = svg
      .selectAll(".edge-label")
      .data(edges)
      .enter()
      .append("text")
      .attr("class", "edge-label")
      .attr("font-size", 12)
      .attr("fill", "orange")
      .attr("dy", -5)
      .text((d) => d.weight);

    // Nodes
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
            const margin = 10;
            event.subject.fx = Math.min(Math.max(event.x, margin), width - margin);
            event.subject.fy = Math.min(Math.max(event.y, margin), height - margin);
          })
          .on("end", (event) => {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
          })
      );

    // Node labels
    const nodeLabelElements = svg
      .selectAll(".label")
      .data(nodes)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("dy", -15)
      .attr("text-anchor", "middle")
      .attr("fill", "red")
      .text((d: any) => d.label);

    // On every tick, update positions
    simulation.on("tick", () => {
      linkElements
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      if (weighted) {
        edgeLabelElements
          .attr("x", (d: any, i: number) => {
            const midX = (d.source.x + d.target.x) / 2;
            return midX + i * 10;
          })
          .attr("y", (d: any) => {
            const midY = (d.source.y + d.target.y) / 2;
            return midY;
          });
      }

      nodeElements
        .attr("cx", (d: any) => Math.min(Math.max(d.x, 10), width - 15))
        .attr("cy", (d: any) => Math.min(Math.max(d.y, 10), height - 15));

      nodeLabelElements
        .attr("x", (d: any) => d.x)
        .attr("y", (d: any) => d.y);
    });
  }, [nodes, edges, weighted, directed]);

  return <svg ref={svgRef} />;
};

export default GraphVisualizer;
