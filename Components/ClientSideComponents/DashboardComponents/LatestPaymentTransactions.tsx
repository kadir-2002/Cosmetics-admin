import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { formatIST } from "../OrderComponents/OrderInfoComponent";

type props = {
    commisionData: any
    startDate: any,
    endDate: any
}
const LatestPaymentTransactions = ({ commisionData, startDate, endDate }: props) => {
    const currency = useSelector((state: any) => state?.user?.details?.currency_symbol);
    const router = useRouter();

    console.log(commisionData,"payment data")
    const formatDate = (date: Date | null): string => {
        if (!date) return ""; // Return an empty string instead of null
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`; // Format as "YYYY-MM-DD"
    };
    return (
        <div className="bg-white shadow-md rounded-lg py-2 h-[426px] mx-auto overflow-auto hidescroll">
            <div className="overflow-x-auto hidescroll ">
                <table className="w-full min-w-[700px] border-collapse text-[16px] text-center">
                    <thead>
                        <tr className="text-[#577C8E] text-left border-b-[1px] border-gray-100">
                            <th className="px-4 py-2 ">Order Id</th>
                            <th className="px-4 py-2 ">Date & Time</th>
                            {/* <th className="px-4 py-2 ">Customer id</th> */}
                            <th className="px-4 py-2 ">Transaction Status</th>
                            <th className="px-4 py-2 ">Payment Type</th>
                            {/* <th className="px-4 py-2 ">Total</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {commisionData?.recent_payment_transactions?.map((transaction: any, index: number) => (
                            <tr key={index} className={`text-center text-[16px] ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                                onClick={() => router.push(`/order?id=${transaction?.id}`)}
                            >
                                <td className="px-4 py-2 text-left">
                                    {transaction?.id}
                                </td>

                                <td className="px-4 py-2 text-left">{formatIST(transaction?.createdAt)}</td>
                                {/* <td className="px-4 py-2 text-left">
                                    <span className="px-2  font-medium">{transaction?.customer_first_name}</span>
                                </td> */}
                                <td className="px-4 py-2 text-left"> {transaction?.status}</td>
                                <td className="px-4 py-2 text-left">{transaction?.method}</td>
                                {/* <td className="px-4 py-2 text-left">{currency}{transaction?.final_total}</td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    );
};

export default LatestPaymentTransactions;
