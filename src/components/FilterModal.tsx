import { Button } from "react-bootstrap";
import "./FilterModal.css";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import Slider from "react-slider";

export interface FilterData {
  domain: string;
  disease: string;
  nodeNum: string;
  edgeNum: string;
  publicationNum: string;
  evolution: number[];
  evolutionInteraction: boolean;
}

interface filterModalProps {
  filterParams: (filterData: FilterData) => void;
  filterData: FilterData;
}

export const Filter = ({ filterParams, filterData }: filterModalProps) => {
  const [selectedDomain, setSelectedDomain] = useState("");
  const [selectedDisease, setSelectedDisease] = useState("");
  const [selectedNodeNum, setSelectedNodeNum] = useState("");
  const [selectedEdgeNum, setSelectedEdgeNum] = useState("");
  const [selectedPublicationNum, setSelectedPublicationNum] = useState("");
  const [selectedEvolution, setSelectedEvolution] = useState([0, 0]);
  const [evolutionInteraction, setEvolutionInteraction] = useState(false);
  const [emptyFilter, setEmptyFilter] = useState(true);

  const defaultFilterData: FilterData = {
    domain: "",
    disease: "",
    nodeNum: "",
    edgeNum: "",
    publicationNum: "",
    evolution: [0, 0],
    evolutionInteraction: false,
  };

  useEffect(() => {
    const objectsAreEqual =
      JSON.stringify(filterData) === JSON.stringify(defaultFilterData);
    setEmptyFilter(objectsAreEqual);

    console.log("emptyFilter is: " + JSON.stringify(emptyFilter));
  }, [filterData, defaultFilterData]);

  const applyFilter = () => {
    const filterData: FilterData = {
      domain: selectedDomain,
      disease: selectedDisease,
      nodeNum: selectedNodeNum,
      edgeNum: selectedEdgeNum,
      publicationNum: selectedPublicationNum,
      evolution: selectedEvolution,
      evolutionInteraction: evolutionInteraction,
    };

    filterParams(filterData);
  };

  const removeFilter = () => {
    setSelectedDomain("");
    setSelectedDisease("");
    setSelectedNodeNum("");
    setSelectedEdgeNum("");
    setSelectedPublicationNum("");
    setSelectedEvolution([0, 0]);
    setEvolutionInteraction(false);

    filterParams(defaultFilterData);
    // setFilterData(defaultFilterData);

    console.log(filterData);
  };

  const handleEvolutionInput = () => {
    if (selectedEvolution[0] === selectedEvolution[1]) {
      return selectedEvolution[0];
    } else {
      return selectedEvolution[0] + " to " + selectedEvolution[1];
    }
  };

  const handleEvolutionInteraction = (newValue: number[]) => {
    setSelectedEvolution(newValue);
    setEvolutionInteraction(true);
  };

  console.log("filter: " + JSON.stringify(filterData));
  console.log("default: " + JSON.stringify(defaultFilterData));

  return (
    <div className="filter-modal">
      <div className="filter-wrapper">
        <div className="select-container">
          <div id="domain-option">
            <p className="filter-text">Domain of Life:</p>
            <div>
              <select
                className="selectedDomain"
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
              >
                <option value=""> Select... </option>
                <option value="Archaea"> Archaea </option>
                <option value="Bacteria"> Bacteria </option>
                <option value="Eukaryota"> Eukaryota </option>
                <option value="_"> Undefined </option>
              </select>
            </div>
          </div>
          <div id="node-option">
            <p className="filter-text">Nodes:</p>
            <div>
              <select
                className="selectedNodeNum"
                value={selectedNodeNum}
                onChange={(e) => setSelectedNodeNum(e.target.value)}
              >
                <option value=""> Select... </option>
                <option value="n < 100"> Less than 100 </option>
                <option value="n >= 100 && n <= 1000">
                  Between 100 and 1000
                </option>
                <option value="n >= 1000 && n <= 5000">
                  Between 1000 and 5000
                </option>
                <option value="n >= 5000 && n <= 10000">
                  Between 5000 and 10000
                </option>
                <option value="n > 10000"> Greater than 10000 </option>
              </select>
            </div>
          </div>
          <div id="edge-option">
            <p className="filter-text">Edges:</p>
            <div>
              <select
                className="selectedEdgeNum"
                value={selectedEdgeNum}
                onChange={(e) => setSelectedEdgeNum(e.target.value)}
              >
                <option value=""> Select... </option>
                <option value="e < 200"> Less than 200 </option>
                <option value="e >= 200 && e <= 20000">
                  Between 200 and 20000
                </option>
                <option value="e >= 20000 && e <= 200000">
                  Between 20000 and 200000
                </option>
                <option value="e >= 200000 && e <= 400000">
                  Between 200000 and 400000
                </option>
                <option value="e >= 400000 && e <= 800000">
                  Between 400000 and 800000
                </option>
                <option value="e > 800000">Greater than 800000</option>
              </select>
            </div>
          </div>
        </div>
        <div className="filter-second-row">
          <div id="publication-option">
            <p className="filter-text">Publication Count:</p>
            <div>
              <select
                className="selectedPublicationNum"
                value={selectedPublicationNum}
                onChange={(e) => setSelectedPublicationNum(e.target.value)}
              >
                <option value=""> Select... </option>
                <option value="p < 1000"> Less than 1000 </option>
                <option value="p >= 1000 && p <= 10000">
                  Between 1000 and 10000
                </option>
                <option value="p >= 10000 && p <= 100000">
                  Between 10000 and 100000
                </option>
                <option value="p >= 100000 && p <= 1000000">
                  Between 100000 and 1000000
                </option>
                <option value="p >= 1000000 && p <= 10000000">
                  Between 1000000 and 10000000
                </option>
                <option value="p >10000000">Greater than 10000000</option>
              </select>
            </div>
          </div>
          <div id="disease-option">
            <p className="filter-text">Disease Related:</p>
            <div>
              <select
                className="selectedDisease"
                value={selectedDisease}
                onChange={(e) => setSelectedDisease(e.target.value)}
              >
                <option value=""> No </option>
                <option value="true"> Yes </option>
              </select>
            </div>
          </div>
          <div id="evolution-option">
            <p className="evolution-text">Evolution:</p>
            <div>
              <Slider
                className="selectedEvolution"
                thumbClassName="evolutionThumb"
                onChange={handleEvolutionInteraction}
                value={selectedEvolution}
                min={0}
                max={5}
                marks={5}
                step={0.1}
              />
              <p className="evolution-value">{handleEvolutionInput()}</p>
            </div>
          </div>
          {/* <FontAwesomeIcon icon={faClose} className="closeEvolution" /> */}
        </div>
      </div>
      <div className="filter-buttons">
        <Button
          className="apply"
          onClick={applyFilter}
          disabled={
            !selectedDomain &&
            !selectedDisease &&
            !selectedNodeNum &&
            !selectedEdgeNum &&
            !selectedPublicationNum &&
            !evolutionInteraction
          }
        >
          Apply
        </Button>
        <Button className="clear" onClick={removeFilter} disabled={emptyFilter}>
          Remove Filter
        </Button>
      </div>
    </div>
  );
};