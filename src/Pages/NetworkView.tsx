import { createRef, useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import {
  faCamera,
  faExpandAlt,
  faHouse,
  faArrowsRotate,
  faVirus,
} from "@fortawesome/free-solid-svg-icons";
import {
  FullScreen,
  FullScreenHandle,
  useFullScreenHandle,
} from "react-full-screen";

export type Node = {
  id: string;
  label: string;
  clustering_coefficient: number;
  degree: number;
};

export type Link = {
  source: string;
  target: string;
};

export type Data = {
  nodes: Node[];
  links: Link[];
};

export type Taxon = {
  ScientificName: string;
  Rank: string;
};

export const NetworkView = ({ speciesData }: { speciesData: Species[] }) => {
  const { queriedSpeciesId } = useParams();
  const parsedSpeciesId = Number(queriedSpeciesId);
  const [data, setData] = useState<Data>({ nodes: [], links: [] });
  const [taxonomy, setTaxonomy] = useState<Taxon[]>([]);
  const [networkLoading, setNetworkLoading] = useState<boolean>(true);
  const [taxonomyLoading, setTaxonomyLoading] = useState<boolean>(true);
  const [visualisedDisease, setVisualisedDisease] = useState("");
  const [networkDensity, setNetworkDensity] = useState(0);
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
  const networkTaxonomy = Object.keys(sessionStorage)
    .filter((key) => key.endsWith("Taxonomy"))
    .map((key) => sessionStorage.getItem(key));

  const cosmograph = useRef<CosmographRef<Node, Link> | undefined>();
  const navigateHome = useNavigate();

  console.log("NETWORKVIEW RENDERING---------------------");

  const queriedSpecies = speciesData.find(
    (species) => species.species_id === parsedSpeciesId
  );

  const addComparison = () => {
    saveNetwork(graphRef.current).then(saveToSessionStorage);
  };

  // console.log("storage: " + JSON.stringify(sessionStorage));

  console.log("NETWORK IMAGES: " + JSON.stringify(networkImages));

  console.log("NETWORK TAXONOMY: " + JSON.stringify(networkTaxonomy));

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
    sessionStorage.setItem(key + "Taxonomy", JSON.stringify(taxonomy));
    sessionStorage.setItem(key + "Density", networkDensity.toString() ?? "");
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

  function capitalizeRankFirstLetter(rank: string) {
    return rank.charAt(0).toUpperCase() + rank.slice(1);
  }

  useEffect(() => {
    setNetworkLoading(true);
    const networkWorker = new Worker("/networkRenderer.js");

    networkWorker.postMessage({ queriedSpeciesId: parsedSpeciesId });
    networkWorker.onmessage = (event) => {
      // This will be called when the worker sends back the result
      const result = event.data;
      setData(result);
      console.log("RESULT: " + JSON.stringify(result));
      setTaxonomyLoading(false);
    };

    return () => {
      networkWorker.terminate();
    };
  }, []);

  useEffect(() => {
    const taxonomyWorker = new Worker("/taxonomyRetriever.js");

    let newDensity = 0;

    if (queriedSpecies && queriedSpecies.total_nodes !== 1) {
      newDensity = parseFloat(
        (
          (2 * (queriedSpecies?.total_edges ?? 0)) /
          ((queriedSpecies?.total_nodes ?? 1) *
            (queriedSpecies?.total_nodes ?? 1 - 1))
        ).toFixed(2)
      );
    }

    if (newDensity !== networkDensity) {
      setNetworkDensity(newDensity);
    }

    taxonomyWorker.postMessage({ queriedSpeciesId: parsedSpeciesId });
    taxonomyWorker.onmessage = (event) => {
      // This will be called when the worker sends back the result
      const result = event.data;
      setTaxonomy(result);
      setNetworkLoading(false);
      console.log("TAXONOMY RESULT: " + JSON.stringify(result));
    };

    return () => {
      taxonomyWorker.terminate();
    };
  }, [queriedSpecies]);

  console.log("DENSITY: " + networkDensity.toString);

  return (
    <div className="App">
      <div className="content">
        <button className="home-button" onClick={() => navigateHome("/")}>
          <FontAwesomeIcon icon={faHouse} color="white" className="home-icon" />
        </button>
        <div className="main-title">
          <img className="visionet" src={visionet} alt="visionet" />
        </div>
        <div className="network">
          <p className="speciesName">{queriedSpecies?.compact_name}</p>
        </div>
        <div className="screen">
          <div className="visualisation-interface">
            <div className="species-detail-modal">
              <p className="attribute-title">Attributes</p>
              {taxonomyLoading && (
                <div className="taxonomy-loading-container">
                  <TailSpin color="#e45e19" height="150px" width="150px" />
                  <p className="loading-text">Loading...</p>
                </div>
              )}
              {!networkLoading && (
                <div className="attributes">
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
                    <p>
                      Density: <span>{networkDensity}</span>
                    </p>
                  </div>
                  <div>
                    <p className="detail-heading">Taxonomy</p>
                  </div>
                  <div className="species-details">
                    {Array.isArray(taxonomy) &&
                      taxonomy.map((taxon: Taxon) => (
                        <div key={taxon.ScientificName}>
                          {taxon.ScientificName}:
                          <span className="rank-style">
                            {" "}
                            {capitalizeRankFirstLetter(
                              taxon.Rank === "superkingdom"
                                ? "domain"
                                : taxon.Rank
                            )}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
            <div className={"network-frame"}>
              {networkLoading && (
                <div className="network-loading-container">
                  <TailSpin color="#e45e19" height="150px" width="150px" />
                  <p className="loading-text">Loading...</p>
                </div>
              )}
              {!networkLoading && (
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
                        nodeLabelAccessor={(node): string => {
                          return `<div><u>${
                            node.label
                          }</u><br/>Clustering Coefficient: ${node.clustering_coefficient.toFixed(
                            2
                          )}<br/>
                          Degree: ${node.degree}</div>
                          </div>`;
                        }}
                        showHoveredNodeLabel={true}
                        hoveredNodeLabelClassName={"hovered-node-label"}
                        showDynamicLabels={false}
                        hoveredNodeLabelColor={"#e45e19"}
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
              className="reload-button"
              onClick={() => {
                window.location.reload();
              }}
            >
              <FontAwesomeIcon icon={faArrowsRotate} />
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
            <Button className="disease-button">
              <FontAwesomeIcon icon={faVirus} />
            </Button>
            <select
              className="visualised-disease"
              value={visualisedDisease}
              onChange={(e) => setVisualisedDisease(e.target.value)}
            >
              <option value="" disabled selected>
                {" "}
                Select a disease...{" "}
              </option>
              <option value="Dementia"> Dementia </option>
              <option value="Huntington's Disease">
                {" "}
                Huntington's Disease{" "}
              </option>
              <option value="Sickle Cell Disease"> Sickle Cell Disease </option>
            </select>
            <Button className="fullscreen-button" onClick={handle.enter}>
              <FontAwesomeIcon icon={faExpandAlt} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
