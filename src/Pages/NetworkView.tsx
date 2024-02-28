import { createRef, useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import visionet from "../visionet.png";
import "./NetworkView.css";
import { Button } from "react-bootstrap";
import { TailSpin } from "react-loader-spinner";
import {
  Cosmograph,
  CosmographProvider,
  CosmographRef,
} from "@cosmograph/react";
import { ComparisonWidget } from "../components/ComparisonWidget";
import { useScreenshot, createFileName } from "use-react-screenshot";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faExpandAlt } from "@fortawesome/free-solid-svg-icons";
import {
  FullScreen,
  FullScreenHandle,
  useFullScreenHandle,
} from "react-full-screen";

export type Node = {
  id: string;
  label: string;
};

export type Link = {
  source: string;
  target: string;
};

export type Data = {
  nodes: Node[];
  links: Link[];
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
  const [selectedNodes, setSelectedNodes] = useState<Node[]>();
  const [selectedLinks, setSelectedLinks] = useState<Link[]>();
  const graphRef = createRef<HTMLDivElement>();
  const handle = useFullScreenHandle();
  const networkImages = Object.keys(sessionStorage).filter((key) =>
    (sessionStorage.getItem(key) || "").startsWith("data:image/jpeg")
  );
  const cosmograph = useRef<CosmographRef<Node, Link> | undefined>();

  console.log("NETWORKVIEW RENDERING---------------------");

  const queriedSpecies = speciesData.find(
    (species) => species.species_id === parsedSpeciesId
  );

  // const taxonomy = queriedSpecies?.taxonomy.split(";");

  const addComparison = () => {
    saveNetwork(graphRef.current).then(saveToSessionStorage);
  };

  console.log("NETWORK IMAGES: " + JSON.stringify(networkImages));

  const saveToSessionStorage = (network: string) => {
    let key = `${queriedSpecies?.compact_name}`;
    console.log("KEY: " + key);
    sessionStorage.setItem(key, network);
    sessionStorage.setItem(
      key + "CompactName",
      queriedSpecies?.compact_name ?? ""
    );
    sessionStorage.setItem(key + "Domain", queriedSpecies?.domain ?? "");
    sessionStorage.setItem(
      key + "Evolution",
      queriedSpecies?.evolution.toString() ?? ""
    );
    sessionStorage.setItem(
      key + "Nodes",
      queriedSpecies?.total_nodes.toString() ?? ""
    );
    sessionStorage.setItem(
      key + "Edges",
      queriedSpecies?.total_edges.toString() ?? ""
    );
  };

  const fullscreen = useCallback(
    (state: boolean, handle: FullScreenHandle) => {
      if (handle === handle) {
        console.log("Screen 1 went to", state, handle);
        setIsFullscreen(state);
      }
    },
    [handle]
  );

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

  const returnAssociatedNodes = useCallback((nodes?: Node[]) => {
    setSelectedNodes(nodes);
  }, []);

  const returnAssociatedLinks = useCallback((edges?: Link[]) => {
    setSelectedLinks(edges);
  }, []);

  const selectNode = useCallback((node?: Node) => {
    cosmograph.current?.focusNode(node);
    if (node) {
      cosmograph.current?.selectNode(node, true);
    } else {
      cosmograph.current?.unselectNodes();
    }
  }, []);

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
        <div className="screen">
          <div className="visualisation-interface">
            <div className="species-detail-modal">
              <div>
                <p className="detail-heading">Biological Classification</p>
              </div>
              <div className="species-details">
                <p>
                  Compact Name: <span>{queriedSpecies?.compact_name}</span>
                </p>
                <p>
                  Domain of Life: <span>{queriedSpecies?.domain}</span>
                </p>
                <p>
                  Evolution:{" "}
                  <span>
                    {queriedSpecies?.evolution === 0
                      ? "Unknown"
                      : queriedSpecies?.evolution}
                  </span>
                </p>
              </div>
              <div>
                <p className="detail-heading">Network Statistics</p>
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
              <div>
                <p className="detail-heading">Taxonomy</p>
              </div>
            </div>
            <div className={"network-frame"}>
              {loading && (
                <div className="loading-container">
                  <TailSpin color="#e45e19" height="150px" width="150px" />
                  <p className="loading-text">Loading...</p>
                </div>
              )}
              {!loading && (
                <FullScreen
                  handle={handle}
                  onChange={fullscreen}
                  className="fullScreenNetwork"
                >
                  <div
                    className={`network-graph ${
                      isFullscreen ? "fullscreen" : ""
                    }`}
                    ref={graphRef}
                  >
                    <CosmographProvider nodes={data.nodes} links={data.links}>
                      <Cosmograph
                        ref={cosmograph}
                        key={isFullscreen ? "fullscreen" : "windowed"}
                        nodes={data.nodes}
                        nodeSizeScale={1}
                        links={data.links}
                        nodeLabelAccessor={(node) => `${node.label}`}
                        showHoveredNodeLabel={true}
                        hoveredNodeLabelClassName={"hovered-node-label"}
                        showDynamicLabels={false}
                        hoveredNodeLabelColor="white"
                        nodeSize={3}
                        nodeColor={"#357aa195"}
                        hoveredNodeRingColor="#e45e19"
                        focusedNodeRingColor="#e45e19"
                        linkWidth={1}
                        linkArrows={false}
                        linkWidthScale={1}
                        backgroundColor="white"
                        fitViewOnInit={true}
                        simulationGravity={0.15}
                        simulationLinkDistance={4}
                        simulationRepulsion={2}
                        simulationRepulsionTheta={1.15}
                        simulationFriction={0.85}
                        simulationLinkSpring={0.4}
                        nodeSamplingDistance={20}
                        onClick={selectNode}
                        onNodesFiltered={returnAssociatedNodes}
                        onLinksFiltered={returnAssociatedLinks}
                        nodeGreyoutOpacity={0}
                        linkGreyoutOpacity={0}

                        // spaceSize={500}
                      />
                    </CosmographProvider>
                  </div>
                </FullScreen>
              )}
            </div>
          </div>
          <div>
            <ComparisonWidget />
          </div>
        </div>
        <div className="buttons">
          <div className="network-buttons">
            <Button className="screenshot-button" onClick={screenshotNetwork}>
              <FontAwesomeIcon icon={faCamera} color="white" />
            </Button>
            <Button
              className="comparison-button"
              onClick={addComparison}
              disabled={
                networkImages.length >= 2 &&
                !sessionStorage.getItem(`${queriedSpecies?.compact_name}`)
              }
            >
              Add to Comparison
            </Button>
            <Button className="fullscreen-button" onClick={handle.enter}>
              <FontAwesomeIcon icon={faExpandAlt} />
            </Button>
          </div>
          {/* <Button className="compare-network-button">Compare Networks</Button> */}
        </div>
      </div>
    </div>
  );
};
