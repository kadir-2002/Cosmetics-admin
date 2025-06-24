import React, { useState } from "react";
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
import { Bar } from "react-chartjs-2";

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

interface BarChartProps {
    commisionData: any;
}

const OrderSaleBarGraphComponent = ({ commisionData }: BarChartProps) => {
    const [activeKey, setActiveKey] = useState("Orders");

    const isSingleDayData = commisionData?.order_sale_graph?.every(
        (item: any, _: number, array: any[]) =>
            new Date(item.date).toDateString() === new Date(array[0].date).toDateString()
    );

    const labels = commisionData?.order_sale_graph?.map((item: any) =>
        isSingleDayData
            ? new Date(item.date).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
            })
            : new Date(item.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            })
    ) || [];

    const data =
        activeKey === "Orders"
            ? commisionData?.order_sale_graph?.map((item: any) => item.total_orders) || []
            : commisionData?.order_sale_graph?.map((item: any) => item.total_revenue) || [];

    const barChartData = {
        labels,
        datasets: [
            {
                label: `Total ${activeKey}`,
                data,
                borderColor: activeKey === "Orders" ? "#26CCCA" : " #00e64d",
                backgroundColor: activeKey === "Orders" ? "#EEF7F6" : "#b3ffcc",
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
                position: "top",
                display: false
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
                    display: false,
                    lineWidth: 0.5,
                },
            },
        },
    };

    return (
        <div className="max-w-full w-full mx-auto sm:p-2 p-2">
            <div className="flex justify-center space-x-4 mb-4">
                <button
                    className={`px-4 py-2 rounded ${activeKey === "Orders" ? "bg-[#EEF7F6] border-[#26CCCA] border-[1px] text-black" : "bg-gray-200"
                        }`}
                    onClick={() => setActiveKey("Orders")}
                >
                    Orders
                </button>
                <button
                    className={`px-4 py-2 rounded ${activeKey === "Sales" ? "bg-[#b3ffcc] border-[#00e64d] border-[1px] text-black" : "bg-gray-200"
                        }`}
                    onClick={() => setActiveKey("Sales")}
                >
                    Sales
                </button>
            </div>


            <div className="relative h-[250px] md:h-[355px] sm:py-2 p-0">
                <Bar data={barChartData} options={options} />

            </div>
        </div>
    );
};

export default OrderSaleBarGraphComponent;
