import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { ComparisonWidget } from "../Components/ComparisonWidget";
import { BrowserRouter as BrowseRouter, MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

describe("ComparisonWidget", () => {
  beforeEach(() => {
    // Clear sessionStorage before each test
    sessionStorage.clear();
  });

  it("renders without crashing", () => {
    render(
      <BrowseRouter>
        <ComparisonWidget />
      </BrowseRouter>
    );
  });

  it("displays message if no networks are prepared for comparison", () => {
    const { getByText } = render(
      <BrowseRouter>
        <ComparisonWidget />
      </BrowseRouter>
    );
    expect(
      getByText("Please add two networks to start a comparison")
    ).toBeInTheDocument();
  });

  it("displays network images if they are prepared for comparison", () => {
    sessionStorage.setItem("network1", "data:image/jpeg;base64,example1");
    sessionStorage.setItem("network2", "data:image/jpeg;base64,example2");
    const { getAllByRole } = render(
      <BrowseRouter>
        <ComparisonWidget />
      </BrowseRouter>
    );
    const images = getAllByRole("img");
    expect(images).toHaveLength(2);
  });

  it('enables "Compare Networks" button if there are enough networks for comparison', () => {
    // Set all the associated items for each network in the sessionStorage
    ["network1", "network2"].forEach((network) => {
      sessionStorage.setItem(network, "data:image/jpeg;base64,example");
      sessionStorage.setItem(network + "SpeciesId", "speciesId");
      sessionStorage.setItem(network + "CompactName", "compactName");
      sessionStorage.setItem(network + "Domain", "domain");
      sessionStorage.setItem(network + "Evolution", "evolution");
      sessionStorage.setItem(network + "Nodes", "nodes");
      sessionStorage.setItem(network + "Edges", "edges");
      sessionStorage.setItem(network + "Taxonomy", JSON.stringify([]));
      sessionStorage.setItem(network + "Density", JSON.stringify([]));
    });

    const { getByText } = render(
      <BrowseRouter>
        <ComparisonWidget />
      </BrowseRouter>
    );
    const compareButton = getByText("Compare Networks");
    expect(compareButton).not.toBeDisabled();
  });

  it('disables "Compare Networks" button if there are not enough networks for comparison', () => {
    const { getByText } = render(
      <BrowseRouter>
        <ComparisonWidget />
      </BrowseRouter>
    );
    const compareButton = getByText("Compare Networks");
    expect(compareButton).toBeDisabled();
  });

  it('removes a network from comparison when "remove comparison" button is clicked', () => {
    sessionStorage.setItem("network1", "data:image/jpeg;base64,example1");
    const { getByRole } = render(
      <BrowseRouter>
        <ComparisonWidget />
      </BrowseRouter>
    );
    const removeButton = getByRole("button", { name: /remove comparison/i });
    fireEvent.click(removeButton);
    expect(sessionStorage.getItem("network1")).toBeNull();
  });

  it("parses networkDensity and networkTaxonomy from sessionStorage", () => {
    sessionStorage.setItem("network1Density", JSON.stringify([1, 2, 3]));
    sessionStorage.setItem("network1Taxonomy", JSON.stringify(["a", "b", "c"]));
    render(
      <BrowseRouter>
        <ComparisonWidget />
      </BrowseRouter>
    );
    // Check if the networkDensity and networkTaxonomy have been parsed correctly
    // This might involve checking the component's output or its behavior
  });

  it("navigates to the correct route when a species name is clicked", () => {
    const speciesId = "123";
    const speciesName = "Species Name"; // Replace this with the actual species name
    sessionStorage.setItem("network1", "data:image/jpeg;base64,example1");
    sessionStorage.setItem("network1SpeciesId", speciesId);
    sessionStorage.setItem("network1CompactName", speciesName);
    const { getByText } = render(
      <BrowseRouter>
        <ComparisonWidget />
      </BrowseRouter>
    );
    const speciesNameElement = getByText(speciesName);
    fireEvent.click(speciesNameElement);
    // Check if the navigate function has been called with the correct arguments
    // This might involve mocking the navigate function and checking if it's been called with `/generateNetwork/${speciesId}`
  });

  it('navigates to the networkComparison route when the "Compare Networks" button is clicked', () => {
    // Prepare enough networks for comparison
    sessionStorage.setItem("network1", "data:image/jpeg;base64,example1");
    sessionStorage.setItem("network2", "data:image/jpeg;base64,example2");

    const { getByText } = render(
      <MemoryRouter>
        <ComparisonWidget />
      </MemoryRouter>
    );
    const compareButton = getByText("Compare Networks");
    fireEvent.click(compareButton);
    // Check if the navigate function has been called with the correct arguments
    // Unfortunately, MemoryRouter does not provide a way to check the current route
    // You would need to check the functionality of your component that depends on the route change
  });

  // Your other tests go here
});
