import { render, screen } from "@testing-library/react";
import { ChartSearch } from "../Components/ChartSearch";
import { afterDraw } from "../Components/ChartSearch";
import "@testing-library/jest-dom";
import React from "react";
import "jest-canvas-mock";
// import { Doughnut } from "react-chartjs-2";

beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {
      // do nothing
    }
    unobserve() {
      // do nothing
    }
    disconnect() {
      // do nothing
    }
  };
});

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
    const chartWrapper = screen.getByTestId("chart-wrapper");
    expect(chartWrapper).toBeInTheDocument();
  });

  it("calls afterDraw when a chart element is hovered over", () => {
    const mockChart = {
      ctx: {
        save: jest.fn(),
        restore: jest.fn(),
        fillText: jest.fn(),
        measureText: jest.fn().mockReturnValue({ width: 100 }), // Add this line

        // add other necessary mock context methods here
      },
      chartArea: { top: 0, width: 500, height: 500 },
      config: {
        data: {
          labels: ["Archaea", "Bacteria", "Eukaryota"],
          datasets: [
            {
              data: [1, 2, 3],
              backgroundColor: ["red", "blue", "green"],
            },
          ],
        },
      },
      _active: [{ index: 0, datasetIndex: 0 }],
    };

    afterDraw(mockChart);

    expect(mockChart.ctx.fillText).toHaveBeenCalled();
  });
});

//   it('renders the correct data', () => {
//   render(<ChartSearch speciesData={speciesData} />);
//   const chart = screen.getByTestId('chart-wrapper').firstChild;
//   const chartInstance = Chart.getChart(chart.id);
//   expect(chartInstance.data.datasets[0].data).toEqual(speciesData.map(species => species.evolution));
// });

// it('updates the chart when new data is provided', () => {
//   const { rerender } = render(<ChartSearch speciesData={speciesData} />);
//   const newData = [...speciesData, createSpeciesData('New Domain', 4)];
//   rerender(<ChartSearch speciesData={newData} />);
//   const dataPoints = screen.getAllByTestId('data-point');
//   expect(dataPoints).toHaveLength(newData.length);
// });
