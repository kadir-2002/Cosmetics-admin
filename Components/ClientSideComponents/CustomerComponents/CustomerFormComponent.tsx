"use client";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { GoSearch } from "react-icons/go";
import { AiOutlineClose } from "react-icons/ai";
import {
  customerAllDataApi,
  customerDeleteApi,
  customerUpdatedApi,
} from "@/apis/customerApi";
import AddAddressComponent from "./AddAddressComponent";
import CoustomerInfoPopupComponent from "./InfoCustomerComponent";
import CustomerDeleteCompoent from "./CustomerDeleteCompoent";
import { FaAngleDown, FaCircleUser } from "react-icons/fa6";
import { Switch } from "@headlessui/react";
import { useSearchParams } from "next/navigation";
import { MdArrowDropUp, MdEmail } from "react-icons/md";
import { useRouter } from "next/navigation";
import { clearUserDetails } from "@/redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import ActiveInactiveFilterPopup from "../RoleFormComponents/ActiveInactiveFilterPopup";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import CustomerAllOrderComponent from "./CustomerAllOrderComponent";
import DatePicker from "react-datepicker";
import { CiCalendar } from "react-icons/ci";
import "react-datepicker/dist/react-datepicker.css";

type User = {
  id: number;
  password: string;
  profileImg: string;
  first_name: string;
  last_name: string;
  phone_number: number;
  email: string;
  profile_picture: string;
  is_active: false;
  category: string;
  last_login: string;
  date_joined: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
};
const formatDate = (date: Date | null): string => {
  if (!date) return ""; // Return an empty string instead of null
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // Format as "YYYY-MM-DD"`
};
const CustomerFormComponent = () => {
  const [users, setUsers] = useState<User[]>([]);

  const [newUser, setNewUser] = useState({
    id: "",
    password: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    is_active: false,
    profile_picture: "",
  });
  const [isOpenDeletePopup, setIsLogoutPopup] = useState<boolean>(false);
  const [selectedUserId, setSelectedCustomerId] = useState("");
  const [selectedRoleId, setSelectCustomerid] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [searchText, setSearchText] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [isUserInfo, setIsuserInfo] = useState<boolean>(false);
  const [isfile, setfile] = useState("");
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [isopenaddres, setIsopenAddres] = useState<boolean>(false);
  const [isaddresid, setIsAddresid] = useState<any>();
  const [isinfo, setIsinfo] = useState<number>();
  const [fileName, setFileName] = useState("");
  const [isloading, setloading] = useState<boolean>(false);
  const [isActiveInactiveFitlerPopup, setIsActiveInactiveFilterPopup] =
    useState<boolean>(false);
  const [isActiveInactiveValue, setActiveInactivevalue] = useState<string>("");
  const [ordering, setOrdering] = useState("");
  const [showCustomerDetailsComponent, setIsShowCustomerDetailsComponent] =
    useState<boolean>(false);
  const [isCustomerSelectId, setCustomerSelectId] = useState<string>("");
  const token = useSelector((state: any) => state?.user?.token);
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const searchParams = useSearchParams();
  const startDateURL = searchParams.get("start_date");
  const endDateURL = searchParams.get("end_date");
  const router = useRouter();
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  };
  const clearSearch = () => {
    setSearchText("");
  };
  const status = searchParams.get("is_active") || "";
  const isActive =
    status === "true" ? true : status === "false" ? false : undefined;
  useEffect(() => {
    if (isActive === true) {
      setActiveInactivevalue("Active");
    } else if (isActive === false) {
      setActiveInactivevalue("Inactive");
    } else {
      setActiveInactivevalue("");
    }
  }, [status]);

  const customerIdString = searchParams.get("id") || "";
  const customerId = customerIdString
    ? parseInt(customerIdString, 10)
    : undefined;
  const tokenErrorShown = useRef(false);
  const isActiveInactive =
    isActiveInactiveValue === "Active"
      ? true
      : isActiveInactiveValue === "Inactive"
      ? false
      : undefined;

  const fetchCustomer = async () => {
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
        formattedEndDate = formatDate(endDate);
      }

      const response = await customerAllDataApi({
        id: customerId || 0,
        is_active: isActive,
        search: searchText,
        current_page: currentPage,
        total_pages: totalPages,
        page_size: pageSize,
        token: token,
        ordering: ordering,
        startDates: formattedStartDate,
        endDates: formattedEndDate,
        isActiveInactive: isActiveInactive,
      });
      if (response?.detail === "Invalid token") {
        if (!tokenErrorShown.current) {
          tokenErrorShown.current = true; // Prevent further toasts
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
        }
        return;
      }
      if (response?.results) {
        setUsers(response?.results);
        setTotalPages(response?.total_pages);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
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

  useEffect(() => {
    fetchCustomer();
  }, [
    searchText,
    currentPage,
    ordering,
    startDateURL,
    endDateURL,
    isActiveInactive,
    startDate,
    endDate,
  ]);

  const handleAddress = (id: string) => {
    setIsopenAddres(true);
    setIsAddresid(id);
  };
  const handleOpenInfo = (id: number) => {
    setIsuserInfo(true);
    setIsinfo(id);
  };

  const activeHandler = async (data: any, isActive: boolean) => {
    setloading(true);
    const profile_picture = isfile;
    const response = await customerUpdatedApi(
      data?.id,
      data?.first_name,
      data?.last_name,
      data?.phone_number,
      data?.email,
      profile_picture,
      isActive,
      token
    );
    if (response?.status === 401) {
      dispatch(clearUserDetails());
      toast.error("Session Expired, Please Login Again");
      router.push("/");
      return;
    }
    if (response?.status === 200) {
      fetchCustomer();
      setloading(false);
    }
    setloading(false);
  };

  const handleOrdering = (field: string) => {
    setOrdering((prev) => (prev === field ? `-${field}` : field));
  };
  const handleActiveInactivefilter = (value: any) => {
    setActiveInactivevalue(value);
    setCurrentPage(1);
    setIsActiveInactiveFilterPopup(false);
  };
  const handleOpenOrderPopup = (user: any) => {
    setIsShowCustomerDetailsComponent(true);
    setCustomerSelectId(user?.id);
  };

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

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  const handleClear = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("start_date");
    params.delete("end_date");
    const todays = new Date();
    todays.setHours(0, 0, 0, 0);
    setStartDate(new Date(todays));
    setEndDate(new Date(todays));
    setCurrentPage(1);

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleStartDateChange = (date: Date | null) => {
    if (!date) return;
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    if (selectedDate > today) return;
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

    if (selectedDate > today) return;
    if (startDate && selectedDate < startDate) {
      const newStartDate = new Date(selectedDate);
      newStartDate.setDate(selectedDate.getDate() - 1);
      if (newStartDate >= new Date("2000-01-01")) {
        setStartDate(newStartDate);
      }
    }

    setEndDate(selectedDate);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("id");
    params.delete("order_status");
    params.delete("end_date");
    router.push(`?${params.toString()}`);
  };

  return (
    <>
      {showCustomerDetailsComponent ? (
        <>
          {" "}
          <button
            className='border-[1px] lg:ml-2 border-gray-500 bg-admin-buttonprimary text-white px-8 text-md py-2 rounded-md'
            onClick={() => setIsShowCustomerDetailsComponent(false)}
          >
            Back
          </button>
          <CustomerAllOrderComponent isCustomerSelectId={isCustomerSelectId} />
        </>
      ) : (
        <div className='w-full flex flex-col lg:items-center lg:p-4'>
          <div className='flex justify-center items-center mx-auto w-full mb-4 lg:gap-8 gap-3'>
            <div className='md:w-[80%] w-[95%] relative'>
              <div className='relative'>
                <span className='absolute top-1/2 transform -translate-y-1/2 bg-admin-buttonprimary h-full w-[50px] rounded-l-lg flex justify-center items-center'>
                  <GoSearch size={23} color='white' />
                </span>
                <input
                  type='text'
                  className='w-full p-2 pl-16 pr-10 border h-12 bg-white border-gray-500 rounded-lg focus:outline-none'
                  placeholder='Search by Name, Email, Phone Number'
                  value={searchText}
                  onChange={handleSearchChange}
                />
                {searchText && (
                  <button
                    className='absolute right-3 top-1/2 transform -translate-y-1/2'
                    onClick={clearSearch}
                  >
                    <AiOutlineClose size={23} />
                  </button>
                )}
              </div>
              {status ? null: <>
                  <div className='flex w-full lg:justify-start justify-center items-center flex-row mt-6 gap-3'>
                    <div className='flex lg:flex-row justify-center items-center flex-col gap-2 '>
                      <p className='text-lg'>Start Date :</p>
                      <div className='relative border-[1px] rounded-md'>
                        <DatePicker
                          selected={startDate}
                          onChange={handleStartDateChange}
                          placeholderText='Start Date'
                          className='text-lg lg:w-[140px] w-[150px] text-black p-2 h-10 bg-white text-right px-3 rounded-md focus:outline-none'
                          popperClassName='custom-popper'
                          popperPlacement='bottom-start'
                        />
                        <div className='absolute left-2 top-[49%] transform -translate-y-1/2 text-black'>
                          <CiCalendar size={22} className='text-black' />
                        </div>
                      </div>
                    </div>
                    <div className='flex  lg:flex-row flex-col justify-center items-center rounded-md gap-2'>
                      <p className='text-lg'>End Date :</p>
                      <div className='relative border-[1px] rounded-md'>
                        <DatePicker
                          selected={endDate}
                          onChange={handleEndDateChange}
                          placeholderText='End Date'
                          className='text-lg lg:w-[140px] w-[150px]  text-black p-2 h-10 bg-white text-right px-3 rounded-md focus:outline-none'
                          popperClassName='custom-popper'
                          popperPlacement='bottom-start'
                        />
                        <div className='absolute left-2 top-[49%] transform -translate-y-1/2 text-black'>
                          <CiCalendar size={22} className='text-black' />
                        </div>
                      </div>
                    </div>
                    <div className='lg:flex hidden justify-center items-center'>
                      {!(isToday(startDate) && isToday(endDate)) && (
                        <button
                          onClick={handleClear}
                          className='px-4 py-2 w-[120px] bg-admin-buttonprimary text-white rounded-md'
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                  <div className='flex lg:hidden justify-center items-center mt-3'>
                    {!(isToday(startDate) && isToday(endDate)) && (
                      <button
                        onClick={handleClear}
                        className='px-4 py-2 w-[120px] bg-admin-buttonprimary text-white rounded-md'
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </>}
            </div>
          </div>
          <div className='bg-white shadow-md rounded-lg w-full flex justify-center items-center mt-6 hidescroll'>
            <div className='hidescroll overflow-x-auto w-full'>
              <table className='w-full border-collapse'>
                <thead className='bg-admin-secondary text-admin-text-primary lg:text-lg cursor-pointer'>
                  <tr>
                    <th className='p-3 text-left w-[14%]'>Profile</th>
                    <th
                      className={`w-[14%] p-3 text-center cursor-pointer transition-colors duration-200 ${
                        ordering === "first_name" || ordering === "-first_name"
                          ? "text-admin-text-primary "
                          : "text-admin-text-primary "
                      }`}
                      onClick={() => handleOrdering("first_name")}
                    >
                      <div className='flex items-center justify-start space-x-0'>
                        <span className=''>Name</span>
                        <span className='flex flex-col leading-none'>
                          <MdArrowDropUp
                            className={`w-7 h-8 transform -mb-1 ${
                              ordering === "first_name"
                                ? "text-admin-text-primary "
                                : "text-admin-text-primary "
                            }`}
                          />
                          <IoMdArrowDropdown
                            className={`w-7 h-7 transform -mt-3 ${
                              ordering === "-first_name"
                                ? "text-admin-text-primary "
                                : "text-admin-text-primary "
                            }`}
                          />
                        </span>
                      </div>
                    </th>
                    <th className='p-3 text-left w-[14%]'>Email</th>
                    <th className='p-3 text-right w-[14%]'>Phone Number</th>
                    <th className='p-3 text-left'>Guest</th>
                    <th
                      className='p-3 w-[14%] text-center cursor-pointer transition-colors duration-200'
                      onClick={() => setIsActiveInactiveFilterPopup(true)}
                    >
                      <div className='flex items-center justify-center space-x-1'>
                        <span className=''>
                          {isActiveInactiveValue === ""
                            ? "Status"
                            : isActiveInactiveValue}
                        </span>
                        <span className='flex flex-col leading-none'>
                          <FaAngleDown className='text-admin-text-primary ' />
                        </span>
                      </div>
                    </th>
                    <th className='p-3 text-center'>Orders</th>
                    <th className='p-3 text-center w-[15%]'>Address</th>
                    <th className='p-3 text-center w-[14%]'>Info</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((user: any, index: any) => (
                    <tr key={index} className='border-b'>
                      <td className='p-3 text-center flex justify-start items-center'>
                        {user?.profile_picture ? (
                          <>
                            <img
                              src={`${process.env.NEXT_PUBLIC_BASE_URL}${user?.profile_picture}`}
                              alt='Profile'
                              className='lg:h-16 lg:w-16 h-10 w-12 object-cover rounded-full'
                            />
                          </>
                        ) : (
                          <div className='lg:h-16 lg:w-16 h-10 w-12'>
                            <FaCircleUser className='w-full h-full' />
                          </div>
                        )}
                      </td>
                      <td className='p-3 capitalize text-left'>
                        {user?.first_name} {user?.last_name}
                      </td>
                      <td className='p-3 text-left '>{user?.email}</td>
                      <td className='p-3 text-right'>
                        {user?.country_code_for_phone_number ? (
                          <>
                            {user?.country_code_for_phone_number}
                            {user?.phone_number}
                          </>
                        ) : (
                          <>{user?.phone_number}</>
                        )}
                      </td>
                      <td className='p-3 text-left '>{user?.is_guest ? "Yes":"No"}</td>
                      <td className='p-3 text-center'>
                        <div className='flex flex-col items-center'>
                          <Switch
                            checked={user?.is_active}
                            onChange={() =>
                              activeHandler(user, !user?.is_active)
                            }
                            className={`${
                              user?.is_active ? "bg-green-500" : "bg-gray-300"
                            } relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-200 ease-in-out`}
                          >
                            <span
                              className={`${
                                user?.is_active
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              } inline-block w-6 h-6 bg-white rounded-full transition-transform duration-200 ease-in-out`}
                            />
                          </Switch>
                        </div>
                      </td>

                      <td
                        className='p-3 text-center'
                        onClick={() => handleOpenOrderPopup(user)}
                      >
                        <button className='flex p-3 justify-center item-center'>
                          <IoEye size={26} />
                        </button>
                      </td>
                      <td
                        className='p-3 text-center'
                        onClick={() => handleAddress(user?.id)}
                      >
                        <div className='flex justify-center'>
                          <img
                            src='/addressicon.png'
                            alt='Profile'
                            className='h-8 w-8 object-cover'
                          />
                        </div>
                      </td>
                      <td className='p-3 text-center'>
                        <div className='flex justify-center'>
                          <button
                            className='text-blue-500'
                            aria-label='Info'
                            onClick={() => {
                              handleOpenInfo(user?.id);
                            }}
                          >
                            {" "}
                            <img
                              src='/Info.png'
                              alt='Profile'
                              className='h-6 w-6 object-cover rounded-full'
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className='text-center p-4'>No customer available</div>
              )}
              {isopenaddres && (
                <AddAddressComponent
                  user={isaddresid}
                  isopenaddres={isopenaddres}
                  token={token}
                  setIsopenAddre={setIsopenAddres}
                />
              )}
              {isUserInfo && (
                <CoustomerInfoPopupComponent
                  user={users.find((user) => user.id === isinfo)}
                  isUserInfo={isUserInfo}
                  setIsuserInfo={setIsuserInfo}
                  setIsOpen={setIsuserInfo}
                />
              )}
              {isActiveInactiveFitlerPopup && (
                <ActiveInactiveFilterPopup
                  isOpenActiveInactivePopup={isActiveInactiveFitlerPopup}
                  setIsActiveInactiveFilterPopup={
                    setIsActiveInactiveFilterPopup
                  }
                  handlefilter={handleActiveInactivefilter}
                  isActiveInactiveValue={isActiveInactiveValue}
                />
              )}
            </div>
          </div>
          <div className='flex justify-center mt-4'>
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className='px-4 py-2 bg-admin-buttonprimary text-white rounded-md mx-1'
            >
              Prev
            </button>
            <span className='px-4 py-2'>{`Page ${currentPage} of ${totalPages}`}</span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className='px-4 py-2 bg-admin-buttonprimary text-white rounded-md mx-1'
            >
              Next
            </button>
          </div>
          <div></div>
          {isloading && (
            <div className='fixed inset-0  flex items-center justify-center z-50'>
              <div className='dot-spinner'>
                <div className='dot-spinner__dot'></div>
                <div className='dot-spinner__dot'></div>
                <div className='dot-spinner__dot'></div>
                <div className='dot-spinner__dot'></div>
                <div className='dot-spinner__dot'></div>
                <div className='dot-spinner__dot'></div>
                <div className='dot-spinner__dot'></div>
                <div className='dot-spinner__dot'></div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default CustomerFormComponent;
