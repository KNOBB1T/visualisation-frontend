import { Button } from "react-bootstrap";
import "../Styling/Filter.css";
import { useEffect, useState } from "react";
import Slider from "react-slider";
import React from "react";

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
  removeFilterParams: (filterData: FilterData) => void;
  filterData: FilterData;
}

export const Filter = ({
  filterParams,
  removeFilterParams,
  filterData = {
    domain: "",
    disease: "",
    nodeNum: "",
    edgeNum: "",
    publicationNum: "",
    evolution: [0, 5],
    evolutionInteraction: false,
  },
}: filterModalProps) => {
  const [selectedDomain, setSelectedDomain] = useState(filterData.domain);
  const [selectedDisease, setSelectedDisease] = useState(filterData.disease);
  const [selectedNodeNum, setSelectedNodeNum] = useState(filterData.nodeNum);
  const [selectedEdgeNum, setSelectedEdgeNum] = useState(filterData.edgeNum);
  const [selectedPublicationNum, setSelectedPublicationNum] = useState(
    filterData.publicationNum
  );
  const [selectedEvolution, setSelectedEvolution] = useState(
    filterData.evolution
  );
  const [evolutionInteraction, setEvolutionInteraction] = useState(
    filterData.evolutionInteraction
  );
  const [emptyFilter, setEmptyFilter] = useState(true);

  //List of possible diseases accessible in Visionet
  const Diseases = [
    { species_disease: "Alzheimer's Disease", uniprot_disease: "Alzheimer's" },
    {
      species_disease: "Amyotrophic lateral sclerosis (ALS)",
      uniprot_disease: "Amyotrophic lateral sclerosis",
    },
    { species_disease: "Cancer", uniprot_disease: "Cancer" },
    {
      species_disease: "Creutzfeldt-Jakob Disease",
      uniprot_disease: "Creutzfeldt-Jakob",
    },
    { species_disease: "Cystic Fibrosis", uniprot_disease: "Cystic Fibrosis" },
    { species_disease: "Gaucher's Disease", uniprot_disease: "Gaucher" },
    { species_disease: "Huntington's Disease", uniprot_disease: "Huntington" },
    { species_disease: "Parkinson's Disease", uniprot_disease: "Parkinson" },
    { species_disease: "Prion Disease", uniprot_disease: "Prion" },
  ];

  // Empty filter placeholder
  const defaultFilterData: FilterData = {
    domain: "",
    disease: "",
    nodeNum: "",
    edgeNum: "",
    publicationNum: "",
    evolution: [0, 5],
    evolutionInteraction: false,
  };

  // If there is no filter, set it as empty
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
    setSelectedEvolution([0, 5]);
    setEvolutionInteraction(false);

    removeFilterParams(defaultFilterData);

    console.log(filterData);
  };

  const handleEvolutionInput = () => {
    if (evolutionInteraction == false) {
      return;
    }

    if (selectedEvolution[0] === selectedEvolution[1]) {
      return selectedEvolution[0];
    } else {
      return selectedEvolution[0] + " to " + selectedEvolution[1];
    }
  };

  const handleEvolutionInteraction = (newValues: number[]) => {
    setSelectedEvolution(newValues);
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
                data-testid="selectedDomain"
                className="selectedDomain"
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
              >
                <option value="" disabled>
                  {" "}
                  Select...{" "}
                </option>
                <option value="Archaea"> Archaea </option>
                <option value="Bacteria"> Bacteria </option>
                <option value="Eukaryota"> Eukaryota </option>
              </select>
            </div>
          </div>
          <div id="node-option">
            <p className="filter-text">No. of Proteins:</p>
            <div>
              <select
                data-testid="selectedNodeNum"
                className="selectedNodeNum"
                value={selectedNodeNum}
                onChange={(e) => setSelectedNodeNum(e.target.value)}
              >
                <option value="" disabled>
                  {" "}
                  Select...{" "}
                </option>
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
            <p className="filter-text">No. of Interactions:</p>
            <div>
              <select
                data-testid="selectedEdgeNum"
                className="selectedEdgeNum"
                value={selectedEdgeNum}
                onChange={(e) => setSelectedEdgeNum(e.target.value)}
              >
                <option value="" disabled>
                  {" "}
                  Select...{" "}
                </option>
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
                <option value="e > 400000">Greater than 400000</option>
              </select>
            </div>
          </div>
        </div>
        <div className="filter-second-row">
          <div id="publication-option">
            <p className="filter-text">Publication Count:</p>
            <div>
              <select
                data-testid="selectedPublicationNum"
                className="selectedPublicationNum"
                value={selectedPublicationNum}
                onChange={(e) => setSelectedPublicationNum(e.target.value)}
              >
                <option value="" disabled>
                  {" "}
                  Select...{" "}
                </option>
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
                data-testid="selectedDisease"
                className="selectedDisease"
                value={selectedDisease}
                onChange={(e) => setSelectedDisease(e.target.value)}
              >
                <option value="" disabled>
                  {" "}
                  Select...{" "}
                </option>
                {Diseases.map((disease) => (
                  <option
                    key={disease.species_disease}
                    value={disease.uniprot_disease}
                  >
                    {disease.species_disease}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div id="evolution-option">
            <p className="evolution-text">Evolutionary Distance:</p>
            <div>
              <Slider
                data-testid="selectedEvolution"
                className="selectedEvolution"
                thumbClassName="evolutionThumb"
                pearling
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
          Apply Filter
        </Button>
        <Button className="clear" onClick={removeFilter} disabled={emptyFilter}>
          Remove Filter
        </Button>
      </div>
    </div>
  );
};
