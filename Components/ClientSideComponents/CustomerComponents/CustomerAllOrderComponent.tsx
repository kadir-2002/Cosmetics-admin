import { useState, useEffect, useRef } from "react";
import { IoEye } from "react-icons/io5";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { SinglecustomerAllOrderDataApi } from "@/apis/customerApi";
import { clearUserDetails } from "@/redux/userSlice";
import OrderDetailsPopup from "./OrderDetailspopComponent";
import { MdArrowDropUp } from "react-icons/md";
import { IoMdArrowDropdown } from "react-icons/io";
import OrderFilterpopupCompoent from "../OrderComponents/OrderFilterpopupCompoent";
import { FaAngleDown } from "react-icons/fa6";

type props = {
    isCustomerSelectId: any
}
const CustomerAllOrderComponent = ({ isCustomerSelectId }: props) => {
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [singleCustomerOrder, setSingleCustomerOrder] = useState<any[]>([]);
    const [isActiveInactiveFitlerPopup, setIsActiveInactiveFilterPopup] = useState<boolean>(false)
    const [isfiltervalue, setfiltervalue] = useState<string>("")
    const [SingleCustomerDateSorting, setSingleCustomerDateSorting] = useState("")
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const tokenErrorShown = useRef(false);
    const token = useSelector((state: any) => state?.user?.token);
    const router = useRouter();
    const dispatch = useDispatch();
    const currency = useSelector((state: any) => state?.user?.details?.currency_symbol);



    const fetchSingleCustomerAllOrderDetails = async (id: any) => {
        try {
            const response = await SinglecustomerAllOrderDataApi({
                current_page: currentPage,
                total_pages: totalPages,
                page_size: pageSize,
                token,
                id,
                isfiltervalue, SingleCustomerDateSorting
            });
            if (response?.detail === "Invalid token") {
                if (!tokenErrorShown.current) {
                    tokenErrorShown.current = true;
                    dispatch(clearUserDetails());
                    toast.error("Session Expired, Please Login Again");
                    router.push("/");
                }
                return;
            }
            setSingleCustomerOrder(response?.results);
            setTotalPages(response?.total_pages);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };
    useEffect(() => {
        fetchSingleCustomerAllOrderDetails(isCustomerSelectId);
    }, [isCustomerSelectId, currentPage, isfiltervalue, SingleCustomerDateSorting]);

    const handleViewDetails = (order: any) => {
        setSelectedOrder(order);
        setPopupVisible(true);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handlefilter = (value: any) => {
        setfiltervalue(value);
        setIsActiveInactiveFilterPopup(false)
        setCurrentPage(1)
        
    }

    const handleOrdering = (field: string) => {
        setSingleCustomerDateSorting((prev) => (prev === field ? `-${field}` : field));
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case "Complete":
                return "bg-[#34A864]";
            case "Processing":
                return "bg-[#3485A8]";
            case "Pending":
                return "bg-[#A8A434]";
            case "Cancel":
                return "bg-[#A83434]";
            default:
                return "bg-[#ff7800]";
        }
    };

    return (
        <div className="w-full">
            <div className="w-full overflow-x-auto mt-6 shadow-lg">
                <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-y-hidden">
                    <thead className="bg-admin-secondary text-admin-text-primary lg:text-lg cursor-pointer">
                        <tr>
                            <th className="px-4 py-3 text-start text-lg">Order ID</th>
                            <th className={`text-start cursor-pointer transition-colors duration-200 ${SingleCustomerDateSorting === "created_at" || SingleCustomerDateSorting === "-created_at" ? "text-white" : "text-white"}`}
                                onClick={() => handleOrdering("created_at")}>
                                <div className="flex items-center justify-start space-x-0">
                                    <span className="">Date</span>
                                    <span className="flex flex-col leading-none">
                                        <MdArrowDropUp
                                            className={`w-7 h-8 transform -mb-1 ${SingleCustomerDateSorting === "created_at" ? "text-admin-text-primary" : "text-admin-text-primary"}`}
                                        />
                                        <IoMdArrowDropdown
                                            className={`w-7 h-7 transform -mt-3 ${SingleCustomerDateSorting === "-created_at" ? "text-admin-text-primary" : "text-admin-text-primary"}`}
                                        />
                                    </span>
                                </div>
                            </th>
                            <th className="px-4 py-3 text-center text-lg">Transaction ID</th>
                            <th className="px-4 py-3 text-center text-lg">Payment</th>
                            <th className="px-4 py-3 text-center text-lg">Payment Status</th>
                            <th className="p-4 flex gap-1 justify-center items-center" onClick={() => setIsActiveInactiveFilterPopup(true)}>
                                {isfiltervalue === "" ? "Status All" : isfiltervalue} <FaAngleDown className="text-admin-text-primary" />
                            </th>
                            <th className="px-4 py-3 text-center text-lg">Product Count</th>
                            <th className="px-4 py-3 text-center text-lg">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {singleCustomerOrder?.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-4 text-start py-3">{order.id}</td>
                                <td className="px-0 text-start py-3">{order.order_info?.created_at || "N/A"}</td>
                                <td className="px-4 text-center py-3">{order.payment_info?.payment_transaction_id || "N/A"}</td>
                                <td className="px-4 text-center py-3">{currency}{(order.order_info?.final_total).toFixed(2)}</td>
                                <td className="px-4 text-center py-3">{order.payment_info?.payment_type}</td>
                                <td className="px-4 text-center py-3 font-semibold text-[#577C8E]">
                                    {order.order_info?.order_status || "N/A"}
                                    {/* <span className={`px-2 py-1 text-lg font-semibold text-white rounded  ${getStatusClass(order.order_info?.order_status || "N/A")}`}>
                                    </span> */}
                                </td>
                                <td className="px-4 text-center py-3">{order.purchased_item_count}</td>
                               
                                <td className="px-4 text-center py-3">
                                    <button onClick={() => handleViewDetails(order)}>
                                        <IoEye size={26} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
               
            </div>
             <div className="flex justify-center mt-4">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-admin-buttonprimary text-white rounded-md mx-1">
                        Prev
                    </button>
                    <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-admin-buttonprimary text-white rounded-md mx-1">
                        Next
                    </button>
                </div>
            {isPopupVisible && (
                <OrderDetailsPopup
                    selectedOrder={selectedOrder}
                    isPopupVisible={isPopupVisible}
                    setPopupVisible={setPopupVisible}
                    singleCustomerOrder={singleCustomerOrder}
                />
            )}

            {
                isActiveInactiveFitlerPopup && (
                    <OrderFilterpopupCompoent
                        isOpenActiveInactivePopup={isActiveInactiveFitlerPopup}
                        setIsActiveInactiveFilterPopup={setIsActiveInactiveFilterPopup}
                        handlefilter={handlefilter}
                        isfiltervalue={isfiltervalue}
                    />
                )
            }
        </div>
    );
};

export default CustomerAllOrderComponent;
