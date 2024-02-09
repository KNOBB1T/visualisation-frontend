import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "./SearchBar.css";
import "./FilterModal.css";
import { Button } from "react-bootstrap";
import { FilterArrow } from "./FilterArrow";
import { Filter, FilterData } from "./FilterModal";
import { useNavigate } from "react-router-dom";
import * as math from "mathjs";

interface searchBarProps {
  speciesData: Species[];
}

export const SearchBar = ({ speciesData }: searchBarProps) => {
  const [input, setInput] = useState("");
  const [resultData, setResultData] = useState<Species[]>(speciesData);
  const [isFilterPresent, setIsFilterPresent] = useState(false);
  const [emptyFilter, setEmptyFilter] = useState(true);

  const defaultFilterData: FilterData = {
    domain: "",
    disease: "",
    nodeNum: "",
    edgeNum: "",
    publicationNum: "",
    evolution: [0, 5],
    evolutionInteraction: false,
  };

  let [filter, setFilter] = useState<FilterData>(defaultFilterData);

  console.log("before useEffect (Filter)" + JSON.stringify(filter));
  console.log("before useEffect (default)" + JSON.stringify(defaultFilterData));

  useEffect(() => {
    let filteredSpeciesData = speciesData;
    setResultData(filteredSpeciesData);

    const objectsAreEqual =
      JSON.stringify(filter) === JSON.stringify(defaultFilterData);
    setEmptyFilter(objectsAreEqual);

    console.log("after useEffect (Filter)" + JSON.stringify(filter));
    console.log(
      "after useEffect (default)" + JSON.stringify(defaultFilterData)
    );

    const updateResults = () => {
      console.log(speciesData.length);

      if (filter.domain != "") {
        filteredSpeciesData = filteredSpeciesData.filter(
          (item) => item.domain == filter.domain
        );
        // console.log(filteredSpeciesData.length);
        setResultData(filteredSpeciesData);
      }

      if (filter.nodeNum != "") {
        if (filter.nodeNum.includes("&&")) {
          const range = filter.nodeNum.split("&&").map((value) => value.trim());
          filteredSpeciesData = filteredSpeciesData.filter((item) => {
            const nodes = { n: item.total_nodes };
            return range.every((value) => math.evaluate(value, nodes));
          });
          setResultData(filteredSpeciesData);
        } else {
          filteredSpeciesData = filteredSpeciesData.filter((item) => {
            const nodes = { n: item.total_nodes };
            return math.evaluate(filter.nodeNum, nodes);
          });
          setResultData(filteredSpeciesData);
        }
      }

      if (filter.edgeNum != "") {
        if (filter.edgeNum.includes("&&")) {
          const range = filter.edgeNum.split("&&").map((value) => value.trim());
          filteredSpeciesData = filteredSpeciesData.filter((item) => {
            const edges = { e: item.total_edges };
            return range.every((value) => math.evaluate(value, edges));
          });
          setResultData(filteredSpeciesData);
        } else {
          filteredSpeciesData = filteredSpeciesData.filter((item) => {
            const edges = { e: item.total_edges };
            return math.evaluate(filter.edgeNum, edges);
          });
          setResultData(filteredSpeciesData);
        }
      }

      if (filter.publicationNum != "") {
        if (filter.publicationNum.includes("&&")) {
          const range = filter.publicationNum
            .split("&&")
            .map((value) => value.trim());
          filteredSpeciesData = filteredSpeciesData.filter((item) => {
            const publications = { p: item.publication_count };
            return range.every((value) => math.evaluate(value, publications));
          });
          setResultData(filteredSpeciesData);
        } else {
          filteredSpeciesData = filteredSpeciesData.filter((item) => {
            const publications = { p: item.publication_count };
            return math.evaluate(filter.publicationNum, publications);
          });
          setResultData(filteredSpeciesData);
        }
      }

      if (filter.evolutionInteraction == true) {
        if (filter.evolution[0] !== filter.evolution[1]) {
          const [minValue, maxValue] = filter.evolution.map((value) => value);
          filteredSpeciesData = filteredSpeciesData.filter((item) => {
            const evolutions = { ev: item.evolution };
            return (
              math.evaluate(`${evolutions.ev} >= ${minValue}`) &&
              math.evaluate(`${evolutions.ev} <= ${maxValue}`)
            );
          });
          setResultData(filteredSpeciesData);
        } else {
          filteredSpeciesData = filteredSpeciesData.filter((item) => {
            const [minValue, maxValue] = filter.evolution.map((value) => value);
            const evolution = { ev: item.evolution };
            return math.evaluate(`${evolution.ev} == ${minValue}`);
          });
          setResultData(filteredSpeciesData);
        }
      }
    };

    updateResults();
  }, [speciesData, filter]);

  const navigate = useNavigate();

  const onSearch = (searchTerm: string) => {
    setInput(searchTerm);
    if (isFilterPresent) {
      toggleFilterModal();
    }
    console.log("search ", searchTerm);
  };

  const resultFound = speciesData.some(
    (result) => result.compact_name.toLowerCase() === input.trim().toLowerCase()
  );

  const toggleFilterModal = () => {
    setIsFilterPresent(!isFilterPresent);
  };

  const generateNetwork = () => {
    const trimmedInput = input.trim();

    if (trimmedInput === "" || !resultFound) {
      return;
    }

    const queriedSpecies = speciesData.find(
      (species) => species.compact_name === trimmedInput
    );
    const queriedSpeciesId = queriedSpecies?.species_id;

    console.log(queriedSpeciesId);

    navigate(`/generateNetwork/${queriedSpeciesId}`);
  };

  const filteredResultsCount = resultData.filter((item) => {
    const searchTerm = input.toLowerCase();
    const compactName = item.compact_name.toLowerCase();
    return (
      searchTerm &&
      compactName !== searchTerm &&
      (compactName.startsWith(searchTerm) ||
        compactName.includes(` ${searchTerm}`))
    );
  }).length;

  const handleFilter = (filterData: FilterData) => {
    setFilter(filterData);
    console.log("Filter: " + JSON.stringify(filterData));
  };

  console.log(filter);

  return (
    <div className="search-bar">
      <div className="input-wrapper">
        <div
          className="filter-button"
          onClick={() => {
            toggleFilterModal();
          }}
        >
          <Button className="filter">Filter</Button>
          <FilterArrow filter={isFilterPresent} />
        </div>
        <div className="divider" />

        <input
          placeholder="Type to search..."
          value={input}
          spellCheck="false"
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="search-divider" />

        <Button id="search-icon" onClick={generateNetwork}>
          <FontAwesomeIcon icon={faSearch} />
        </Button>
      </div>

      {isFilterPresent && (
        <Filter filterParams={handleFilter} filterData={filter} />
      )}

      {input.trim() && !resultFound && (
        <div className="search-results-container">
          <div className="dropdown">
            <div className="dropdown-container">
              {resultData
                .filter((item) => {
                  const searchTerm = input.toLowerCase();
                  const compactName = item.compact_name.toLowerCase();
                  return (
                    searchTerm &&
                    compactName !== searchTerm &&
                    (compactName.startsWith(searchTerm) ||
                      compactName.includes(` ${searchTerm}`))
                  );
                })
                .sort((a, b) => a.compact_name.localeCompare(b.compact_name))
                .map((item) => (
                  <div
                    onClick={() => onSearch(item.compact_name)}
                    className="dropdown-row"
                    key={item.compact_name}
                  >
                    {item.compact_name}
                  </div>
                ))}
            </div>
          </div>
          <div className="results">
            {filteredResultsCount}{" "}
            {filteredResultsCount === 1 ? "result" : "results"}
          </div>
        </div>
      )}

      {!input.trim() && !resultFound && !emptyFilter && (
        <div className="search-results-container">
          <div className="dropdown">
            <div className="dropdown-container">
              {resultData
                .sort((a, b) => a.compact_name.localeCompare(b.compact_name))
                .map((item) => (
                  <div
                    onClick={() => onSearch(item.compact_name)}
                    className="dropdown-row"
                    key={item.compact_name}
                  >
                    {item.compact_name}
                  </div>
                ))}
            </div>
          </div>
          <div className="results">
            {resultData.length} {resultData.length === 1 ? "result" : "results"}
          </div>
        </div>
      )}
    </div>
  );
};
