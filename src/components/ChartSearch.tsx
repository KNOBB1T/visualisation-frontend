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
  const undefinedRecords = speciesData.filter(
    (item) => item.domain === "Undefined"
  );

  const data = {
    labels: ["Archaea", "Bacteria", "Eukaryota", "Undefined"],
    datasets: [
      {
        data: [
          archaeaRecords.length,
          bacteriaRecords.length,
          eukaryotaRecords.length,
          undefinedRecords.length,
        ],
        borderColor: "black",
        backgroundColor: ["green", "blue", "orange", "red"],
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
        ctx.font = "30px Franklin Gothic Medium";
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
    plugins: {
      legend: {
        display: true,
        position: "bottom" as "bottom",
        labels: {
          font: {
            size: 16,
          },
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
