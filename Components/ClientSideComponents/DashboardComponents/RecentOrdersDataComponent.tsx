import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

type Props = {
  commisionData: any;
};

const RecentOrdersDataComponent = ({ commisionData }: Props) => {
  const currency = useSelector((state: any) => state?.user?.details?.currency_symbol);
  const router = useRouter();
  return (
    <div className="bg-white shadow-md rounded-lg h-[426px] mx-auto overflow-auto hidescroll">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[#577C8E] text-center">
          <thead>
            <tr className="text-lg">
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer Name</th>
              <th className="px-4 py-3">Final Total</th>
              <th className="px-4 py-3">Item Count</th>
            </tr>
          </thead>
          <tbody className="text-black">
            {commisionData?.recent_orders?.map((order: any, index: number) => (
              <tr
                key={index}
                className={`text-center text-[18px] ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                onClick={() => router.push(`/order?id=${order?.id}`)}
              >
                <td className="px-4 py-5 text-md">
                  {order?.id}
                </td>
                <td className="px-4 py-5 text-center">
                  <span className="px-py-5 font-medium">
                    {order?.customer_name || "Guest User"}
                  </span>
                </td>
                <td className="px-4 py-5 text-center">{currency}{order?.total_amount}</td>

                <td className="px-4 py-5 text-center">{order?.item_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrdersDataComponent;
