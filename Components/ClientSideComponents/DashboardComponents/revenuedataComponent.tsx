import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

type Props = {
  commisionData: any;
};

const RevenuedataComponent = ({ commisionData }: Props) => {
  const userSummary = commisionData?.revenue_summary;

  const data = [
    {
      name: "Total Revenue",
      value: userSummary?.total_revenue.toFixed(2),
      color: "#4CAF50",
    },
    {
      name: "Tax Collected",
      value: userSummary?.total_tax_collected,
      color: "#8A2BE2",
    },
    {
      name: "Delivery Charge",
      value: userSummary?.total_delivery_charge_collected,
      color: "#FF9800",
    },
    {
      name: "Discount Given",
      value: userSummary?.total_discount_given,
      color: "#F44336",
    },
  ];

  return (
    <div className='bg-white shadow-md rounded-lg p-4 w-full h-[426px]'>
      <ResponsiveContainer width='100%' height='76%'>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Legend />
          {data.map((item, index) => (
            <Line
              key={index}
              type='monotone'
              dataKey='value'
              stroke={item.color}
              name={item.name}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      <div className='mt-4 space-y-2'>
        <div className='flex justify-between'>
          <div className='flex gap-2 pb-2'>
            <span className='font-medium'>Total Revenue:</span>
            <span>
              {userSummary?.total_revenue
                ? userSummary.total_revenue.toFixed(2)
                : "0.00"}
            </span>
          </div>
          <div className='flex gap-2 pb-2'>
            <span className='font-medium'>Total Tax Collected:</span>
            <span>{userSummary?.total_tax_collected || 0}</span>
          </div>
        </div>

        <div className='flex justify-between'>
          <div className='flex gap-2 pb-2'>
            <span className='font-medium'>
              Total Delivery Charge Collected:
            </span>
            <span>{userSummary?.total_delivery_charge_collected || 0}</span>
          </div>
          <div className='flex gap-2 pb-2'>
            <span className='font-medium'>Total Discount Given:</span>
            <span>{userSummary?.total_discount_given || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenuedataComponent;
