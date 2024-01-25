import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "./SearchBar.css";
import "./FilterModal.css";
import { Button } from "react-bootstrap";
import { FilterArrow } from "./FilterArrow";
import { Filter } from "./FilterModal";
import { useNavigate } from "react-router-dom";
import { Input } from "semantic-ui-react";

interface searchBarProps {
  speciesData: Species[];
}

export const SearchBar = ({ speciesData }: searchBarProps) => {
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const filterRef = useRef(null);

  const onSearch = (searchTerm: string) => {
    setInput(searchTerm);
    console.log("search ", searchTerm);
  };

  const resultFound = speciesData.some(
    (result) => result.compact_name.toLowerCase() === input.trim().toLowerCase()
  );

  const [isFilterPresent, setIsFilterPresent] = useState(false);

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

  const filteredResultsCount = speciesData.filter((item) => {
    const searchTerm = input.toLowerCase();
    const compactName = item.compact_name.toLowerCase();
    return (
      searchTerm &&
      compactName !== searchTerm &&
      (compactName.startsWith(searchTerm) ||
        compactName.includes(` ${searchTerm}`))
    );
  }).length;

  // handleFilter = (filterData) => {

  // }

  return (
    <div className="search-bar">
      <div className="input-wrapper">
        <div
          className="filter-button"
          onClick={() => {
            toggleFilterModal();
          }}
        >
          <Button className="filter" ref={filterRef}>
            Filter
          </Button>
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

      {isFilterPresent && <Filter />}

      {input.trim() && !resultFound && (
        <div className="search-results-container">
          <div className="dropdown">
            <div className="dropdown-container">
              {speciesData
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
          <div className="numOfResults">
            {filteredResultsCount}{" "}
            {filteredResultsCount === 1 ? "result" : "results"}
          </div>
        </div>
      )}
    </div>
  );
};
