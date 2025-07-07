import Link from "next/link";
import React from "react";
import { FaBox, FaTimesCircle, FaHourglassHalf, FaUndo } from "react-icons/fa";
import { MdPendingActions } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";

type props = {
  commisionData: any
  startDate: any, endDate: any
}

const formatDate = (date: Date | null): string => {
  if (!date) return ""; // Return an empty string instead of null
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // Format as "YYYY-MM-DD"
};
const OrderSummary = ({ commisionData, startDate, endDate }: props) => {
  const formattedStartDate = formatDate(startDate)
  const formattedEndDate = formatDate(endDate)
  return (
    <div className="bg-white shadow-md w-full rounded-lg p-6 h-[426px] mx-auto space-y-6 overflow-auto hidescroll">
      <Link className="mb-3 flex justify-between" href={`/order?start_date=${formattedStartDate}&end_date=${formattedEndDate}`}>
        <h3 className="font-semibold text-[#577C8E] text-[23px]">Total Orders</h3>
        <p className="text-4xl font-bold text-gray-800">{commisionData?.order_summary?.total_orders}</p>
      </Link>
      <div className="space-y-">
        <Link className="flex items-center justify-between" href={`/order?order_status=CONFIRMED&start_date=${formattedStartDate}&end_date=${formattedEndDate}`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#01B8E1] rounded-lg"><FaBox className="text-white text-xl" /></div>
            <span className="font-semibold text-md text-[#01B8E1]">CONFIRMED</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-800 font-semibold">{commisionData?.order_summary?.confirmed_orders}</span>
          </div>
        </Link>
      </div>
      <div className="space-y-4">
        <Link className="flex items-center justify-between" href={`/order?order_status=SHIPPED&start_date=${formattedStartDate}&end_date=${formattedEndDate}`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#E10101] rounded-lg"><FaHourglassHalf className="text-white text-xl" /></div>
            <span className="text-[#E10101] font-semibold text-md">SHIPPED</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-800 font-semibold">{commisionData?.order_summary?.shipped_orders}</span>
          </div>
        </Link>
      </div>
      <div className="space-y-4">
        <Link className="flex items-center justify-between" href={`/order?order_status=CANCELLED&start_date=${formattedStartDate}&end_date=${formattedEndDate}`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#E1C001] rounded-lg"><FaTimesCircle className="text-white text-xl" /></div>
            <span className="text-[#E1C001] font-semibold text-md">CANCELLED</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-800 font-semibold">{commisionData?.order_summary?.cancelled_orders}</span>
          </div>
        </Link>
      </div>
      <div className="space-y-4">
        <Link className="flex items-center justify-between" href={`/order?order_status=PENDING&start_date=${formattedStartDate}&end_date=${formattedEndDate}`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#E19301] rounded-lg"><MdPendingActions className="text-white text-xl" /></div>
            <span className="text-[#E19301] font-semibold text-md">PENDING</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-800 font-semibold">{commisionData?.order_summary?.pending_orders}</span>
          </div>
        </Link>
      </div>
      <div className="space-y-4">
        <Link className="flex items-center justify-between" href={`/order?order_status=DELIVERED&start_date=${formattedStartDate}&end_date=${formattedEndDate}`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#C0E101] rounded-lg"><TbTruckDelivery className="text-white text-xl" /></div>
            <span className="text-gray-700 font-semibold text-md">DELIVERED</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-800 font-semibold">{commisionData?.order_summary?.delivered_orders}</span>
          </div>
        </Link>
      </div>
      {/* <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#9EE101] rounded-lg"><FaHourglassHalf className="text-white text-xl" /></div>
              <span className="text-gray-700 font-semibold text-md">Payment Done Orders</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-800 font-semibold">{commisionData?.order_summary?.payment_done_orders}</span>
            </div>
          </div>
      </div> */}
      {/* <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#E15701] rounded-lg"><FaHourglassHalf className="text-white text-xl" /></div>
              <span className="text-gray-700 font-semibold text-md">Payment Pending Orders</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-800 font-semibold">{commisionData?.order_summary?.payment_pending_orders}</span>
            </div>
          </div>
      </div> */}
    </div >
  );
};

export default OrderSummary;
