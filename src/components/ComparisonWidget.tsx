import { useState } from "react";
import "./ComparisonWidget.css";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

// interface ComparisonWidgetProps {
//   speciesData: Species[];
// }

export const ComparisonWidget = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const networkImages = Object.keys(sessionStorage).filter((key) =>
    (sessionStorage.getItem(key) || "").startsWith("data:image/jpeg")
  );

  const networkTaxonomy = Object.keys(sessionStorage)
    .filter((key) => key.endsWith("Taxonomy"))
    .map((key) => JSON.parse(sessionStorage.getItem(key) || "[]"));

  const navigate = useNavigate();

  return (
    <div className="comparison-widget">
      <p className="comparison-title">Comparison</p>
      {networkImages.length == 0 && (
        <div className="empty-text">
          <p>Please add two networks to start a comparison</p>
        </div>
      )}
      {networkImages.map((key, index) => (
        <div className="species-overview">
          <img
            className="network-images"
            key={key}
            src={sessionStorage.getItem(key) || undefined}
            alt={`networkImage${index}`}
          />
          <div className="comparison-tab">
            <div className="comparison-info">
              <div className="comparison-header">
                <p className="species-name">
                  {sessionStorage.getItem(key + "CompactName")}
                </p>
              </div>
              <div className="comparison-footer">
                <p>
                  Domain:{" "}
                  <span className="comparison-value">
                    {sessionStorage.getItem(key + "Domain")}
                  </span>
                </p>
                <p>
                  Evolution:{" "}
                  <span className="comparison-value">
                    {sessionStorage.getItem(key + "Evolution") === "0"
                      ? "Unknown"
                      : sessionStorage.getItem(key + "Evolution")}
                  </span>
                </p>
                <p>
                  Total Nodes:{" "}
                  <span className="comparison-value">
                    {sessionStorage.getItem(key + "Nodes")}
                  </span>
                </p>
                <p>
                  Total Edges:{" "}
                  <span className="comparison-value">
                    {sessionStorage.getItem(key + "Edges")}
                  </span>
                </p>
              </div>
            </div>
            <div>
              <Button
                className="remove-comparison"
                onClick={() => {
                  sessionStorage.removeItem(key);
                  sessionStorage.removeItem(key + "CompactName");
                  sessionStorage.removeItem(key + "Domain");
                  sessionStorage.removeItem(key + "Evolution");
                  sessionStorage.removeItem(key + "Nodes");
                  sessionStorage.removeItem(key + "Edges");
                  sessionStorage.removeItem(key + "Taxonomy");
                  setRefreshKey((oldKey) => oldKey + 1); // This will trigger a re-render of your component
                }}
              >
                <FontAwesomeIcon icon={faXmark} className="cancel-comparison" />
              </Button>
            </div>
          </div>
        </div>
      ))}
      <Button
        className="compare-network-button"
        disabled={sessionStorage.length < 12}
        onClick={() =>
          navigate("/networkComparison", {
            state: { networkImages, networkTaxonomy },
          })
        }
      >
        Compare Networks
      </Button>
    </div>
  );
};
