import Link from "next/link";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

type CustomerByOrders = {
  id: number;
  name: string;
  // customer__last_name: string;
  total_orders: number; // Adjusted type if it's always a number
  total_spent: number
};

type CustomerBySpending = {
id: number;
 name: string;
  // customer__last_name: string;
total_spent: number; // Adjusted type if it's always a number
  total_orders: number
};

type Props = {
  commisionData: {
    top_customers: {
      by_orders: CustomerByOrders[];
      by_spending: CustomerBySpending[];
    };
  };
};

const TopCustomers = ({ commisionData }: Props) => {
  const [activeTab, setActiveTab] = useState<"by_orders" | "by_spending">("by_orders");

  const customers = commisionData?.top_customers;
  const currency = useSelector((state: any) => state?.user?.details?.currency_symbol);
  const router = useRouter();
  return (
    <div className="bg-white rounded-lg shadow-md p-3 h-[426px] overflow-auto hidescroll">

      <div className="flex items-center gap-2 mb-4">
        <button
          className={`flex items-center text-sm font-medium border-[1px] px-3 py-1 rounded-md ${activeTab === "by_orders" ? "bg-admin-buttonprimary text-white" : "bg-gray-100 text-gray-800"
            }`}
          onClick={() => setActiveTab("by_orders")}
        >
          By Orders
        </button>
        {/* <button
          className={`flex items-center text-sm font-medium border-[1px] px-3 py-1 rounded-md ${activeTab === "by_spending" ? "bg-[#577C8E] text-white" : "bg-gray-100 text-gray-800"
            }`}
          onClick={() => setActiveTab("by_spending")}
        >
          By Spending
        </button> */}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left">
              <th className="py-2 px-4  text-[18px] text-[#577C8E]  text-left">
                Customer Name
              </th>
              <th className="py-2 px-4 text-[18px] text-[#577C8E] text-left">
                {activeTab === "by_orders" ? "Money Spent" : " Orders"}
              </th>
              <th className="py-2 px-4 text-[18px] text-[#577C8E] text-center">
                {activeTab === "by_orders" ? "Complete Orders" : "Money Spent"}
              </th>
            </tr>
          </thead>
          <tbody>
            {activeTab === "by_orders" &&
              customers?.by_orders?.map((customer, index) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? "bg-gray-50" : ""
                    } hover:bg-purple-100 cursor-pointer`}
                  onClick={() => router.push(`/customers?id=${customer?.id}`)}
                >
                  <td className="py-2 px-4 text-[18px] text-left">
                    {customer.name}
                  </td>
                  <td className="py-2 px-4 text-[18px] text-left">
                    {customer.total_spent}
                  </td>
                  <td className="py-2 px-4 text-md font-semibold text-center">
                    {customer.total_orders}
                  </td>
                </tr>
              ))}
            {activeTab === "by_spending" &&
              customers?.by_spending?.map((customer, index) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? "bg-gray-50" : ""} hover:bg-gray-100`}
                >
                  <td className="py-2 px-4 text-[18px] text-center">
                    <Link href={`/customers?id=${customer?.id}`}>
                       {customer.name}
                    </Link>
                  </td>
                  <td className="py-2 px-4 text-md text-center">{customer.total_orders}</td>

                  <td className="py-2 px-4 text-md text-center">
                    {currency}{customer.total_spent}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div >
  );
};

export default TopCustomers;
