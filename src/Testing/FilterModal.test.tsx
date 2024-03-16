import { render, fireEvent, waitFor } from "@testing-library/react";
import { Filter, FilterData } from "../Components/FilterModal";
import ResizeObserver from "resize-observer-polyfill";
import "@testing-library/jest-dom";
import React from "react";

global.ResizeObserver = ResizeObserver;

const filterData: FilterData = {
  domain: "",
  disease: "",
  nodeNum: "",
  edgeNum: "",
  publicationNum: "",
  evolution: [0, 5],
  evolutionInteraction: false,
};

describe("Filter", () => {
  const mockFilterParams = jest.fn();
  const mockRemoveFilterParams = jest.fn();

  it("renders without crashing", () => {
    render(
      <Filter
        filterParams={mockFilterParams}
        removeFilterParams={mockRemoveFilterParams}
        filterData={filterData}
      />
    );
  });

  it("calls filterParams with correct arguments when Apply Filter button is clicked", async () => {
    const { getByText, getByTestId } = render(
      <Filter
        filterParams={mockFilterParams}
        removeFilterParams={mockRemoveFilterParams}
        filterData={filterData}
      />
    );

    // Set some filter fields here
    const newDomain = "Bacteria";
    const newDisease = "Cancer";
    fireEvent.change(getByTestId("selectedDomain"), {
      target: { value: newDomain },
    });
    fireEvent.change(getByTestId("selectedDisease"), {
      target: { value: newDisease },
    });

    fireEvent.click(getByText("Apply Filter"));
    await waitFor(() =>
      expect(mockFilterParams).toHaveBeenCalledWith({
        ...filterData,
        domain: newDomain,
        disease: newDisease,
      })
    );
  });

  describe("Filter", () => {
    const mockFilterParams = jest.fn();
    const mockRemoveFilterParams = jest.fn();

    const filterData: FilterData = {
      domain: "",
      disease: "",
      nodeNum: "",
      edgeNum: "",
      publicationNum: "",
      evolution: [0, 5],
      evolutionInteraction: false,
    };

    it("renders without crashing", () => {
      render(
        <Filter
          filterParams={mockFilterParams}
          removeFilterParams={mockRemoveFilterParams}
          filterData={filterData}
        />
      );
    });

    it("calls removeFilterParams when Remove Filter button is clicked", async () => {
      const nonDefaultFilterData: FilterData = {
        domain: "Bacteria",
        disease: "Cancer",
        nodeNum: "n < 100",
        edgeNum: "e < 200",
        publicationNum: "p < 1000",
        evolution: [1, 3],
        evolutionInteraction: true,
      };

      const { getByText, getByTestId } = render(
        <Filter
          filterParams={mockFilterParams}
          removeFilterParams={mockRemoveFilterParams}
          filterData={nonDefaultFilterData}
        />
      );

      // Simulate user interaction to change the filter data
      fireEvent.change(getByTestId("selectedDomain"), {
        target: { value: "Bacteria" },
      });
      fireEvent.change(getByTestId("selectedDisease"), {
        target: { value: "Cancer" },
      });
      fireEvent.click(getByText("Apply Filter"));

      // Now the filter data should be different from the default, so the "Remove Filter" button should be enabled
      fireEvent.click(getByText("Remove Filter"));
      await waitFor(() => expect(mockRemoveFilterParams).toHaveBeenCalled());
    });
  });
});

describe("Filter", () => {
  const mockFilterParams = jest.fn();
  const mockRemoveFilterParams = jest.fn();

  const filterData: FilterData = {
    domain: "",
    disease: "",
    nodeNum: "",
    edgeNum: "",
    publicationNum: "",
    evolution: [0, 5],
    evolutionInteraction: false,
  };

  it("updates selectedNodeNum when node option is selected", () => {
    const { getByTestId } = render(
      <Filter
        filterParams={mockFilterParams}
        removeFilterParams={mockRemoveFilterParams}
        filterData={filterData}
      />
    );

    fireEvent.change(getByTestId("selectedNodeNum"), {
      target: { value: "n < 100" },
    });

    expect((getByTestId("selectedNodeNum") as HTMLSelectElement).value).toBe(
      "n < 100"
    );
  });

  it("updates selectedEdgeNum when edge option is selected", () => {
    const { getByTestId } = render(
      <Filter
        filterParams={mockFilterParams}
        removeFilterParams={mockRemoveFilterParams}
        filterData={filterData}
      />
    );

    fireEvent.change(getByTestId("selectedEdgeNum"), {
      target: { value: "e < 200" },
    });

    expect((getByTestId("selectedEdgeNum") as HTMLSelectElement).value).toBe(
      "e < 200"
    );
  });

  it("updates selectedPublicationNum when publication option is selected", () => {
    const { getByTestId } = render(
      <Filter
        filterParams={mockFilterParams}
        removeFilterParams={mockRemoveFilterParams}
        filterData={filterData}
      />
    );

    fireEvent.change(getByTestId("selectedPublicationNum"), {
      target: { value: "p < 1000" },
    });

    expect(
      (getByTestId("selectedPublicationNum") as HTMLSelectElement).value
    ).toBe("p < 1000");
  });

  //   it("updates text when handleEvolutionInteraction is called", async () => {
  //     const { findByTestId, getByText } = render(
  //       <Filter
  //         filterParams={mockFilterParams}
  //         removeFilterParams={mockRemoveFilterParams}
  //         filterData={filterData}
  //       />
  //     );

  //     // Simulate the Slider onChange event
  //     const selectedEvolution = await findByTestId("selectedEvolution");
  //     fireEvent.change(selectedEvolution, {
  //       target: { value: [1, 3] },
  //     });

  //     // Assuming changing the slider updates a text in the component
  //     expect(getByText("Updated text")).toBeInTheDocument();
  //   });
});
