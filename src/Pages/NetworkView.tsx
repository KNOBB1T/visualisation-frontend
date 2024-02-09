import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import visionet from "../visionet.png";
// import { Data, Node, Edge } from "../NetworkData";
import { SpeciesNetwork } from "../components/SpeciesNetwork";
import "./NetworkView.css";
import { Button } from "react-bootstrap";
import { SigmaContainer, FullScreenControl } from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import { TailSpin } from "react-loader-spinner";

export type Data = {
  nodes: string[];
  edges: { id: number; source: string; target: string }[];
};

export const NetworkView = ({ speciesData }: { speciesData: Species[] }) => {
  const { queriedSpeciesId } = useParams();
  const parsedSpeciesId = Number(queriedSpeciesId);
  const [nodes, setNodes] = useState<string[]>([]);
  const [edges, setEdges] = useState<
    { id: number; source: string; target: string }[]
  >([]);
  const [data, setData] = useState<Data>({ nodes: [], edges: [] });
  const [loading, setLoading] = useState<boolean>(true); // Add loading state

  const queriedSpecies = speciesData.find(
    (species) => species.species_id === parsedSpeciesId
  );

  useEffect(() => {
    const fetchNetwork = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/generateGraph/${queriedSpeciesId}`,
          {
            responseType: "text",
          }
        );

        const lines = response.data.split("\\n");
        const parsedNodes: Set<string> = new Set();
        const parsedEdges: { id: number; source: string; target: string }[] =
          [];

        lines.forEach((line: string, index: number) => {
          const [source, target] = line.trim().split(" ");
          if (source && target) {
            parsedNodes.add(source);
            parsedNodes.add(target);
            parsedEdges.push({ id: index, source, target });
          }
        });

        const nodes = Array.from(parsedNodes);
        const edges = parsedEdges;

        setNodes(nodes);
        setEdges(edges);
        setData({ nodes, edges });

        setTimeout(() => {
          setLoading(false);
        }, 5500);

        console.log(JSON.stringify(nodes));
        console.log(JSON.stringify(edges));
      } catch (error) {
        console.error("Error fetching graph XML data:", error);
      }
    };

    return () => {
      fetchNetwork();
    };
  }, []);

  return (
    <div className="App">
      <div className="content">
        <div className="main-title">
          <img src={visionet} width={545} height={120} alt="visionet" />
        </div>
        <div className="network">
          <p className="speciesName">{queriedSpecies?.compact_name}</p>
        </div>
        <div className="network-frame">
          {loading && (
            <div className="loading-container">
              <TailSpin color="#e45e19" height="150px" width="150px" />
              <p className="loading-text">Loading...</p>
            </div>
          )}
          {!loading && (
            <SigmaContainer>
              <div className="fullscreen">
                <FullScreenControl />
              </div>
              <SpeciesNetwork data={data} />
            </SigmaContainer>
          )}
        </div>
        <div className="species-detail-modal">
          <div className="detail-heading">
            <p>Biological Classification</p>
          </div>
          <div className="species-details">
            <p>
              Compact Name: <span>{queriedSpecies?.compact_name}</span>
            </p>
            <p className="taxonomy">Taxonomy: {queriedSpecies?.taxonomy}</p>
            <p>
              Domain of Life: <span>{queriedSpecies?.domain}</span>
            </p>
            <p>
              Evolution: <span>{queriedSpecies?.evolution}</span>
            </p>
          </div>
          <div className="detail-heading">
            <p>Network Statistics</p>
          </div>
          <div className="species-details">
            <p>
              Nodes: <span>{queriedSpecies?.total_nodes}</span>
            </p>
            <p>
              Edges: <span>{queriedSpecies?.total_edges}</span>
            </p>
            <p>
              Publication Count:{" "}
              <span>{queriedSpecies?.publication_count}</span>
            </p>
          </div>
        </div>
        <div className="network-buttons">
          <Button className="comparison-button">Add to Comparison</Button>
        </div>
      </div>
    </div>
  );
};
