import { useState } from "react";
import "../Styling/ComparisonWidget.css";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import React from "react";

export const ComparisonWidget = () => {
  // The images of the species prepared for comparison
  let networkImages = Object.keys(sessionStorage).filter((key) =>
    (sessionStorage.getItem(key) || "").startsWith("data:image/jpeg")
  );

  // The Network Densities of the species prepared for comparison
  const networkDensity = Object.keys(sessionStorage)
    .filter((key) => key.endsWith("Density"))
    .map((key) => JSON.parse(sessionStorage.getItem(key) || "[]"));

  // The Network Taxonomies of the species prepared for comparison
  const networkTaxonomy = Object.keys(sessionStorage)
    .filter((key) => key.endsWith("Taxonomy"))
    .map((key) => JSON.parse(sessionStorage.getItem(key) || "[]"));

  const [displayedKeys, setDisplayedKeys] = useState(() => {
    const initialKeys = Object.keys(sessionStorage);
    return initialKeys;
  });

  const [removedComparisons, setRemovedComparisons] = useState({});

  const { queriedSpeciesId } = useParams();

  const navigate = useNavigate();

  return (
    <div className="comparison-container">
      <div className="comparison-widget">
        <p className="comparison-title">Comparison</p>
        {networkImages.length == 0 && (
          <div className="empty-text">
            <p>Please add two networks to start a comparison</p>
          </div>
        )}
        {networkImages.map((key, index) => (
          <div className="species-overview" key={key}>
            <img
              className="network-images"
              key={key}
              src={sessionStorage.getItem(key) || undefined}
              alt={`networkImage${index}`}
            />
            <div className="comparison-tab">
              <div className="comparison-info">
                <div className="comparison-header">
                  <p
                    className="species-name"
                    onClick={() => {
                      const newSpeciesId = sessionStorage.getItem(
                        key + "SpeciesId"
                      );
                      if (newSpeciesId !== queriedSpeciesId) {
                        navigate(`/generateNetwork/${newSpeciesId}`);
                      }
                    }}
                  >
                    {sessionStorage.getItem(key + "CompactName")}
                  </p>
                </div>
                <div className="comparison-footer">
                  <p className="comparison-stat">
                    Domain:{" "}
                    <span className="comparison-value">
                      {sessionStorage.getItem(key + "Domain")}
                    </span>
                  </p>
                  <p className="comparison-stat">
                    Evolution:{" "}
                    <span className="comparison-value">
                      {sessionStorage.getItem(key + "Evolution") === "0"
                        ? "Unknown"
                        : sessionStorage.getItem(key + "Evolution")}
                    </span>
                  </p>
                  <p className="comparison-stat">
                    Proteins:{" "}
                    <span className="comparison-value">
                      {sessionStorage.getItem(key + "Nodes")}
                    </span>
                  </p>
                  <p className="comparison-stat">
                    Interactions:{" "}
                    <span className="comparison-value">
                      {sessionStorage.getItem(key + "Edges")}
                    </span>
                  </p>
                </div>
              </div>
              <div>
                <Button
                  className="remove-comparison"
                  aria-label="remove comparison"
                  onClick={() => {
                    const keysToRemove = [
                      key,
                      key + "SpeciesId",
                      key + "CompactName",
                      key + "Domain",
                      key + "Evolution",
                      key + "Nodes",
                      key + "Edges",
                      key + "Taxonomy",
                      key + "Density",
                    ];
                    // Store removed comparison in state
                    const removedComparison: { [key: string]: string | null } =
                      {};
                    keysToRemove.forEach((keyToRemove) => {
                      removedComparison[keyToRemove] =
                        sessionStorage.getItem(keyToRemove);
                      sessionStorage.removeItem(keyToRemove);
                    });
                    setRemovedComparisons({
                      ...removedComparisons,
                      [key]: removedComparison,
                    });
                    // Remove the key from displayedKeys
                    setDisplayedKeys(
                      displayedKeys.filter(
                        (displayedKey) => displayedKey !== key
                      )
                    );
                    console.log(networkImages);
                    console.log(networkImages.length);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faXmark}
                    className="cancel-comparison"
                  />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="compare-networks">
        <Button
          className="compare-network-button"
          disabled={sessionStorage.length < 12}
          onClick={() =>
            navigate("/networkComparison", {
              state: { networkImages, networkDensity, networkTaxonomy },
            })
          }
        >
          Compare Networks
        </Button>
      </div>
    </div>
  );
};
