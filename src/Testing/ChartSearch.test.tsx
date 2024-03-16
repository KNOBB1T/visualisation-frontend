import { render, screen } from "@testing-library/react";
import { ChartSearch } from "../Components/ChartSearch";
import "@testing-library/jest-dom";
import React from "react";
import { Doughnut } from "react-chartjs-2";

jest.mock("chart.js", () => ({
  Chart: {
    register: jest.fn(),
  },
  ArcElement: jest.fn(),
  Tooltip: jest.fn(),
  Legend: jest.fn(),
}));

jest.mock("react-chartjs-2", () => ({
  Doughnut: jest.fn().mockImplementation(({ plugins }) => {
    // Simulate a hover event by calling the afterDraw function of the hoverlabel plugin
    const hoverEvent = {
      ctx: {
        save: jest.fn(),
        restore: jest.fn(),
        font: "",
        fillStyle: "",
        textAlign: "",
        fillText: jest.fn(),
      },
      chartArea: { top: 0, width: 0, height: 0 },
      _active: [{ index: 0, datasetIndex: 0 }],
      config: {
        data: {
          labels: ["Archaea"],
          datasets: [{ data: [1], backgroundColor: ["red"] }],
        },
      },
    };
    plugins[0].afterDraw(hoverEvent);
    return null;
  }),
}));

const speciesData: Species[] = [
  {
    index: BigInt(1),
    species_id: 1,
    compact_name: "name1",
    official_NCBI_name: "name1",
    evolution: 1.5,
    domain: "Archaea",
    taxonomy_level2: "",
    species_name_compact: "",
    publication_count: 0, // Add the missing properties here
    total_nodes: 0, // Add the missing properties here
    total_edges: 0, // Add the missing properties here
    taxonomy: "", // Add the missing properties here
    diseases: [], // Add the missing properties here
  },
  {
    index: BigInt(2),
    species_id: 2,
    compact_name: "name2",
    official_NCBI_name: "name2",
    evolution: 1.9,
    domain: "Bacteria",
    taxonomy_level2: "",
    species_name_compact: "",
    publication_count: 0, // Add the missing properties here
    total_nodes: 0, // Add the missing properties here
    total_edges: 0, // Add the missing properties here
    taxonomy: "", // Add the missing properties here
    diseases: [], // Add the missing properties here
  },
  {
    index: BigInt(3),
    species_id: 3,
    compact_name: "name3",
    official_NCBI_name: "name3",
    evolution: 3.6,
    domain: "Eukaryota",
    taxonomy_level2: "",
    species_name_compact: "",
    publication_count: 0, // Add the missing properties here
    total_nodes: 0, // Add the missing properties here
    total_edges: 0, // Add the missing properties here
    taxonomy: "", // Add the missing properties here
    diseases: [], // Add the missing properties here
  },
];

describe("ChartSearch", () => {
  it("renders without crashing", () => {
    render(<ChartSearch speciesData={speciesData} />);
    expect(screen.getByTestId("chart-wrapper")).toBeInTheDocument();
  });

  it("renders Doughnut component", () => {
    render(<ChartSearch speciesData={speciesData} />);
    expect(Doughnut).toHaveBeenCalled();
  });
});
