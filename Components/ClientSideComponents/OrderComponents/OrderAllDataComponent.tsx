"use client";
import React, { useState, useEffect, useRef } from "react";
import { orderAllDataApi, orderUpdatedApi, } from "@/apis/orderAPi";
import { GoSearch } from "react-icons/go";
import { AiOutlineClose } from "react-icons/ai";
import { IoEye } from "react-icons/io5";
import OrderInfoComponent, { formatIST } from "./OrderInfoComponent";
import OrderPopup from "./OrderPopupComponent";
import toast from "react-hot-toast";
import { FaAngleDown } from "react-icons/fa6";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSearchParams, useRouter } from 'next/navigation'
import { CiCalendar } from "react-icons/ci";
import { clearUserDetails } from "@/redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OrderFilterpopupCompoent from "./OrderFilterpopupCompoent";
import { MdArrowDropUp } from "react-icons/md";
import { IoMdArrowDropdown } from "react-icons/io";
interface Order {
  id: string;
  purchased_item_count: string;
  totalAmount: number,
  createdAt: string,
  status: string,
  items: [],
  address: {
    fullName: string
  }
  payment?: {
    method: string
  }
  customer_info?: {
    first_name: string;
  };
  order_info?: {
    final_total: number;
    order_status: string;
    created_at_formatted: string;
  };
  payment_info?: {
    is_payment_done: boolean;
    payment_type: string;
  };
  user?: {
    email: string
  }
}

const formatDate = (date: Date | null): string => {
  if (!date) return ""; // Return an empty string instead of null
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // Format as "YYYY-MM-DD"
};

const OrderAllDataComponent = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isPopupVisible, setPopupVisible] = useState<boolean>(false);
  const [isInfoPopupVisible, setInfoPopupVisible] = useState<boolean>(false);
  const updated_by = useSelector((state: any) => state?.user?.details?.id);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [isloading, setloading] = useState<boolean>(false)
  const [isActiveInactiveFitlerPopup, setIsActiveInactiveFilterPopup] = useState<boolean>(false)
  const [ordering, setOrdering] = useState("");
  const [isfiltervalue, setfiltervalue] = useState<string>("")
  const token = useSelector((state: any) => state?.user?.token);
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get('order_status') || '';
  const OrderId = searchParams.get('id') || ''
  const startDateURL = searchParams.get('start_date')
  const endDateURL = searchParams.get('end_date')
  const currency = useSelector((state: any) => state?.user?.details?.currency_symbol);
  const [pageInput, setPageInput] = useState('');

  // const [isStartDateChanged, setIsStartDateChanged] = useState(false);
  // const [isEndDateChanged, setIsEndDateChanged] = useState(false);

