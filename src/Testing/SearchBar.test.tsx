import "@testing-library/jest-dom";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { SearchBar } from "../Components/SearchBar";
import { MemoryRouter, BrowserRouter as Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import React from "react";
import ResizeObserver from "resize-observer-polyfill";

global.ResizeObserver = ResizeObserver;

describe("SearchBar", () => {
  const speciesData: Species[] = [
    {
      index: BigInt(0),
      species_id: 1,
      compact_name: "Homo sapiens",
      official_NCBI_name: "Species 1",
      evolution: 3.2,
      domain: "Bacteria",
      taxonomy_level2: "Bacteria",
      species_name_compact: "Species 1",
      publication_count: 37,
      total_nodes: 25,
      total_edges: 69,
      taxonomy: "Bacteria",
      diseases: [{ species_disease: "Cancer", uniprot_disease: "Cancer" }],
    },
    {
      index: BigInt(1),
      species_id: 2,
      compact_name: "Species 2",
      official_NCBI_name: "Species 2",
      evolution: 0,
      domain: "Archaea",
      taxonomy_level2: "Archaea",
      species_name_compact: "Species 2",
      publication_count: 1800,
      total_nodes: 99,
      total_edges: 22,
      taxonomy: "Archaea",
      diseases: [],
    },
    {
      index: BigInt(2),
      species_id: 3,
      compact_name: "Species 3",
      official_NCBI_name: "Species 3",
      evolution: 0,
      domain: "Eukaryota",
      taxonomy_level2: "Eukaryota",
      species_name_compact: "Species 3",
      publication_count: 1690,
      total_nodes: 999,
      total_edges: 2000,
      taxonomy: "Bacteria",
      diseases: [],
    },
  ];

  test("renders SearchBar component", () => {
    render(
      <Router>
        <SearchBar speciesData={speciesData as Species[]} />
      </Router>
    );
  });

  test("allows input of text", () => {
    const { getByPlaceholderText } = render(
      <Router>
        <SearchBar speciesData={speciesData as Species[]} />
      </Router>
    );
    const input = getByPlaceholderText("Type to search...") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "species1" } });
    expect(input.value).toBe("species1");
  });

  test("displays filter modal when filter button is clicked", async () => {
    render(
      <Router>
        <SearchBar speciesData={speciesData} />
      </Router>
    );
    const filterButton = screen.getByTestId("filter-button");
    userEvent.click(filterButton);
    const modalTitle = await screen.findByText("Filter");
    expect(modalTitle).toBeDefined();
  });

  test("clears input when invalid species is entered", () => {
    render(
      <Router>
        <SearchBar speciesData={speciesData as Species[]} />
      </Router>
    );

    const input = screen.getByPlaceholderText(
      "Type to search..."
    ) as HTMLInputElement;
    fireEvent.change(input, {
      target: { value: "Invalid species! Please try again." },
    });
    fireEvent.click(screen.getByTestId("search-icon"));

    expect(input.value).toBe("");
  });

  test("displays dropdown rows when input is entered", async () => {
    render(
      <Router>
        <SearchBar speciesData={speciesData} />
      </Router>
    );

    // Simulate a user typing into the search input
    fireEvent.change(screen.getByPlaceholderText("Type to search..."), {
      target: { value: "Homo" },
    });

    // Wait for the dropdown rows to be displayed
    await waitFor(() => {
      const dropdownRows = screen.getAllByTestId("dropdown-row");
      expect(dropdownRows).toHaveLength(1);
      expect(dropdownRows[0]).toHaveTextContent("Homo sapiens");
    });
  });

  it("updates the input value when typing", () => {
    const { getByPlaceholderText } = render(
      <Router>
        <SearchBar speciesData={speciesData} />
      </Router>
    );
    const input: HTMLInputElement = getByPlaceholderText(
      "Type to search..."
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Homo Sapiens" } });
    expect(input.value).toBe("Homo Sapiens");
  });

  test("filters species data by domain", async () => {
    render(
      <MemoryRouter>
        <SearchBar speciesData={speciesData} />
      </MemoryRouter>
    );

    // simulate opening the filter form
    userEvent.click(screen.getByTestId("filter-button"));
    // select the domain
    const domainSelect = await screen.findByTestId("selectedDomain");
    userEvent.selectOptions(domainSelect, "Archaea");
    userEvent.click(screen.getByText("Apply Filter"));

    // wait for any asynchronous operations to complete
    await waitFor(() => {
      // check that the filtered data only includes items with the correct domain
      const resultData: HTMLElement[] = screen.getAllByTestId("resultData");
      expect(resultData).toHaveLength(1);
      expect(resultData[0]).toHaveTextContent("Species 2");
    });
  });

  test("filters species data by node number", async () => {
    render(
      <MemoryRouter>
        <SearchBar speciesData={speciesData} />
      </MemoryRouter>
    );

    // simulate opening the filter form
    userEvent.click(screen.getByTestId("filter-button"));
    // select the node number range
    const nodeNumSelect = await screen.findByTestId("selectedNodeNum");
    userEvent.selectOptions(nodeNumSelect, "n >= 100 && n <= 1000");
    userEvent.click(screen.getByText("Apply Filter"));

    // wait for any asynchronous operations to complete
    await waitFor(() => {
      // check that the filtered data only includes items with the correct node number
      const resultData: HTMLElement[] = screen.getAllByTestId("resultData");
      expect(resultData).toHaveLength(1);
      expect(resultData[0]).toHaveTextContent("Species 3");
    });
  });

  test("filters species data by node number (if lowest value)", async () => {
    render(
      <MemoryRouter>
        <SearchBar speciesData={speciesData} />
      </MemoryRouter>
    );

    // simulate opening the filter form
    userEvent.click(screen.getByTestId("filter-button"));
    // select the node number
    const nodeNumSelect = await screen.findByTestId("selectedNodeNum");
    userEvent.selectOptions(nodeNumSelect, "n < 100");
    userEvent.click(screen.getByText("Apply Filter"));

    // wait for any asynchronous operations to complete
    await waitFor(() => {
      // check that the filtered data only includes items with the correct node number
      const resultData: HTMLElement[] = screen.getAllByTestId("resultData");
      expect(resultData).toHaveLength(2);
      expect(resultData[0]).toHaveTextContent("Homo sapiens");
      expect(resultData[1]).toHaveTextContent("Species 2");
    });
  });

  test("filters species data by edge number", async () => {
    render(
      <MemoryRouter>
        <SearchBar speciesData={speciesData} />
      </MemoryRouter>
    );

    // simulate opening the filter form
    userEvent.click(screen.getByTestId("filter-button"));
    // select the node number range
    const nodeNumSelect = await screen.findByTestId("selectedEdgeNum");
    userEvent.selectOptions(nodeNumSelect, "e >= 200 && e <= 20000");
    userEvent.click(screen.getByText("Apply Filter"));

    // wait for any asynchronous operations to complete
    await waitFor(() => {
      // check that the filtered data only includes items with the correct node number
      const resultData: HTMLElement[] = screen.getAllByTestId("resultData");
      expect(resultData).toHaveLength(1);
      expect(resultData[0]).toHaveTextContent("Species 3");
    });
  });

  test("filters species data by edge number (if lowest value)", async () => {
    render(
      <MemoryRouter>
        <SearchBar speciesData={speciesData} />
      </MemoryRouter>
    );

    // simulate opening the filter form
    userEvent.click(screen.getByTestId("filter-button"));
    // select the node number
    const nodeNumSelect = await screen.findByTestId("selectedEdgeNum");
    userEvent.selectOptions(nodeNumSelect, "e < 200");
    userEvent.click(screen.getByText("Apply Filter"));

    // wait for any asynchronous operations to complete
    await waitFor(() => {
      // check that the filtered data only includes items with the correct node number
      const resultData: HTMLElement[] = screen.getAllByTestId("resultData");
      expect(resultData).toHaveLength(2);
      expect(resultData[0]).toHaveTextContent("Homo sapiens");
      expect(resultData[1]).toHaveTextContent("Species 2");
    });
  });

  test("filters species data by publication number", async () => {
    render(
      <MemoryRouter>
        <SearchBar speciesData={speciesData} />
      </MemoryRouter>
    );

    // simulate opening the filter form
    userEvent.click(screen.getByTestId("filter-button"));
    // select the publication number
    const publicationNumSelect = await screen.findByTestId(
      "selectedPublicationNum"
    );
    userEvent.selectOptions(publicationNumSelect, "p >= 1000 && p <= 10000");
    userEvent.click(screen.getByText("Apply Filter"));

    // wait for any asynchronous operations to complete
    await waitFor(() => {
      // check that the filtered data only includes items with the correct publication number
      const resultData: HTMLElement[] = screen.getAllByTestId("resultData");
      expect(resultData).toHaveLength(2);
      expect(resultData[0]).toHaveTextContent("Species 2");
      expect(resultData[1]).toHaveTextContent("Species 3");
    });
  });

  test("filters species data by publication number (if lowest value)", async () => {
    render(
      <MemoryRouter>
        <SearchBar speciesData={speciesData} />
      </MemoryRouter>
    );

    // simulate opening the filter form
    userEvent.click(screen.getByTestId("filter-button"));
    // select the publication number
    const publicationNumSelect = await screen.findByTestId(
      "selectedPublicationNum"
    );
    userEvent.selectOptions(publicationNumSelect, "p < 1000");
    userEvent.click(screen.getByText("Apply Filter"));

    // wait for any asynchronous operations to complete
    await waitFor(() => {
      // check that the filtered data only includes items with the correct publication number
      const resultData: HTMLElement[] = screen.getAllByTestId("resultData");
      expect(resultData).toHaveLength(1);
      expect(resultData[0]).toHaveTextContent("Homo sapiens");
    });
  });

  test("filters species data by disease", async () => {
    // render the SearchBar component
    render(
      <MemoryRouter>
        <SearchBar speciesData={speciesData} />
      </MemoryRouter>
    );

    // simulate opening the filter form
    userEvent.click(screen.getByTestId("filter-button"));
    // select the publication number
    const disease = await screen.findByTestId("selectedDisease");
    userEvent.selectOptions(disease, "Cancer");
    userEvent.click(screen.getByText("Apply Filter"));

    // wait for any asynchronous operations to complete
    await waitFor(() => {
      // check that the filtered data only includes items with the correct publication number
      const resultData: HTMLElement[] = screen.getAllByTestId("resultData");
      expect(resultData).toHaveLength(1);
      expect(resultData[0]).toHaveTextContent("Homo sapiens");
    });
  });
});
