import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  Colors,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  Colors,
  zoomPlugin
);

interface LineChartProps {
  graphData: {
    date_data: any;
    data_for_all: number[];
    data_for_website: number[];
  };
  servicesGraphData: any;
}

const LineChart: React.FC<LineChartProps> = ({
  graphData,
  servicesGraphData,
}) => {
  const lineChartData = {
    labels: graphData?.date_data,
    datasets: [
      {
        label: `Order`,
        data: graphData?.data_for_all,

        borderColor: "#26CCCA",
        backgroundColor: "#EEF7F6",
        fill: true,
        tension: 0.4,
        borderWidth: 1.5,
      },
      {
        label: `Profit`,
        data: graphData?.data_for_website,
        borderColor: "#FE3E6B", // Purple
        backgroundColor: "#feb1c3",
        fill: true,
        tension: 0.4,
        borderWidth: 1.5,
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "x",
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "x",
        },
      },
    },
    scales: {
      x: {
        stacked: false,
        grid: {
          color: "#f2f2f2",
          display: false,
          lineWidth: 0.5,
        },
      },
      y: {
        stacked: false,
        grid: {
          color: "#f2f2f2",
          display: true,
          lineWidth: 0.5,
        },
      },

      "y-axis-2": {
        display: false,
        grid: {
          drawOnChartArea: false,
          color: "#f2f2f2",
        },
      },
    },
  };

  return (
    <div className="max-w-full w-full mx-auto sm:p-2 p-2">
      <div className="relative h-[250px] md:h-96 sm:py-2 p-0">
        <Line data={lineChartData} options={options} />
      </div>
    </div>
  );
};

export default LineChart;
