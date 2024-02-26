import { useState } from "react";
import "./ComparisonWidget.css";
import { Button } from "react-bootstrap";

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
      <div>
        <div className="empty-text">
          {networkImages.length == 0 && (
            <p>Please select two networks to start a comparison</p>
          )}
        </div>
        {networkImages.map((key, index) => (
          <div>
            <img
              className="network-images"
              key={index}
              src={sessionStorage.getItem(key) || undefined}
              alt={`networkImage${index}`}
            />
            <div>
              <p>{sessionStorage.getItem(key + "compactName")}</p>
            </div>
          </div>
        ))}
      </div>
      <Button className="compare-network-button">Compare Networks</Button>
    </div>
  );
};
