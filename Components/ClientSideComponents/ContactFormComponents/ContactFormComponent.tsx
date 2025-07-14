"use client";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { GoSearch } from "react-icons/go";
import { AiOutlineClose } from "react-icons/ai";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { clearUserDetails } from "@/redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import CoustomerInfoPopupComponent from "../CustomerComponents/InfoCustomerComponent";
import { contactAllDataApi, contactUpdatedApi } from "@/apis/newslatterApi";
import { TbEdit } from "react-icons/tb";
import { RiArticleFill } from "react-icons/ri";

type User = {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  phone_number: number;
  city: string;
  state: string;
  country: false;
  own_retail_space: string;
  subject: string;
  message: string;
  contacted_the_customer: string;
  reply_given: string;
  updated_by: string;
};

const ContactFormComponent = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newUser, setNewUser] = useState({
    id: "",
    name: "",
    email: "",
    reply_given: "",
    contacted_the_customer: false,
  });
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [pageSize] = useState(10);
  const [isUserInfo, setIsuserInfo] = useState<boolean>(false);
  const [isinfo, setIsinfo] = useState<number>();
  const [isActiveInactiveFitlerPopup, setIsActiveInactiveFilterPopup] =
    useState<boolean>(false);
  const [isActiveInactiveValue, setActiveInactivevalue] = useState<string>("");
  const [openForm, setOpenForm] = useState<boolean>(false);
  const token = useSelector((state: any) => state?.user?.token);
  const dispatch = useDispatch();
  const router = useRouter();
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1)
    setSearchText(e.target.value);
  };
  const clearSearch = () => {
    setSearchText("");
  };

  const searchParams = useSearchParams();
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
      const response = await contactAllDataApi({
        search: searchText,
        current_page: currentPage,
        page_size: pageSize,
        token: token,
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
      if (response?.results) {
        setUsers(response?.results);
        setTotalPages(response?.total_pages);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
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
  const handleEdit = (user: {
    id: string;
    email: string;
    name: string;
    contacted_the_customer: boolean;
    reply_given: string;
  }) => {
    setOpenForm(true);
    setNewUser({
      id: user?.id,
      email: user?.email,
      name: user?.name,
      contacted_the_customer: user?.contacted_the_customer,
      reply_given: user?.reply_given,
    });

    setSelectedRoleId(user.id);
  };
  useEffect(() => {
    fetchCustomer();
  }, [searchText, currentPage]);

  const handleOpenInfo = (id: number) => {
    setIsuserInfo(true);
    setIsinfo(id);
  };
  const handleCreateOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { id, email, name, contacted_the_customer, reply_given } = newUser;
    try {
      const response = await contactUpdatedApi(
        id,
        contacted_the_customer,
        reply_given,
        token
      );
      if (response?.status === 200) {
        toast.success("Updated successfully");
        fetchCustomer();
        setOpenForm(false);
        setNewUser({
          id: "",
          name: "",
          email: "",
          reply_given: "",
          contacted_the_customer: false,
        });
      } else if (
        response?.data?.error === "This sequence number already exists"
      ) {
        toast.error("This sequence number already exists");
      } else if (response?.data?.message === "Invalid or expired token") {
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again");
        router.push("/");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  const handlecCancleEdit = () => {
    setOpenForm(false);
    setNewUser({
      id: "",
      name: "",
      email: "",
      reply_given: "",
      contacted_the_customer: false,
    });
  };

  return (
    <>
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
                placeholder='Search by Name, Email, Phone Number, State and City'
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
          </div>
        </div>
        {openForm && (
          <form
            onSubmit={handleCreateOrUpdate}
            className='bg-white border-[1px] shadow-md rounded-lg lg:p-6 p-4 mb-6 lg:w-[90%] w-full'
          >
            <div className='grid grid-cols-1 lg:grid-cols-2 lg:gap-4 gap-5'>
              <div className='relative w-full bg-[#F3F3F3] rounded-lg shadow-sm'>
                <div className='flex bg-[#F3F3F3] p-3  h-12 rounded-md'>
                  <RiArticleFill color='#A5B7C0' size={26} />
                  <input
                    type='text'
                    name='Name'
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    disabled
                    // placeholder="Enter Sequence Number"
                    required
                    className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
                  />
                  <label
                    htmlFor='tag'
                    className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                  >
                    Name
                  </label>
                </div>
              </div>
              <div className='relative w-full bg-[#F3F3F3] rounded-lg shadow-sm'>
                <div className='flex bg-[#F3F3F3] p-3  h-12 rounded-md'>
                  <RiArticleFill color='#A5B7C0' size={26} />
                  <input
                    type='text'
                    name='Name'
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser((prev) => ({
                        ...prev,
                        sequence_number: e.target.value,
                      }))
                    }
                    disabled
                    // placeholder="Enter Sequence Number"
                    required
                    className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
                  />
                  <label
                    htmlFor='tag'
                    className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                  >
                    Email
                  </label>
                </div>
              </div>
              <div className='relative w-full bg-[#F3F3F3] rounded-lg shadow-sm'>
                <div className='flex bg-[#F3F3F3] p-3  h-12 rounded-md'>
                  <RiArticleFill color='#A5B7C0' size={26} />
                  <input
                    type='text'
                    name='link'
                    value={newUser.reply_given}
                    onChange={(e) =>
                      setNewUser((prev) => ({
                        ...prev,
                        reply_given: e.target.value,
                      }))
                    }
                    // placeholder="Enter Sequence Number"
                    required
                    className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
                  />
                  <label
                    htmlFor='tag'
                    className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                  >
                    Reply Given
                  </label>
                </div>
              </div>
              <div className='lg:flex gap-6 h-12'>
                <div className='flex items-center gap-4 w-full lg:mt-0 mt-4'>
                  <div className='flex  items-center justify-between gap-2 bg-[#F3F3F3] rounded-lg h-12 w-full p-4'>
                    <label className='text-md text-[#577C8E] px-3'>
                      Contacted The Customer?
                    </label>
                    <div className='switch w-full'>
                      <label>
                        <input
                          type='checkbox'
                          checked={newUser.contacted_the_customer}
                          onChange={(e) =>
                            setNewUser((prev) => ({
                              ...prev,
                              contacted_the_customer: e.target.checked,
                            }))
                          }
                        />
                        <span className='slider'></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='lg:mt-12 mt-12 flex gap-3 justify-center items-center'>
              <button
                type='submit'
                className='text-lg lg:w-[200px] mt-3  bg-green-500 text-white px-6 lg:py-3 py-2 rounded-md'
              >
                Update
              </button>

              <>
                <button
                  onClick={handlecCancleEdit}
                  className='text-lg lg:w-[200px] mt-3 bg-[#577C8E] text-white px-6 lg:py-3 py-2 rounded-md'
                >
                  Cancel
                </button>
              </>
            </div>
          </form>
        )}

        <div className='bg-white shadow-md rounded-lg w-full flex justify-center items-center mt-6 hidescroll'>
          <div className='hidescroll overflow-x-auto w-full'>
            <table className='w-full border-collapse'>
              <thead className='bg-admin-secondary text-admin-text-primary lg:text-lg cursor-pointer'>
                <tr>
                  <th className='p-3 text-left w-[14%]'>Name</th>
                  <th className='p-3 text-left w-[14%]'>Email</th>
                  <th className='p-3 text-right w-[14%]'>Phone Number</th>
                  <th className='p-3 text-right w-[14%]'>Own Retail</th>
                  <th className='p-3 text-center w-[14%]'>Country</th>
                  <th className='p-3 text-center w-[14%]'>State</th>
                  <th className='p-3 text-center w-[14%]'>City</th>
                  <th className='p-3 text-center w-[14%]'>Edit</th>
                  <th className='p-3 text-center w-[14%]'>Info</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((user: any, index: any) => (
                  <tr key={index} className='border-b hover:bg-purple-100'>
                    <td className='p-3 capitalize text-left'>{user?.name}</td>
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
                    <td className='p-3 text-center'>{user?.own_retail_space ? "Yes":"NO"}</td>
                    <td className='p-3 text-center'>{user?.country}</td>
                    <td className='p-3 text-center'>{user?.state}</td>
                    <td className='p-3 text-center'>{user?.city}</td>
                    <td className='py-3 px-4 items-center'>
                      <div className='flex justify-center gap-4'>
                        <button
                          onClick={() => handleEdit(user)}
                          className='text-orange-500'
                        >
                          <TbEdit size={26} />
                        </button>
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
            <div className='text-center p-4'>No data found</div>
          )}

            {isUserInfo && (
              <CoustomerInfoPopupComponent
                user={users.find((user) => user.id === isinfo)}
                isUserInfo={isUserInfo}
                setIsuserInfo={setIsuserInfo}
                setIsOpen={setIsuserInfo}
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
      </div>
    </>
  );
};

export default ContactFormComponent;
