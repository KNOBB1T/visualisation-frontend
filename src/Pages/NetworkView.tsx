import { createRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import visionet from "../visionet.png";
import "./NetworkView.css";
import { Button } from "react-bootstrap";
import { TailSpin } from "react-loader-spinner";
import { Cosmograph } from "@cosmograph/react";
import { ComparisonWidget } from "../components/ComparisonWidget";
import { useScreenshot, createFileName } from "use-react-screenshot";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faExpandAlt } from "@fortawesome/free-solid-svg-icons";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

export type Data = {
  nodes: { id: string; label: string }[];
  links: { source: string; target: string }[];
};

export const NetworkView = ({ speciesData }: { speciesData: Species[] }) => {
  const { queriedSpeciesId } = useParams();
  const parsedSpeciesId = Number(queriedSpeciesId);
  const [data, setData] = useState<Data>({ nodes: [], links: [] });
  const [loading, setLoading] = useState<boolean>(true); // Add loading state
  // const [cooldownTicks, setCooldownTicks] = useState(0);
  // const [highlightedNode, setHighlightedNode] = useState(null);
  const [network, saveNetwork] = useScreenshot({
    type: "image/jpeg",
    quality: 1.0,
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const graphRef = createRef<HTMLDivElement>();

  console.log("NETWORKVIEW RENDERING---------------------");

  const queriedSpecies = speciesData.find(
    (species) => species.species_id === parsedSpeciesId
  );

  const fullscreen = () => {
    if (graphRef.current) {
      graphRef.current.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
      setIsFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
    //   if (!isFullscreen) {
    //     // Enter fullscreen
    //     const element = document.documentElement;
    //     if (element.requestFullscreen) {
    //       element.requestFullscreen();
    //     }
    //   } else {
    //     // Exit fullscreen
    //     if (document.exitFullscreen) {
    //       document.exitFullscreen();
    //     }
    //   }
    //   setIsFullscreen(!isFullscreen);
  };

  const screenshotNetwork = () =>
    saveNetwork(graphRef.current).then(downloadNetwork);

  const downloadNetwork = (
    network: string,
    { name = queriedSpecies?.compact_name, extension = "png" } = {}
  ) => {
    const targetNetwork = document.createElement("a");
    targetNetwork.href = network;
    targetNetwork.download = createFileName(extension, name);
    targetNetwork.click();
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
        <div className="visualisation-interface">
          <div className={`network-frame ${isFullscreen ? "fullscreen" : ""}`}>
            {loading && (
              <div className="loading-container">
                <TailSpin color="#e45e19" height="150px" width="150px" />
                <p className="loading-text">Loading...</p>
              </div>
            )}
            {!loading && (
              <div
                className={`network-graph ${isFullscreen ? "fullscreen" : ""}`}
                ref={graphRef}
              >
                <Cosmograph
                  nodeLabelAccessor={(node) => node.label}
                  showHoveredNodeLabel={true}
                  hoveredNodeLabelClassName={"hovered-node-label"}
                  showDynamicLabels={false}
                  hoveredNodeLabelColor="white"
                  nodes={data.nodes}
                  nodeSize={1}
                  nodeColor={"#357aa1"}
                  hoveredNodeRingColor="#e45e19"
                  focusedNodeRingColor="#e45e19"
                  links={data.links}
                  linkWidth={1}
                  linkArrows={false}
                  backgroundColor="white"
                  fitViewOnInit={true}
                  spaceSize={1000}
                  // spaceSize={500}
                />
              </div>
            )}
          </div>
          <div className="comparison">
            <ComparisonWidget />
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
        <div className="network-buttons">
          <Button className="screenshot-button" onClick={screenshotNetwork}>
            <FontAwesomeIcon icon={faCamera} color="white" />
          </Button>
          <Button className="comparison-button">Add to Comparison</Button>
          <Button className="fullscreen-button" onClick={fullscreen}>
            <FontAwesomeIcon icon={faExpandAlt} />
          </Button>
        </div>
      </div>
    </div>
  );
};
