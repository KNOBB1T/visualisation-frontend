import * as d3 from "d3";
import { Node, Edge, Data } from "../NetworkData";
import { useEffect, useRef } from "react";

type SpeciesNetworkProps = {
  width: number;
  height: number;
  data: Data;
};

export const SpeciesNetwork = ({
  data,
  width,
  height,
}: SpeciesNetworkProps) => {
  // const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data) return;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    svg.style("border", "5px solid #357aa1");
    svg.style("background-color", "white");

    const simulation = d3
      .forceSimulation(data.nodes)
      .force(
        "link",
        d3
          .forceLink(data.edges)
          .id((d) => (d as Edge).id)
          .distance(100)
      )
      .force("charge", d3.forceManyBody().strength(0))
      .force("center", d3.forceCenter(width / 2, height / 2));

    // Create edges
    const links = svg
      .selectAll("line")
      .data(data.edges)
      .enter()
      .append("line")
      .attr("stroke", "#aaa")
      .attr("stroke-width", 1);

    // Create nodes
    const nodes = svg
      .selectAll("circle")
      .data(data.nodes)
      .enter()
      .append("circle")
      .attr("r", 5)
      .attr("fill", "blue");

    simulation.on("tick", () => {
      links
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      nodes.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);
    });

    return () => {
      // Clean up simulation on component unmount
      simulation.stop();
    };
  }, [data]);

  return <svg ref={svgRef}></svg>;
};
