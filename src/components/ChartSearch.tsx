import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import "../Styling/ChartSearch.css";
import React from "react";

//Providing plugins to my Domain chart
Chart.register(ArcElement, Tooltip, Legend);

//takes the chart's top, width and height to display the label in the center of the doughnut chart
export function afterDraw(chart: any) {
  const {
    ctx,
    chartArea: { top, width, height },
  } = chart;
  ctx.save();

  //if the chart is active, display the label
  if (chart._active && chart._active.length > 0) {
    //takes the text label, number label and color label of the hovered wedge
    const textLabel = chart.config.data.labels[chart._active[0].index];
    const numberLabel =
      chart.config.data.datasets[chart._active[0].datasetIndex].data[
        chart._active[0].index
      ];
    const colorLabel =
      chart.config.data.datasets[chart._active[0].datasetIndex].backgroundColor[
        chart._active[0].index
      ];

    //adjusts the font size of the label based on the window's width
    let fontSize = Math.min(window.innerWidth, window.innerHeight);

    // Calculate the radius of the chart based on the smaller of the width and height
    const radius = Math.min(width, height) / 2;

    // Calculate the maximum possible width of the text
    const maxTextWidth = radius;

    // Measure the width of the text
    ctx.font = `${fontSize}px Franklin Gothic Medium`;
    let textWidth = ctx.measureText(`${textLabel}: ${numberLabel}`).width;

    // Decrease the font size until the text fits in the inner circle
    while (textWidth > maxTextWidth) {
      fontSize -= 1;
      ctx.font = `${fontSize}px Franklin Gothic Medium`;
      textWidth = ctx.measureText(`${textLabel}: ${numberLabel}`).width;
    }

    ctx.fillStyle = colorLabel;
    ctx.textAlign = "center";
    ctx.fillText(`${textLabel}: ${numberLabel}`, width / 2, height / 2 + top);
  }
  ctx.restore();
}

export const ChartSearch = ({ speciesData }: { speciesData: Species[] }) => {
  //Gathering each domain's total count for each wedge of the doughnut chart
  const archaeaRecords = speciesData.filter(
    (item) => item.domain === "Archaea"
  );
  const bacteriaRecords = speciesData.filter(
    (item) => item.domain === "Bacteria"
  );
  const eukaryotaRecords = speciesData.filter(
    (item) => item.domain === "Eukaryota"
  );

  //Setup for the labels, data and colours of the Domain Chart
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

  //creating an onHover feature that allows users to see the count of each domain
  const hoverlabel = {
    id: "hoverlabel",
    afterDraw: afterDraw,
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
      //adds a legend to the chart
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
    //Size of doughnut hole
    cutout: "69%",
  };

  return (
    <div data-testid="chart-wrapper" className="chart-wrapper">
      <Doughnut
        data={data}
        className="chart"
        options={options}
        plugins={[hoverlabel]}
      />
    </div>
  );
};
