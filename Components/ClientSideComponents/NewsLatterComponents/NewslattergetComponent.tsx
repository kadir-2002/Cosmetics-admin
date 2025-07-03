"use client";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { GoSearch } from "react-icons/go";
import { AiOutlineClose } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { clearUserDetails } from "@/redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { newsletterAllDataApi } from "@/apis/newslatterApi";
import { MdArrowDropUp } from "react-icons/md";
import { IoMdArrowDropdown } from "react-icons/io";

type Newsletter = {
  id: number;
  email: string;
  subscribed_at: string;
};
const NewslattergetComponent = () => {
  const [newsletter, setNewsletter] = useState<Newsletter[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [ordering, setOrdering] = useState("");
  const token = useSelector((state: any) => state?.user?.token);
  const dispatch = useDispatch();
  const router = useRouter();
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };
  const clearSearch = () => {
    setSearchText("");
  };
  const tokenErrorShown = useRef(false);
  const fetchNewsletter = async () => {
    try {
      const response = await newsletterAllDataApi({
        search: searchText,
        pageSize: pageSize,
        token: token,
        ordering: ordering,
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
        setNewsletter(response?.results);
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
    fetchNewsletter();
  }, [searchText, currentPage, ordering]);
  const handleOrdering = (field: string) => {
    setOrdering((prev) => (prev === field ? `-${field}` : field));
  };
  return (
    <>
      <div className='w-full flex flex-col lg:items-center lg:p-4'>
        <div className='flex justify-center items-center mx-auto w-full mb-4 lg:gap-8 gap-3'>
          <div className='md:w-[80%] w-[95%] relative'>
            <div className='relative'>
              <span className='absolute top-1/2 transform -translate-y-1/2 bg-admin-primary h-full w-[50px] rounded-l-lg flex justify-center items-center'>
                <GoSearch size={23} color='white' />
              </span>
              <input
                type='text'
                className='w-full p-2 pl-16 pr-10 border h-12 bg-white border-gray-500 rounded-lg focus:outline-none'
                placeholder='Search by Email'
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
        <div className='bg-white shadow-md rounded-lg w-full flex justify-center items-center mt-6 hidescroll'>
          <div className='hidescroll overflow-x-auto w-full'>
            <table className='w-full border-collapse'>
              <thead className='bg-admin-secondary text-admin-text-primary lg:text-lg cursor-pointer'>
                <tr>
                  <th className='p-3 text-left'>Email</th>
                  <th
                    className={`p-3 text-center cursor-pointer transition-colors duration-200 ${
                      ordering === "subscribed at" ||
                      ordering === "-subscribed at"
                        ? "text-admin-text-primary"
                        : "text-admin-text-primary"
                    }`}
                    onClick={() => handleOrdering("subscribed_at")}
                  >
                    <div className=' flex space-x-0 justify-center items-center'>
                      <span className=''>Date</span>
                      <span className='leading-none'>
                        <MdArrowDropUp
                          className={`w-7 h-7 transform -mb-1 ${
                            ordering === "subscribed at"
                              ? "text-admin-text-primary"
                              : "text-admin-text-primary"
                          }`}
                        />
                        <IoMdArrowDropdown
                          className={`w-7 h-7 transform -mt-3 ${
                            ordering === "-subscribed at"
                              ? "text-admin-text-primary"
                              : "text-admin-text-primary"
                          }`}
                        />
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {newsletter?.map((user: any, index: any) => (
                  <tr key={index} className='border-b hover:bg-purple-100'>
                    <td className='p-3 text-left'>{user?.email}</td>
                    <td className='p-3 text-center'>{user?.subscribed_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {newsletter.length === 0 && (
              <div className='text-center p-4'>No data found</div>
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

export default NewslattergetComponent;
