import { useLocation, useNavigate } from "react-router-dom";
import visionet from "../assets/visionet.png";
import "../Styling/ComparisonView.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { OptionsMenu } from "../Components/OptionsMenu";

export const ComparisonView = ({ speciesData }: { speciesData: Species[] }) => {
  const location = useLocation();
  const comparedSpecies = location.state.networkImages;
  const speciesDensity = location.state.networkDensity;
  const speciesTaxonomy = location.state.networkTaxonomy;

  const navigate = useNavigate();

  function capitalizeRankFirstLetter(rank: string) {
    return rank.charAt(0).toUpperCase() + rank.slice(1);
  }

  if (sessionStorage.length < 12) {
    return (
      <div className="App">
        <OptionsMenu />
        <div className="error-content">
          <div className="main-title">
            <img
              className="visionet"
              src={visionet}
              alt="visionet"
              onClick={() => navigate("/")}
            />
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
    const speciesCompare0 = speciesData.find(
      (species) => species.compact_name === comparedSpecies[0]
    );
    const speciesCompare1 = speciesData.find(
      (species) => species.compact_name === comparedSpecies[1]
    );

    return (
      <div className="App">
        <div className="content">
          <div className="main-title">
            <OptionsMenu />
            <img
              className="visionet"
              src={visionet}
              alt="visionet"
              onClick={() => navigate("/")}
            />
          </div>
          <div className="comparison-interface">
            <div className="species1">
              <div className="speciesName">
                <span
                  onClick={() => {
                    navigate(`/generateNetwork/${speciesCompare0?.species_id}`);
                  }}
                >
                  {comparedSpecies[0]}
                </span>
              </div>
              <div className="comparison-styling-left">
                <div className="image-styling">
                  <div className="species1-image">
                    <img
                      className="network-image"
                      src={
                        sessionStorage.getItem(comparedSpecies[0]) || undefined
                      }
                      alt={`${speciesCompare0}-NetworkImage`}
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
                        <span>{speciesCompare0?.compact_name}</span>
                      </p>
                      <p>
                        Domain of Life: <span>{speciesCompare0?.domain}</span>
                      </p>
                      <p>
                        Evolution:{" "}
                        <span>
                          {speciesCompare0?.evolution === 0
                            ? "Unknown"
                            : speciesCompare0?.evolution}
                        </span>
                      </p>
                    </div>
                    <div className="comparison-statistics">
                      <p className="detail-heading">Network Statistics</p>
                      <div className="nodes-edges">
                        <p className="nodes">
                          Proteins: <span>{speciesCompare0?.total_nodes}</span>
                        </p>
                        <p>
                          Interactions:{" "}
                          <span>{speciesCompare0?.total_edges}</span>
                        </p>
                      </div>
                      <p>
                        Publication Count:{" "}
                        <span>{speciesCompare0?.publication_count}</span>
                      </p>
                      <p>
                        Density: <span>{speciesDensity[0]}</span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="detail-heading">Taxonomy</p>
                    <div className="comparison-taxonomy">
                      {speciesTaxonomy[0].map((taxon: any, i: number) => {
                        if (taxon.Rank === "no rank") {
                          return null; // Skip this item
                        }

                        return (
                          <div key={i}>
                            {capitalizeRankFirstLetter(
                              taxon.Rank === "superkingdom"
                                ? "domain"
                                : taxon.Rank
                            )}
                            :{" "}
                            <span className="rank-style">
                              {taxon.ScientificName}
                              {i < speciesTaxonomy[0].length - 1
                                ? ",\u00A0"
                                : ""}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="species2">
              <div className="speciesName">
                <span
                  onClick={() => {
                    navigate(`/generateNetwork/${speciesCompare1?.species_id}`);
                  }}
                >
                  {comparedSpecies[1]}
                </span>
              </div>
              <div className="comparison-styling-right">
                <div className="image-styling">
                  <div className="species2-image">
                    <img
                      className="network-image"
                      src={
                        sessionStorage.getItem(comparedSpecies[1]) || undefined
                      }
                      alt={`${speciesCompare0}-NetworkImage`}
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
                          Proteins: <span>{speciesCompare1?.total_nodes}</span>
                        </p>
                        <p>
                          Interactions:{" "}
                          <span>{speciesCompare1?.total_edges}</span>
                        </p>
                      </div>
                      <p>
                        Publication Count:{" "}
                        <span>{speciesCompare1?.publication_count}</span>
                      </p>
                      <p>
                        Density: <span>{speciesDensity[1]}</span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="detail-heading">Taxonomy</p>
                    <div className="comparison-taxonomy">
                      {speciesTaxonomy[1].map((taxon: any, i: number) => {
                        if (taxon.Rank === "no rank") {
                          return null; // Skip this item
                        }

                        return (
                          <div key={i}>
                            {capitalizeRankFirstLetter(
                              taxon.Rank === "superkingdom"
                                ? "domain"
                                : taxon.Rank
                            )}
                            :{" "}
                            <span className="rank-style">
                              {taxon.ScientificName}
                              {i < speciesTaxonomy[1].length - 1
                                ? ",\u00A0"
                                : ""}
                            </span>
                          </div>
                        );
                      })}
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
