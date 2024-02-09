import { useEffect, useRef } from "react";
import { Data } from "../Pages/NetworkView";
import { Sigma } from "sigma";
import { SigmaContainer, useLoadGraph, useSigma } from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import Graph, { MultiGraph, MultiUndirectedGraph } from "graphology";

export const SpeciesNetwork = ({ data }: { data: Data }) => {
  const loadGraph = useLoadGraph();

  useEffect(() => {
    const generateNetwork = async () => {
      const graph = new MultiUndirectedGraph({ multi: true });

      console.log("DATA: " + JSON.stringify(data));

      data.nodes.forEach((node) => {
        graph.addNode(node, {
          x: Math.random(),
          y: Math.random(),
          size: 8,
          // label: node,
          color: "#357aa1",
        });
      });

      data.edges.forEach((edge) => {
        if (!graph.hasEdge(edge.source, edge.target)) {
          graph.addUndirectedEdgeWithKey(edge.id, edge.source, edge.target);
        }
      });

      loadGraph(graph);
    };

    return () => {
      generateNetwork();
    };
  }, [loadGraph]);

  return null;
};
