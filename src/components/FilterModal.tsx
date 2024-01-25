import { Button } from "react-bootstrap";
import "./FilterModal.css";
import { useState } from "react";
import { filter } from "d3";

export const Filter = () => {
  const [selectedDomain, setSelectedDomain] = useState("Select...");
  const [selectedDisease, setSelectedDisease] = useState("No");
  const [selectedNodeNum, setSelectedNodeNum] = useState("Select...");
  const [selectedEdgeNum, setSelectedEdgeNum] = useState("Select...");

  // const applyFilter = () => {
  //   domain: selectedDomain;
  //   disease: selectedDisease;
  //   nodeNum: selectedNodeNum;
  //   edgeNum: selectedEdgeNum;
  // };

  return (
    <div className="filter-modal">
      <div className="filter-wrapper">
        <div className="select-container">
          <div id="filter-option">
            <p className="filter-text">Domain of Life:</p>
            <div>
              <select
                name="selectedDomain"
                defaultValue="select"
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
              >
                <option value="select"> Select... </option>
                <option value="less-than-100"> Archaea </option>
                <option value="between-100-and-1000"> Bacteria </option>
                <option value="between-1000-and-5000"> Eukaryota </option>
              </select>
            </div>
          </div>
          <div id="filter-option">
            <p className="filter-text">Disease Related:</p>
            <div>
              <select
                name="selectedDisease"
                defaultValue="no"
                value={selectedDisease}
                onChange={(e) => setSelectedDisease(e.target.value)}
              >
                <option value="yes"> Yes </option>
                <option value="no"> No </option>
              </select>
            </div>
          </div>
          <div id="filter-option">
            <p className="filter-text">Number of Nodes:</p>
            <div>
              <select
                name="selectedNodeNum"
                defaultValue="select"
                value={selectedNodeNum}
                onChange={(e) => setSelectedNodeNum(e.target.value)}
              >
                <option value="select"> Select... </option>
                <option value="less-than-100"> Less than 100 </option>
                <option value="between-100-and-1000">
                  Between 100 and 1000
                </option>
                <option value="between-1000-and-5000">
                  Between 1000 and 5000
                </option>
                <option value="between-5000-and-10000">
                  Between 5000 and 10000
                </option>
                <option value="greater-than-10000"> Greater than 10000 </option>
              </select>
            </div>
          </div>
          <div id="filter-option">
            <p className="filter-text">Number of Edges:</p>
            <div>
              <select
                name="selectedEdgeNum"
                defaultValue="select"
                value={selectedEdgeNum}
                onChange={(e) => setSelectedEdgeNum(e.target.value)}
              >
                <option value="select"> Select... </option>
                <option value="less-than-200"> Less than 200 </option>
                <option value="between-200-and-20000">
                  Between 200 and 20000
                </option>
                <option value="between-20000-and-200000">
                  Between 20000 and 200000
                </option>
                <option value="between-200000-and-400000">
                  Between 200000 and 400000
                </option>
                <option value="between-400000-and-800000">
                  Between 400000 and 800000
                </option>
                <option value="greater-than-800000">Greater than 800000</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Button className="apply">Apply</Button>
      </div>
    </div>
  );
};
