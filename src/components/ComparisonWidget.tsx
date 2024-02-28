import { useState } from "react";
import "./ComparisonWidget.css";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

// interface ComparisonWidgetProps {
//   speciesData: Species[];
// }

export const ComparisonWidget = () => {
  const networkImages = Object.keys(sessionStorage).filter((key) =>
    (sessionStorage.getItem(key) || "").startsWith("data:image/jpeg")
  );

  // console.log(sessionStorage.);

  return (
    <div className="comparison-widget">
      <p className="comparison-title">Comparison</p>
      {networkImages.length == 0 && (
        <div className="empty-text">
          <p>Please select two networks to start a comparison</p>
        </div>
      )}
      {networkImages.map((key, index) => (
        <div>
          <img
            className="network-images"
            key={index}
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
                <p>Domain: {sessionStorage.getItem(key + "Domain")}</p>
                <p>
                  Evolution:{" "}
                  {sessionStorage.getItem(key + "Evolution") === "0"
                    ? "Unknown"
                    : sessionStorage.getItem(key + "Evolution")}
                </p>
                <p>Total Nodes:{sessionStorage.getItem(key + "Nodes")}</p>
                <p>Total Edges:{sessionStorage.getItem(key + "Edges")}</p>
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
                  window.location.reload();
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
      >
        Compare Networks
      </Button>
    </div>
  );
};
