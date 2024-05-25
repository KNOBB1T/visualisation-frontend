import {
  createRef,
  useEffect,
  useState,
  useCallback,
  useRef,
  useContext,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import visionet from "../assets/visionet.png";
import darkVisionet from "../assets/dark-visionet.png";

import "../Styling/NetworkView.css";
import "../App.css";
import { Button } from "react-bootstrap";
import { TailSpin } from "react-loader-spinner";
import {
  Cosmograph,
  CosmographProvider,
  CosmographRef,
} from "@cosmograph/react";
import { ComparisonWidget } from "../Components/ComparisonWidget";
import { useScreenshot, createFileName } from "use-react-screenshot";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faExpandAlt,
  faArrowsRotate,
  faVirus,
} from "@fortawesome/free-solid-svg-icons";
import {
  FullScreen,
  FullScreenHandle,
  useFullScreenHandle,
} from "react-full-screen";
import React from "react";
import { OptionsMenu } from "../Components/OptionsMenu";
import { ThemeContext } from "../Contexts/ThemeContext";

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
  density: number;
};

export type Taxon = {
  ScientificName: string;
  Rank: string;
};

export const NetworkView = ({ speciesData }: { speciesData: Species[] }) => {
  const { theme } = useContext(ThemeContext);
  const { queriedSpeciesId } = useParams();
  const parsedSpeciesId = Number(queriedSpeciesId);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Data>({
    nodes: [],
    links: [],
    density: 0,
  });
  const [taxonomy, setTaxonomy] = useState<Taxon[]>([]);
  const [networkLoading, setNetworkLoading] = useState<boolean>(true);
  const [taxonomyLoading, setTaxonomyLoading] = useState<boolean>(true);
  const [visualisedDisease, setVisualisedDisease] = useState("");
  const [diseaseProteins, setDiseaseProteins] = useState<Node[]>([]);
  const [lastHighlightedDisease, setLastHighlightedDisease] = useState("");
  const [reload, setReload] = useState(false);
  const [comparisonLength, setComparisonLength] = useState(
    Object.keys(sessionStorage).filter((key) =>
      (sessionStorage.getItem(key) || "").startsWith("data:image/jpeg")
    ).length
  );
  const validSpeciesIds = speciesData.map((species) => species.species_id);
  const [, saveNetwork] = useScreenshot({
    type: "image/jpeg",
    quality: 1.0,
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [, setSelectedNodes] = useState<Node[]>();
  const [, setSelectedLinks] = useState<Link[]>();
  const graphRef = createRef<HTMLDivElement>();
  const handle = useFullScreenHandle();
  const networkTaxonomy = Object.keys(sessionStorage)
    .filter((key) => key.endsWith("Taxonomy"))
    .map((key) => sessionStorage.getItem(key));

  const cosmograph = useRef<CosmographRef<Node, Link> | undefined>();
  const navigate = useNavigate();

  console.log("NETWORKVIEW RENDERING---------------------");

  const queriedSpecies = speciesData.find(
    (species) => species.species_id === parsedSpeciesId
  );

  console.log("NETWORK TAXONOMY: " + JSON.stringify(networkTaxonomy));

  const saveToSessionStorage = (network: string) => {
    let key = `${queriedSpecies?.compact_name}`;
    console.log("KEY: " + key);
    sessionStorage.setItem(key, network);
    sessionStorage.setItem(
      key + "SpeciesId",
      queriedSpecies?.species_id.toString() ?? ""
    );
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
    sessionStorage.setItem(key + "Density", data.density.toString());
    const jpegImageCount = Object.keys(sessionStorage).filter((key) =>
      (sessionStorage.getItem(key) || "").startsWith("data:image/jpeg")
    ).length;
    console.log("SESSION STORAGE: " + JSON.stringify(jpegImageCount));
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

  const addComparison = () => {
    saveNetwork(graphRef.current).then(saveToSessionStorage);
    console.log("SESSION STORAGE: " + JSON.stringify(sessionStorage));
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

  const returnInteractomes = () => {
    return new Promise((resolve, reject) => {
      const interactomeWorker = new Worker("/InteractomeRetriever.js");

      interactomeWorker.postMessage({ queriedSpeciesId: parsedSpeciesId });
      interactomeWorker.onmessage = (event) => {
        const interactomes = event.data;
        interactomeWorker.terminate();
        resolve(interactomes);
      };
      interactomeWorker.onerror = (error) => {
        reject(error);
      };
    });
  };

  const downloadInteractomes = async () => {
    try {
      const interactomes = await returnInteractomes();
      if (typeof interactomes === "string") {
        const dataStr =
          "data:text/tsv;charset=utf-8," + encodeURIComponent(interactomes);
        const speciesInteractomes = document.createElement("a");
        speciesInteractomes.setAttribute("href", dataStr);
        speciesInteractomes.setAttribute(
          "download",
          `${queriedSpecies?.compact_name}.tsv`
        );
        document.body.appendChild(speciesInteractomes); // required for firefox
        speciesInteractomes.click();
        speciesInteractomes.remove();
      } else {
        console.error("Interactomes data is not a string", interactomes);
      }
    } catch (error) {
      console.error("Error downloading interactomes", error);
    }
  };

  useEffect(() => {
    setNetworkLoading(true);
    const networkWorker = new Worker("/NetworkRenderer.js");

    networkWorker.postMessage({ parsedSpeciesId: parsedSpeciesId });
    networkWorker.onmessage = (event) => {
      // This will be called when the worker sends back the result
      const result = event.data;
      console.log("RESULT: " + JSON.stringify(result));
      if (result) {
        setData(result);
        console.log("RESULT: " + JSON.stringify(result.density));
      } else {
        console.error("Unexpected result:", result);
      }
      setNetworkLoading(false);
    };

    return () => {
      networkWorker.terminate();
    };
  }, [queriedSpeciesId]);

  useEffect(() => {
    setTaxonomyLoading(true);
    const taxonomyWorker = new Worker("/TaxonomyRetriever.js");

    taxonomyWorker.postMessage({ parsedSpeciesId: parsedSpeciesId });
    taxonomyWorker.onmessage = (event) => {
      // This will be called when the worker sends back the result
      const result = event.data;
      const sortedTaxonomy = [...result].sort((a, b) =>
        a.Rank.localeCompare(b.Rank)
      );
      setTaxonomy(sortedTaxonomy);
      console.log("TAXONOMY RESULT: " + JSON.stringify(result));
      setTaxonomyLoading(false);
    };

    return () => {
      taxonomyWorker.terminate();
    };
  }, [queriedSpeciesId]);

  useEffect(() => {
    if (speciesData.length > 0) {
      setIsLoading(false);
    }
  }, [speciesData]);

  function useSessionStorageSize() {
    const [size, setSize] = useState(Object.keys(sessionStorage).length);

    useEffect(() => {
      const interval = setInterval(() => {
        setSize(Object.keys(sessionStorage).length);
      }, 1000);

      // Cleanup
      return () => clearInterval(interval);
    }, []);

    return size;
  }

  const sessionStorageSize = useSessionStorageSize();

  useEffect(() => {
    const images = Object.keys(sessionStorage).filter((key) =>
      (sessionStorage.getItem(key) || "").startsWith("data:image/jpeg")
    );
    setComparisonLength(images.length);
    console.log("NETWORK COMPARISONS: " + JSON.stringify(comparisonLength));
  }, [sessionStorageSize]); // Update when sessionStorageSize changes

  const highlightDisease = (
    visualisedDisease: string,
    queriedSpeciesId: any
  ) => {
    if (visualisedDisease === lastHighlightedDisease) {
      setDiseaseProteins([]);
      setLastHighlightedDisease("");
      return;
    }

    setDiseaseProteins([]);
    const diseaseWorker = new Worker("/DiseaseRetriever.js");

    diseaseWorker.postMessage({
      visualisedDisease: visualisedDisease,
      queriedSpeciesId: queriedSpeciesId,
    });
    diseaseWorker.onmessage = (event) => {
      // This will be called when the worker sends back the result
      const proteins = event.data;

      console.log(proteins);

      const diseaseNodes = data.nodes.filter((node) =>
        proteins.includes(node.label)
      );

      console.log(diseaseNodes);

      setDiseaseProteins(diseaseNodes);
      setLastHighlightedDisease(visualisedDisease);
    };
  };

  if (isLoading) {
    return (
      <div
        className={`App ${theme === "Light" ? "light-theme" : "dark-theme"}`}
      >
        {taxonomyLoading && (
          <div className="page-loading-container">
            <TailSpin color="#e45e19" height="300px" width="300px" />
            <p className="loading-text">Loading...</p>
          </div>
        )}
      </div>
    );
  }

  if (!validSpeciesIds.includes(parsedSpeciesId)) {
    return (
      <div
        className={`App ${theme === "Light" ? "light-theme" : "dark-theme"}`}
      >
        <OptionsMenu />
        <div className="error-content">
          <div className="main-title">
            <img
              className={`visionet ${
                theme === "Light" ? "light-visionet" : "dark-visionet"
              }`}
              src={theme === "Light" ? visionet : darkVisionet}
              alt="visionet"
              onClick={() => navigate("/")}
            />
          </div>
          <div className="error-box">
            <p className="error-text">
              Warning: <span>Invalid Species!</span>
            </p>
            <p className="error-text">
              {" "}
              <span>Please amend this before observing!</span>
            </p>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div
        className={`App ${theme === "Light" ? "light-theme" : "dark-theme"}`}
      >
        <div className="content">
          <div className="main-title">
            <OptionsMenu />
            <img
              className={`visionet ${
                theme === "Light" ? "light-visionet" : "dark-visionet"
              }`}
              src={theme === "Light" ? visionet : darkVisionet}
              alt="visionet"
              onClick={() => navigate("/")}
            />
          </div>
          <div className="network">
            <p
              className={`speciesName ${
                theme === "Light" ? "light-theme" : "dark-theme"
              }`}
            >
              {queriedSpecies?.compact_name}
            </p>
          </div>
          <div className="screen">
            <div className="visualisation-pane">
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
                        <p className="detail-heading">Network Statistics</p>
                      </div>
                      <div className="species-details">
                        <p className="detail-stat">
                          No. of Proteins:{" "}
                          <span>{queriedSpecies?.total_nodes}</span>
                        </p>
                        <p className="detail-stat">
                          No. of Interactions:{" "}
                          <span>{queriedSpecies?.total_edges}</span>
                        </p>
                        <p className="detail-stat">
                          Evolutionary Distance:{" "}
                          <span>
                            {queriedSpecies?.evolution === 0
                              ? "Unknown"
                              : queriedSpecies?.evolution}
                          </span>
                        </p>
                        <p className="detail-stat">
                          Publication Count:{" "}
                          <span>{queriedSpecies?.publication_count}</span>
                        </p>
                        <p className="detail-stat">
                          Density: <span>{data.density}</span>
                        </p>
                      </div>
                      <div>
                        <p className="detail-heading">Taxonomy</p>
                      </div>
                      <div className="species-details">
                        {Array.isArray(taxonomy) &&
                          taxonomy
                            .map((taxon: Taxon) => ({
                              ...taxon,
                              Rank:
                                taxon.Rank === "superkingdom"
                                  ? "domain"
                                  : taxon.Rank,
                            }))
                            .sort((a, b) => a.Rank.localeCompare(b.Rank))
                            .map((taxon: Taxon, index: number) =>
                              taxon.Rank !== "no rank" ? (
                                <div key={index} className="detail-stat">
                                  {capitalizeRankFirstLetter(taxon.Rank)}:{" "}
                                  <span className="rank-style">
                                    {taxon.ScientificName}
                                  </span>
                                </div>
                              ) : null
                            )}
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
                        <CosmographProvider
                          nodes={data.nodes}
                          links={data.links}
                        >
                          <Cosmograph
                            ref={cosmograph}
                            key={`${
                              isFullscreen ? "fullscreen" : "windowed"
                            }-${reload}`}
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
                            nodeColor={(node) =>
                              diseaseProteins.find(
                                (diseaseNode) => diseaseNode.id === node.id
                              )
                                ? "red"
                                : "#357aa195"
                            }
                            hoveredNodeRingColor="#e45e19"
                            focusedNodeRingColor="#e45e19"
                            linkWidth={1}
                            linkArrows={false}
                            linkWidthScale={1}
                            backgroundColor={
                              theme === "Light" ? "white" : "black"
                            }
                            fitViewOnInit={true}
                            simulationGravity={0.1}
                            simulationLinkDistance={4}
                            simulationRepulsion={2}
                            simulationRepulsionTheta={1.15}
                            simulationFriction={0.5}
                            simulationLinkSpring={0.4}
                            nodeSamplingDistance={20}
                            onClick={selectNode}
                            onNodesFiltered={returnAssociatedNodes}
                            onLinksFiltered={returnAssociatedLinks}
                            linkGreyoutOpacity={0}
                            disableSimulation={false}
                          />
                        </CosmographProvider>
                      </div>
                    </FullScreen>
                  )}
                </div>
              </div>
              <div className="visualisation-features">
                <div className="network-buttons">
                  <Button
                    className="interactome-button"
                    onClick={downloadInteractomes}
                  >
                    Download Interactomes
                  </Button>
                  <Button
                    className="disease-button"
                    onClick={() => {
                      highlightDisease(visualisedDisease, queriedSpeciesId);
                    }}
                    disabled={queriedSpecies?.diseases.length === 0}
                  >
                    <FontAwesomeIcon icon={faVirus} className="disease-icon" />
                  </Button>
                  <select
                    className="visualised-disease"
                    value={visualisedDisease}
                    onChange={(e) => setVisualisedDisease(e.target.value)}
                    disabled={queriedSpecies?.diseases.length === 0}
                  >
                    {queriedSpecies?.diseases.length === 0 ? (
                      <option value="" selected disabled>
                        No Diseases
                      </option>
                    ) : (
                      <option value="" selected disabled>
                        Select a disease...
                      </option>
                    )}
                    {queriedSpecies?.diseases.map((disease) => (
                      <option
                        key={disease.species_disease}
                        value={disease.uniprot_disease}
                      >
                        {disease.species_disease}
                      </option>
                    ))}
                  </select>
                  <Button
                    className="comparison-button"
                    onClick={addComparison}
                    disabled={
                      comparisonLength >= 2 &&
                      !sessionStorage.getItem(`${queriedSpecies?.compact_name}`)
                    }
                  >
                    Add to Comparison
                  </Button>
                  <Button
                    className="screenshot-button"
                    onClick={screenshotNetwork}
                  >
                    <FontAwesomeIcon icon={faCamera} color="white" />
                  </Button>
                  <Button
                    className="reload-button"
                    onClick={() => {
                      setReload(!reload);
                    }}
                  >
                    <FontAwesomeIcon icon={faArrowsRotate} />
                  </Button>
                  <Button className="fullscreen-button" onClick={handle.enter}>
                    <FontAwesomeIcon icon={faExpandAlt} />
                  </Button>
                </div>
              </div>
            </div>
            <div>
              <ComparisonWidget />
            </div>
          </div>
        </div>
      </div>
    );
  }
};
