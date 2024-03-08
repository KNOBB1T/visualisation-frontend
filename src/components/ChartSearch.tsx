import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import "./ChartSearch.css";

Chart.register(ArcElement, Tooltip, Legend);

export const ChartSearch = ({ speciesData }: { speciesData: Species[] }) => {
  const archaeaRecords = speciesData.filter(
    (item) => item.domain === "Archaea"
  );
  const bacteriaRecords = speciesData.filter(
    (item) => item.domain === "Bacteria"
  );
  const eukaryotaRecords = speciesData.filter(
    (item) => item.domain === "Eukaryota"
  );

  const data = {
    labels: ["Archaea", "Bacteria", "Eukaryota"],
    datasets: [
      {
        data: [
          archaeaRecords.length,
          bacteriaRecords.length,
          eukaryotaRecords.length,
        ],
        borderColor: "black",
        backgroundColor: ["red", "blue", "green"],
      },
    ],
  };

  const hoverlabel = {
    id: "hoverlabel",
    afterDraw(chart: any) {
      const {
        ctx,
        chartArea: { top, width, height },
      } = chart;
      ctx.save();

      if (chart._active && chart._active.length > 0) {
        const textLabel = chart.config.data.labels[chart._active[0].index];
        const numberLabel =
          chart.config.data.datasets[chart._active[0].datasetIndex].data[
            chart._active[0].index
          ];
        const colorLabel =
          chart.config.data.datasets[chart._active[0].datasetIndex]
            .backgroundColor[chart._active[0].index];
        const fontSize = window.innerWidth * 0.015; // 2vw
        ctx.font = `${fontSize}px Franklin Gothic Medium`;
        ctx.fillStyle = colorLabel;
        ctx.textAlign = "center";
        ctx.fillText(
          `${textLabel}: ${numberLabel}`,
          width / 2,
          height / 2 + top
        );
      }
      ctx.restore();
    },
  };

  const options = {
    responsive: true, // Enable responsiveness
    maintainAspectRatio: false, // Allow resizing without maintaining aspect ratio
    layout: {
      padding: {
        right: 10, // Adjust as needed
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "right" as "right",
        labels: {
          color: "black",
          font: {
            size: 16,
          },
          padding: 10,
        },
      },
      tooltip: {
        enabled: false,
      },
    },
    cutout: "69%",
  };

  return (
    <Doughnut
      data={data}
      className="chart-wrapper"
      options={options}
      plugins={[hoverlabel]}
    />
  );
};