const getPageNumbers = () => {
  const pages: (number | string)[] = [];

  // Always show first page
  pages.push(1);

  // Calculate range around current page
  let startPage = Math.max(2, currentPage - 1);
  let endPage = Math.min(totalPages - 1, currentPage + 1);

  // Add left ellipsis if needed
  if (startPage > 2) {
    pages.push('...');
  }

  // Add middle range
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  // Add right ellipsis if needed
  if (endPage < totalPages - 1) {
    pages.push('...');
  }

  // Add last page
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
};
  useEffect(() => {
    if (status) {
      setfiltervalue(status)
    }
  }, [status])
  useEffect(() => {
    if (startDateURL && endDateURL) {
      const parsedStartDate = new Date(decodeURIComponent(startDateURL));
      const parsedEndDate = new Date(decodeURIComponent(endDateURL));

      if (!isNaN(parsedStartDate.getTime())) {
        setStartDate(parsedStartDate);
      }
      if (!isNaN(parsedEndDate.getTime())) {
        setEndDate(parsedEndDate);
      }
    }
  }, [startDateURL, endDateURL]);

  const tokenErrorShown = useRef(false);
  const fetchOrders = async () => {
    try {
      let formattedStartDate: string;
      let formattedEndDate: string;
      if (startDateURL) {
        const parsedDate = new Date(decodeURIComponent(startDateURL));
        formattedStartDate = !isNaN(parsedDate.getTime())
          ? formatDate(parsedDate)
          : formatDate(startDate);
      } else {
        formattedStartDate = formatDate(startDate);
      }
      if (endDateURL) {
        const parsedDate = new Date(decodeURIComponent(endDateURL));
        formattedEndDate = !isNaN(parsedDate.getTime())
          ? formatDate(parsedDate)
          : formatDate(endDate);
      } else {
        formattedEndDate = formatDate(endDate)
      }

      const data = await orderAllDataApi({
        id: OrderId,
        search: searchText,
       startDates: formatDate(startDate) ,
       endDates: formatDate(endDate) ,
        current_page: currentPage,
        page_size: pageSize, token: token, 
        isfiltervalue: status ? status : isfiltervalue,
         ordering: ordering,
      });

      if (data?.body.message === "Authorization header missing or malformed") {
        if (!tokenErrorShown.current) {
          tokenErrorShown.current = true; // Prevent further toasts
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
        }
        return;
      }

      // if (data) {
      //   setOrders(data?.body.data || []);
      //   console.log(data.body,"------=================---------")
      //   setTotalPages(data?.body.pagination.totalPages);
      // } 
      if (data?.body?.success) {
        setOrders(data.body.result);
        setTotalPages(data.body.pagination?.total_pages|| 1);
      }

    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [searchText, startDate, endDate, OrderId, currentPage, startDateURL, endDateURL, isfiltervalue, ordering, status]);

  const handleClear = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("start_date");
    params.delete("order_status")
    params.delete("id")
    params.delete("end_date");
    router.push(`?${params.toString()}`);
    setfiltervalue("")
    const today = new Date();
    setStartDate(today);
    setEndDate(today);
    setCurrentPage(1)
//     setIsStartDateChanged(false);
// setIsEndDateChanged(false);

  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const trimmedValue = e.target.value.replace(/^\s+/, "");
    setSearchText(trimmedValue);
    setCurrentPage(1)
  };

  const clearSearch = () => {
    setSearchText("");
  };

  const openInfoPopup = (orderId: string) => {
    setSelectedOrderId(orderId);
    setInfoPopupVisible(true);
  };

  const openPopup = (orderId: string) => {
    setSelectedOrderId(orderId);
    setPopupVisible(true);
  };


  const activeHandler = async (userInformation: any, status: string) => {
    setloading(true)
    try {
      const response = await orderUpdatedApi(
        userInformation.id,
        status,
        updated_by,
        token
      );

      if (response?.status === 401) {
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again")
        router.push("/");
        return;
      }
      if (response?.status === 200) {
        toast.success("Order status updated successfully!");
        setloading(false)
        fetchOrders();
      } else {
        toast.error("Failed to update order status.");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("An error occurred while updating the status.");
    }
    setloading(false)
  };
  const getStatusClass = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-[#34A864]";
      case "SHIPPED":
        return "bg-[#3485A8]";
      case "PENDING":
        return "bg-[#A8A434]";
      case "CANCELLED":
        return "bg-[#A83434]";
      case "DELIVERED":
        return "bg-[#ff7800]";
      default:
        return "bg-[#ff7800]";
    }
  };
  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
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
const goToPage = () => {
  const page = Number(pageInput);
    if (page < 1 || page > totalPages) {
    toast.error(`Please enter a number between 1 and ${totalPages}`);
    return;
  }
  if (!isNaN(page) && page >= 1 && page <= totalPages) {
    setCurrentPage(page);
    setPageInput('');
  }
};


  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to midnight

  const handleStartDateChange = (date: Date | null) => {
    if (!date) return;

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate > today) return; // Disallow future dates

    if (endDate && selectedDate > endDate) {
      const newEndDate = new Date(selectedDate);
      newEndDate.setDate(selectedDate.getDate() + 1);
      if (newEndDate <= today) {
        setEndDate(newEndDate);
      } else {
        setEndDate(today);
      }
    }

    setStartDate(selectedDate);
    // setIsStartDateChanged(true);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("id");
    params.delete("order_status");
    params.delete("start_date");
    router.push(`?${params.toString()}`);
  };

  const handleEndDateChange = (date: Date | null) => {
    if (!date) return;

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate > today) return; // Disallow future dates

    // If end date < start date, adjust startDate to one day before endDate
    if (startDate && selectedDate < startDate) {
      const newStartDate = new Date(selectedDate);
      newStartDate.setDate(selectedDate.getDate() - 1);
      if (newStartDate >= new Date("2000-01-01")) { // Optional lower limit
        setStartDate(newStartDate);
      }
    }

    setEndDate(selectedDate);
    // setIsEndDateChanged(true);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("id");
    params.delete("order_status");
    params.delete("end_date");
    router.push(`?${params.toString()}`);
  };


  const handlefilter = (value: any) => {
    setfiltervalue(value);
    setIsActiveInactiveFilterPopup(false)
    setCurrentPage(1)
    const params = new URLSearchParams(searchParams.toString());
    params.delete("id")
    params.delete("order_status")
    router.push(`?${params.toString()}`);
  }

  console.log(orders, "Orders-Data")
  const handleOrdering = (field: string) => {
    setOrdering((prev: any) => (prev === field ? `-${field}` : field));
  };
  return (
    <div className="min-h-screen w-full flex flex-col lg:items-center" >
      <div className="flex flex-col justify-center items-center mx-auto w-full mb-2 lg:gap-8 gap-3">

        <div className="lg:w-[90%] w-full relative">
          <span className="absolute top-1/2 transform -translate-y-1/2 bg-admin-buttonprimary h-full w-[50px] rounded-l-lg flex justify-center items-center">
            <GoSearch size={23} color="white" />
          </span>
          <input
            type="text"
            className="w-full p-2 pl-16 pr-10 border h-12 bg-white border-gray-500 rounded-lg focus:outline-none"
            placeholder="Search by Customer Name, Order ID"
            value={searchText}
            onChange={handleSearchChange}
          />
          {searchText && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={clearSearch}>
              <AiOutlineClose size={23} />
            </button>
          )}
        </div>
        <div className="flex w-full lg:justify-start justify-center items-center flex-row  gap-3">
          <div className="flex lg:flex-row justify-center items-center flex-col gap-2 ">
            <p className="text-lg">Start Date :</p>
            <div className="relative border-[1px] rounded-md">
              <DatePicker
                selected={startDate}
                onChange={handleStartDateChange}
                placeholderText="Start Date"
                className="text-lg lg:w-[140px] w-[150px] text-black p-2 h-10 bg-white text-right px-3 rounded-md focus:outline-none"
                popperClassName="custom-popper"
                popperPlacement="bottom-start"
              />
              <div className="absolute left-2 top-[49%] transform -translate-y-1/2 text-black">
                <CiCalendar size={22} className="text-black" />
              </div>
            </div>
          </div>
          <div className="flex  lg:flex-row flex-col justify-center items-center rounded-md gap-2">
            <p className="text-lg">End Date :</p>
            <div className="relative border-[1px] rounded-md">
              <DatePicker
                selected={endDate}

                onChange={handleEndDateChange}
                placeholderText="End Date"
                className="text-lg lg:w-[140px] w-[150px]  text-black p-2 h-10 bg-white text-right px-3 rounded-md focus:outline-none"
                popperClassName="custom-popper"
                popperPlacement="bottom-start"
              />
              <div className="absolute left-2 top-[49%] transform -translate-y-1/2 text-black">
                <CiCalendar size={22} className="text-black" />
              </div>
            </div>
          </div>
          <div className="lg:flex hidden justify-center items-center">
            {!(isToday(startDate) && isToday(endDate)) && (
              <button
                onClick={handleClear}
                className="px-4 py-2 w-[120px] bg-admin-buttonprimary text-white rounded-md"
              >
                Clear
              </button>
            )}
          </div>
        </div>
        <div className="flex lg:hidden justify-center items-center">
          {!(isToday(startDate) && isToday(endDate)) && (
            <button
              onClick={handleClear}
              className="px-4 py-2 w-[120px] bg-admin-buttonprimary text-white rounded-md"
            >
              Clear
            </button>
          )}
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg w-full flex justify-center items-center mt-3">
        <div className="overflow-x-auto w-full">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-admin-secondary text-admin-text-primary font-semibold ">
                <th className="py-3 px-4 text-end">Order ID</th>
                <th className={`text-end cursor-pointer transition-colors duration-200 ${ordering === "created_at" || ordering === "-valid_from" ? "text-admin-text-primary" : "text-admin-text-primary"}`}
                  onClick={() => handleOrdering("created_at")}>
                  <div className="flex items-center justify-end space-x-0">
                    <span className="">Date</span>
                    <span className="flex flex-col leading-none">
                      <MdArrowDropUp
                        className={`w-7 h-8 transform -mb-1 ${ordering === "created_at" ? "text-admin-text-primary" : "text-admin-text-primary"}`}
                      />
                      <IoMdArrowDropdown
                        className={`w-7 h-7 transform -mt-3 ${ordering === "-created_at" ? "text-admin-text-primary" : "text-admin-text-primary"}`}
                      />
                    </span>
                  </div>
                </th>
                <th className="py-3 px-4 text-start">Customer</th>
                <th className="py-3 px-4 text-end">Payment</th>
                <th className="py-3 px-4 text-start">Payment Status</th>
                <th className="p-4 flex gap-1 justify-center items-center" onClick={() => setIsActiveInactiveFilterPopup(true)}>
                  {isfiltervalue === "" ? "Status All" : isfiltervalue} <FaAngleDown className="text-admin-text-primary" />

                </th>
                <th className="py-3 px-4 text-end">Product Count</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Info</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <tr key={index} className="border-b-[1px] hover:bg-purple-100">
                    <td className="py-3 px-4 text-end">{order?.id}</td>
                    <th className="py-3 px-4 text-end">{formatIST(order?.createdAt)}</th>
                    <td className="py-3 px-4 text-start">
                      {order?.address?.fullName || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-end">
                      {order?.totalAmount != null
                        ? `${Number(order.totalAmount).toFixed(2)}`
                        : "N/A"}
                    </td>
                    <td className="py-3 px-4 text-start">
                      {order?.payment?.method !== 'COD' ? 'ONLINE' : 'Cash On Delivery'}
                    </td>
                    <td className="py-3 px-4 text-center cursor-pointer">
                      <div className="relative inline-block lg:w-[176px] w-[176px]">
                        <select
                          // id={`select-${order?.id}`}
                          className={`border w-full text-md text-white font-medium rounded-md px-3 py-2 pr-10 appearance-none focus:outline-none ${getStatusClass(
                            order?.status || "Default"
                          )}`}
                          value={order?.status}
                          onChange={async (e) => {
                            const status = e.target.value;
                            const userInformation = { id: order?.id };
                            await activeHandler(userInformation, status);
                          }}
                        >
                          <option value="PENDING" className="bg-[#D1D5DB] text-black">
                            PENDING
                          </option>
                          <option value="CONFIRMED" className="bg-[#D1D5DB] text-black">
                            CONFIRMED
                          </option>

                          <option value="SHIPPED" className="bg-[#D1D5DB] text-black">
                            SHIPPED
                          </option>
                          <option value="DELIVERED" className="bg-[#D1D5DB] text-black">
                            DELIVERED
                          </option>
                          <option value="CANCELLED" className="bg-[#D1D5DB] text-black">
                            CANCELLED
                          </option>
                        </select>

                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                          <svg
                            className="w-7 h-7  text-white text-xl"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-end">{order?.items.length}</td>
                    <td className="py-3 px-4 text-center">
                      <button onClick={() => openPopup(order.id)}>
                        <IoEye size={26} />
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        className="text-blue-500"
                        onClick={() => openInfoPopup(order.id)}
                      >
                        <img
                          src="/Info.png"
                          alt="Info"
                          className="h-6 w-6 object-cover rounded-full"
                        />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-3 px-4 text-center">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {isInfoPopupVisible && selectedOrderId && (
        <OrderInfoComponent
          role={orders.find((order) => order.id === selectedOrderId)}
          isOpenInfoPopup={isInfoPopupVisible}
          setIsInfoPopup={setInfoPopupVisible}
          setIsOpen={setInfoPopupVisible} />
      )}
      {isPopupVisible && selectedOrderId && (
        <OrderPopup
          role={orders.find((order) => order.id === selectedOrderId)}
          isVisible={isPopupVisible}
          onClose={() => setPopupVisible(false)}
          setPopupVisible={setPopupVisible}
          isPopupVisible={isPopupVisible}
        />
      )} {
        isActiveInactiveFitlerPopup && (
          <OrderFilterpopupCompoent
            isOpenActiveInactivePopup={isActiveInactiveFitlerPopup}
            setIsActiveInactiveFilterPopup={setIsActiveInactiveFilterPopup}
            handlefilter={handlefilter}
            isfiltervalue={isfiltervalue}
          />
        )
      }
  <div className='flex flex-wrap justify-center items-center mt-4 gap-2'>

  <button
    onClick={handlePreviousPage}
    disabled={currentPage === 1}
    className='px-3 py-1 bg-admin-buttonprimary text-white rounded-md disabled:opacity-50'
  >
    Prev
  </button>

  {getPageNumbers().map((page, idx) =>
    page === '...' ? (
      <span key={`ellipsis-${idx}`} className='px-3 py-1'>
        ...
      </span>
    ) : (
      <button
        key={`page-${page}-${idx}`}
        onClick={() => setCurrentPage(Number(page))}
        className={`px-3 py-1 rounded-md border ${
          currentPage === page
            ? 'bg-admin-buttonprimary text-white'
            : 'bg-white text-gray-800'
        }`}
      >
        {page}
      </button>
    )
  )}

  <button
    onClick={handleNextPage}
    disabled={currentPage === totalPages}
    className='px-3 py-1 bg-admin-buttonprimary text-white rounded-md disabled:opacity-50'
  >
    Next
  </button>

  {
totalPages > 5 ?
 
  <div className='flex items-center gap-2 ml-4'>
    <input
      type='number'
      value={pageInput}
      onChange={(e) => setPageInput(e.target.value)}
      min={1}
      max={totalPages}
       className='w-16 px-2 py-1 border-[1px] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-admin-buttonprimary focus:border-admin-buttonprimary transition'
      placeholder='Page'
    />
    <button
      onClick={goToPage}
      className='px-3 py-1 bg-admin-buttonprimary text-white rounded-md'
    >
      Go
    </button>
  </div> : null  }

</div>

      {isloading && (
        <div className="fixed inset-0  flex items-center justify-center z-50">
          <div className="dot-spinner">
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderAllDataComponent;
