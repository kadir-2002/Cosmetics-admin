import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useSelector } from "react-redux";

ChartJS.register(ArcElement, Tooltip, Legend);

const RevenueTaxDistributionPieChart = ({ commisionData }: any) => {
  const currency = useSelector(
    (state: any) => state?.user?.details?.currency_symbol
  );
  const userSummary = commisionData?.order_payment_summary;
  const data = {
    labels: ["Online Payment", "COD Payment"],
    datasets: [
      {
        label: "Payment",
        data: [
          userSummary?.online_payment_amount,
          userSummary?.cash_on_delivery_payment_amount,
        ],
        backgroundColor: ["#4CAF50", "#FF9800"],
        borderWidth: 1,
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
        text: "Commission And Referrals Count",
        font: {
          size: 24,
        },
      },
    },
    cutout: "40%", // To make it a Donut chart
  };

  return (
    <div className='max-w-full mx-auto p-2'>
      <div className='relative h-[300px] flex items-center justify-center md:h-[380px] sm:py-2 p-0 w-full'>
        <Doughnut data={data} options={options} />
      </div>
      <div className='flex gap-4 items-center justify-center'>
        <div className='mt-2 text-center text-sm text-gray-600'>
          Online Payment: {currency}
          {userSummary?.online_payment_amount?.toFixed(2)}
        </div>
        <div className='mt-2 text-center text-sm text-gray-600'>
          COD Payment: {currency}
          {userSummary?.cash_on_delivery_payment_amount?.toFixed(2)}
        </div>
        <div className='mt-2 text-center text-sm text-gray-600'>
          Total Deals: {currency}
          {userSummary?.total_payment_estimate?.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default RevenueTaxDistributionPieChart;
