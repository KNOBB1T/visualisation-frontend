import { useLocation, useNavigate } from "react-router-dom";
import visionet from "../visionet.png";
import "./ComparisonView.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { Taxon } from "./NetworkView";

export const ComparisonView = ({ speciesData }: { speciesData: Species[] }) => {
  const location = useLocation();
  const comparedSpecies = location.state.networkImages;
  const speciesDensity = location.state.networkDensity;
  const speciesTaxonomy = location.state.networkTaxonomy;

  const navigateHome = useNavigate();

  speciesTaxonomy.forEach((name: string) => {
    console.log(name);
  });

  function capitalizeRankFirstLetter(rank: string) {
    return rank.charAt(0).toUpperCase() + rank.slice(1);
  }

  if (sessionStorage.length < 12) {
    return (
      <div className="App">
        <button className="home-button" onClick={() => navigateHome("/")}>
          <FontAwesomeIcon icon={faHouse} color="white" className="home-icon" />
        </button>
        <div className="error-content">
          <div className="main-title">
            <img className="visionet" src={visionet} alt="visionet" />
          </div>
          <div className="error-box">
            <p className="error-text">
              Warning: <span>Comparisons must contain two species</span>
            </p>
            <p className="error-text">
              {" "}
              <span>Please amend this before comparing!</span>
            </p>
          </div>
        </div>
      </div>
    );
  } else {
    const speciesCompare1 = speciesData.find(
      (species) => species.compact_name === comparedSpecies[0]
    );
    const speciesCompare2 = speciesData.find(
      (species) => species.compact_name === comparedSpecies[1]
    );

    return (
      <div className="App">
        <div className="content">
          <button className="home-button" onClick={() => navigateHome("/")}>
            <FontAwesomeIcon
              icon={faHouse}
              color="white"
              className="home-icon"
            />
          </button>
          <div className="main-title">
            <img className="visionet" src={visionet} alt="visionet" />
          </div>
          <div className="comparison-interface">
            <div className="species1">
              <p className="speciesName">{comparedSpecies[0]}</p>
              <div className="comparison-styling-left">
                <div className="image-styling">
                  <div className="species1-image">
                    <img
                      className="network-image"
                      src={
                        sessionStorage.getItem(comparedSpecies[0]) || undefined
                      }
                      alt={`${speciesCompare1}-NetworkImage`}
                    />
                  </div>
                </div>
                <div className="species1-data">
                  <div className="comparison-top-row">
                    <div className="comparison-classification">
                      <p className="detail-heading">
                        Biological Classification
                      </p>
                      <p>
                        Compact Name:{" "}
                        <span>{speciesCompare1?.compact_name}</span>
                      </p>
                      <p>
                        Domain of Life: <span>{speciesCompare1?.domain}</span>
                      </p>
                      <p>
                        Evolution:{" "}
                        <span>
                          {speciesCompare1?.evolution === 0
                            ? "Unknown"
                            : speciesCompare1?.evolution}
                        </span>
                      </p>
                    </div>
                    <div className="comparison-statistics">
                      <p className="detail-heading">Network Statistics</p>
                      <div className="nodes-edges">
                        <p className="nodes">
                          Nodes: <span>{speciesCompare1?.total_nodes}</span>
                        </p>
                        <p>
                          Edges: <span>{speciesCompare1?.total_edges}</span>
                        </p>
                      </div>
                      <p>
                        Publication Count:{" "}
                        <span>{speciesCompare1?.publication_count}</span>
                      </p>
                      <p>
                        Density: <span>{speciesDensity[0]}</span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="detail-heading">Taxonomy</p>
                    <div className="comparison-taxonomy">
                      {speciesTaxonomy[0].map((taxon: any, i: number) => (
                        <div key={i}>
                          {taxon.ScientificName}:
                          <span className="rank-style">
                            {" "}
                            {capitalizeRankFirstLetter(
                              taxon.Rank === "superkingdom"
                                ? "domain"
                                : taxon.Rank
                            )}
                          </span>
                          {i < speciesTaxonomy[0].length - 1 ? ",\u00A0" : ""}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="species2">
              <p className="speciesName">{comparedSpecies[1]}</p>
              <div className="comparison-styling-right">
                <div className="image-styling">
                  <div className="species2-image">
                    <img
                      className="network-image"
                      src={
                        sessionStorage.getItem(comparedSpecies[1]) || undefined
                      }
                      alt={`${speciesCompare1}-NetworkImage`}
                    />
                  </div>
                </div>
                <div className="species2-data">
                  <div className="comparison-top-row">
                    <div className="comparison-classification">
                      <p className="detail-heading">
                        Biological Classification
                      </p>
                      <p>
                        Compact Name:{" "}
                        <span>{speciesCompare2?.compact_name}</span>
                      </p>
                      <p>
                        Domain of Life: <span>{speciesCompare2?.domain}</span>
                      </p>
                      <p>
                        Evolution:{" "}
                        <span>
                          {speciesCompare2?.evolution === 0
                            ? "Unknown"
                            : speciesCompare2?.evolution}
                        </span>
                      </p>
                    </div>
                    <div className="comparison-statistics">
                      <p className="detail-heading">Network Statistics</p>
                      <div className="nodes-edges">
                        <p className="nodes">
                          Nodes: <span>{speciesCompare2?.total_nodes}</span>
                        </p>
                        <p>
                          Edges: <span>{speciesCompare2?.total_edges}</span>
                        </p>
                      </div>
                      <p>
                        Publication Count:{" "}
                        <span>{speciesCompare2?.publication_count}</span>
                      </p>
                      <p>
                        Density: <span>{speciesDensity[1]}</span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="detail-heading">Taxonomy</p>
                    <div className="comparison-taxonomy">
                      {speciesTaxonomy[1].map((taxon: any, i: number) => (
                        <div key={i}>
                          {taxon.ScientificName}:
                          <span className="rank-style">
                            {" "}
                            {capitalizeRankFirstLetter(
                              taxon.Rank === "superkingdom"
                                ? "domain"
                                : taxon.Rank
                            )}
                          </span>
                          {i < speciesTaxonomy[1].length - 1 ? ",\u00A0" : ""}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
