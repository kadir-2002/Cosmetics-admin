import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale);

type Props = {
    commisionData: any;
};

const OrderPaymentSummery = ({ commisionData }: Props) => {
    const userSummary = commisionData?.order_payment_summary;

    const lineChartData = {
        labels: ['Online Payment', 'Cash on Delivery'],
        datasets: [
            {
                label: 'Order Counts',
                data: [10, 100],
                fill: false,
                borderColor: 'rgb(75, 192, 192)', // Line color
                tension: 0.1, // Smooth line
                borderWidth: 2
            }
        ]
    };

    const chartOptions = {  
        responsive: true,
        scales: {
            x: {
                beginAtZero: true,
                grid: {
                    display: false,
                },
                ticks: {
                    font: {
                        size: 14,
                    },
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    display: false,
                },
                ticks: {
                    font: {
                        size: 14,
                    },
                }
            }
        },
        plugins: {
            legend: {
                display: true, // Display the legend
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleColor: 'white',
                bodyColor: 'white',
                callbacks: {
                    label: (tooltipItem: any) => `${tooltipItem.raw} Orders`,
                }
            }
        }
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-4 w-full lg:h-[426px] h-[350px] flex lg:justify-end lg:items-end">
            <div className="w-[390px] h-[350px] lg:w-[830px] lg:h-[300px] ">
                <Line data={lineChartData} options={chartOptions}/>
            </div>
        </div>
    );
};

export default OrderPaymentSummery;
