import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import visionet from "../visionet.png";
import "./NetworkView.css";
import { Button } from "react-bootstrap";
import { TailSpin } from "react-loader-spinner";
import { ForceGraph2D } from "react-force-graph";

export type Data = {
  nodes: { id: string; name: string }[];
  links: { source: string; target: string }[];
};

export const NetworkView = ({ speciesData }: { speciesData: Species[] }) => {
  const { queriedSpeciesId } = useParams();
  const parsedSpeciesId = Number(queriedSpeciesId);
  const [data, setData] = useState<Data>({ nodes: [], links: [] });
  const [loading, setLoading] = useState<boolean>(true); // Add loading state
  const [cooldownTicks, setCooldownTicks] = useState(0);
  const [highlightedNode, setHighlightedNode] = useState(null);

  console.log("NETWORKVIEW RENDERING---------------------");

  const queriedSpecies = speciesData.find(
    (species) => species.species_id === parsedSpeciesId
  );

  const handleUserInteraction = () => {
    setCooldownTicks(0); // Adjust this number as needed
  };

  useEffect(() => {
    setLoading(true);
    const worker = new Worker("/networkRenderer.js");
    worker.postMessage({ queriedSpeciesId: parsedSpeciesId });
    worker.onmessage = (event) => {
      // This will be called when the worker sends back the result
      const result = event.data;
      setData(result);
      console.log("RESULT: " + JSON.stringify(result));
      setLoading(false);
    };

    return () => {
      worker.terminate();
    };
  }, []);

  return (
    <div className="App">
      <div className="content">
        <div className="main-title">
          <img className="visionet" src={visionet} alt="visionet" />
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
            <div className="network-graph" onClick={handleUserInteraction}>
              <ForceGraph2D
                graphData={data}
                onNodeHover={(node) => {
                  document.body.style.cursor = node ? "pointer" : "";
                }}
                nodeLabel="label"
                cooldownTicks={cooldownTicks} // Adjust this value as needed
                warmupTicks={3000} // Adjust this value as needed
                // onEngineStop={() => setLoading(false)}
                // d3AlphaDecay={1}
              />
            </div>
          )}
        </div>
        <div className="network-buttons">
          <Button className="comparison-button">Add to Comparison</Button>
          {/* <Button className="reload-button" onClick={refreshGraph}>
            Reload
          </Button> */}
        </div>
        <div className="species-detail-modal">
          <div className="detail-heading">
            <p>Biological Classification</p>
          </div>
          <div className="species-details">
            <p>
              Compact Name: <span>{queriedSpecies?.compact_name}</span>
            </p>
            <p className="taxonomy">
              Taxonomy: <span>{queriedSpecies?.taxonomy}</span>
            </p>
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
      </div>
    </div>
  );
};
