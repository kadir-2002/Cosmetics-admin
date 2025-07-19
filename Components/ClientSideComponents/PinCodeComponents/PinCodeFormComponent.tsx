"use client";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { TbEdit } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import { RiArticleFill } from "react-icons/ri";
import { FiUpload, FiDownload, FiFile, FiX } from "react-icons/fi";
import { FaAngleDown } from "react-icons/fa6";
import { Switch } from "@headlessui/react";
import "react-phone-number-input/style.css";
import UserInfoPopupComponent from "../UserComponents/UserInfoPopupComponent";
import { useDispatch, useSelector } from "react-redux";
import { clearUserDetails } from "@/redux/userSlice";
import { useRouter } from "next/navigation";
import ActiveInactiveFilterPopup from "../RoleFormComponents/ActiveInactiveFilterPopup";
import BannerDeleteComponent from "../BannerComponents/BannerDeleteComponent";
import {
  pincodeAllDataApi,
  pinCodeCreateApi,
  pincodeCSVUploadApi,
  pinCodeDeleteApi,
  pinCodeUpdatedApi,
} from "@/apis/pincodeApi";
import { FiMinus, FiPlus } from "react-icons/fi";
import { GoSearch } from "react-icons/go";
import { AiOutlineClose } from "react-icons/ai";
import DeletePincodeComponent from "./DeletePincodeComponent";
import { storeCSVUploADApi } from "@/apis/storeaddresApi";
import FileUploadModal from "./FileUploadModal";
import CSVActionPopup from "./FileUploadModal";

type data = {
  id: string;
  city: string;
  state: string;
  zipcode: number
  estimated_delivery_days: number;
  is_active: boolean;
};

const PinCodeFormComponent = () => {
  const [data, setData] = useState<data[]>([]);
  const [newUser, setNewUser] = useState({
    id: "",
    state: "",
    city: "",
    zipcode: "",
    estimated_delivery_days: 0,
    is_active: false,
  });
  const [isOpenDeletePopup, setIsLogoutPopup] = useState<boolean>(false);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isUserInfo, setIsuserInfo] = useState<boolean>(false);
   const [isfile, setfile] = useState<File | null>(null);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [isActiveInactiveFitlerPopup, setIsActiveInactiveFilterPopup] =
    useState<boolean>(false);
  const [isfiltervalue, setfiltervalue] = useState<string>("");
  const [ordering, setOrdering] = useState("sequence_number");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [searchText, setSearchText] = useState<string>("");
  const [isinfo, setIsinfo] = useState<number>();
  const token = useSelector((state: any) => state?.user?.token);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isCsvPopupOpen, setIsCsvPopupOpen] = useState(false);


  const handleCreateOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { id, city, state, zipcode, is_active ,estimated_delivery_days} = newUser;
    try {
      if (isEdit) {
        const response = await pinCodeUpdatedApi(
          id,
          state,
          city,
          is_active,
          zipcode,
          estimated_delivery_days,
          token
        );
        if (response?.status === 200) {
          toast.success("Updated successfully");
          setIsEdit(false);
          fetchPincode();
          setOpenForm(false);
          setfile(null);
          setNewUser({
            id: "",
            state: "",
            city: "",
            zipcode: "",
            estimated_delivery_days:0,
            is_active: false,
          });
        } else if (response?.data?.error === "This zipcode already exists") {
          toast.error("This Zipcode already exists");
        } else if (response?.data?.message === "Invalid or expired toke") {
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
        }
      } else {
        const response = await pinCodeCreateApi(
          state,
          city,
          zipcode,
          estimated_delivery_days,
          is_active,
          id,
          token
        );
        if (response?.body?.error === "Pincode already exists") {
          toast.error("This Zipcode already exists");
        } else if (response?.status === 201) {
          toast.success("Created successfully!");
          fetchPincode();
          setOpenForm(false);
          setfile(null);
          setNewUser({
            id: "",
            state: "",
            city: "",
            zipcode: "",
            estimated_delivery_days:0,
            is_active: false,
          });
        } else if (response?.body.message === "Invalid or expired token") {
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
        }
      }
    } catch (error) {
      toast.error("Network error");
    }
  };
  const handleEdit = (store: {
    id: string;
    state: string;
    city: string;
    zipcode: string;
    estimated_delivery_days: string;
    is_active: boolean;
    created_by: string;
  }) => {
    setOpenForm(true);
    console.log("isfile", isfile);
    setNewUser({
      id: store?.id,
      state: store?.state,
      city: store?.city,
      zipcode: store?.zipcode,
      estimated_delivery_days: Number(store?.estimated_delivery_days),
      is_active: store?.is_active,
    });
    setIsEdit(true);
  };
  const filtervalue =
    isfiltervalue === "Active"
      ? true
      : isfiltervalue === "Inactive"
      ? false
      : undefined;
  const fetchPincode = async () => {
    try {
      const apiParams: {
        search?: string;
        category?: string;
        current_page: number;
        page_size: number;
        token: string;
        ordering: string;
        filtervalue?: boolean;
      } = {
        current_page: currentPage,
        page_size: pageSize,
        token: token,
        ordering,
        filtervalue,
      };
      if (searchText) {
        apiParams.search = searchText;
      } else if (filtervalue) {
        apiParams.filtervalue = filtervalue;
      }
      const response = await pincodeAllDataApi(apiParams);
      if (response?.detail === "Invalid or expired token") {
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again");
        router.push("/");
        return;
      }
      if (response?.results) {
        setData(response.results);
        setTotalPages(response?.total_pages);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  const handlefilter = (value: any) => {
    setfiltervalue(value);
    setIsActiveInactiveFilterPopup(false);
    setCurrentPage(1);
  };
  useEffect(() => {
    fetchPincode();
  }, [ordering, isfiltervalue, currentPage, searchText]);

  const handleDelete = async (id: string) => {
    setSelectedRoleId(id);
    setIsLogoutPopup(true);
  };
  const handleDeleteConform = async (id: string) => {
    try {
      const response = await pinCodeDeleteApi(id, token);
      if (response?.success) {
        toast.success("Pincode Deleted successfully");
        setIsLogoutPopup(false);
        fetchPincode();
      } else if (response?.detail === "Invalid token") {
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again");
        router.push("/");
      } else {
        console.error("Unexpected response format:", response);
      }
    } catch (error) {
      console.error("Failed to delete role:");
    }
  };
  const handlecCancleEdit = () => {
    setIsEdit(false);
    setOpenForm(false);
    setNewUser({
      id: "",
      state: "",
      city: "",
      zipcode: "",
      estimated_delivery_days: 0,
      is_active: false,
    });
  };

  const handleopenform = () => {
    setOpenForm(!openForm);
    setIsEdit(false);
    setNewUser({
      id: "",
      state: "",
      city: "",
      zipcode: "",
      estimated_delivery_days: 0,
      is_active: false,
    });
  };
  const handleOpenInfo = (id: number) => {
    setIsuserInfo(true);
    setIsinfo(id);
    console.log("info----->>", isinfo);
  };

  const activeHandler = async (store: any, is_active: boolean) => {
    const response = await pinCodeUpdatedApi(
      store?.id,
      store?.state,
      store?.city,
      is_active,
      store?.zipcode,
      store?.estimated_delivery_days,
      token
    );
    if (response?.status === 200) {
      fetchPincode();
    } else if (response?.data?.message === "Invalid or expired token ") {
      dispatch(clearUserDetails());
      toast.error("Session Expired, Please Login Again");
      router.push("/");
    }
  };
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  };
  const clearSearch = () => {
    setSearchText("");
  };

   const [selectedFileName, setSelectedFileName] = useState("");
    const [selectFiledownload ,setFileDownload]=useState('')
        const fileInputRef = useRef<HTMLInputElement>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
          const selectedFile = e.target.files?.[0]; 
          if (selectedFile) {
              setfile(selectedFile);
  
              const truncatedName = selectedFile.name.length > 20
                  ? `${selectedFile.name.slice(0, 20)}...`
                  : selectedFile.name;
              setSelectedFileName(truncatedName);
          } else {
              setfile(null);
              setSelectedFileName("");
  
          }
      };
    const handleCsvFileUpload = async () => {
      if (!isfile) {
        toast.error("Please select a file first.");
        return;
      }
      try {
        const response = await pincodeCSVUploadApi(isfile, token);
        if(response?.error){
          toast.error(response?.error)
        } else if (response?.status=== 200 && response?.data?.error_file_path){
          setfile(null);
          setSelectedFileName("");
           setFileDownload(response?.data?.error_file_path)
          toast.success("Please download the error file, resolve the error, and re-upload it.");
             if (fileInputRef.current) {
                      fileInputRef.current.value = ''; 
                  }
        } else if(response?.status=== 200 ){
          toast.success("File Upload successfully");
          fetchPincode()
          setfile(null);
          setSelectedFileName("");
          setIsCsvPopupOpen(false)
          setFileDownload('')
           if (fileInputRef.current) {
                      fileInputRef.current.value = ''; 
                  }
        }
      } catch (error) {
        console.error("Upload failed:", error);
      }
    };

  return (
    <div className='w-full flex flex-col lg:items-center justify-center'>
      <div className='flex justify-center items-center mx-auto w-full mb-4 lg:gap-8 gap-3'>
        <div className='md:w-[60%] w-[90%] relative'>
          <div className='relative'>
            <span className='absolute top-1/2 transform -translate-y-1/2 bg-admin-buttonprimary h-full w-[50px] rounded-l-lg flex justify-center items-center'>
              <GoSearch size={23} color='white' />
            </span>
            <input
              type='text'
              className='w-full p-2 pl-16 pr-10 border h-12 bg-white border-gray-500 rounded-lg focus:outline-none'
              placeholder='Search by State ,City and Zipcode'
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
        <div onClick={handleopenform}>
          {openForm ? (
            <button type='button' className='button h-12'>
              <span className='button__text'>Close</span>
              <span className='button__icon'>
                <FiMinus size={24} />
              </span>
            </button>
          ) : (
            <button type='button' className='button h-12'>
              <span className='button__text'>Add </span>
              <span className='button__icon'>
                <FiPlus size={24} />
              </span>
            </button>
          )}
        </div>
      </div>
<div className="flex justify-end w-full px-1 mb-4">
  <button
    onClick={() => setIsCsvPopupOpen(true)}
    className="bg-[#61BAB0] text-white px-6 py-2.5 rounded-lg font-semibold shadow-md hover:bg-[#88cec6] transition-all flex items-center gap-2"
  >
    <FiUpload />
    CSV Actions
  </button>
</div>
{isCsvPopupOpen && (
  <CSVActionPopup
    onClose={() => setIsCsvPopupOpen(false)}
    selectedFileName={selectedFileName}
    handleFileChange={handleFileChange}
    handleCsvFileUpload={handleCsvFileUpload}
    fileInputRef={fileInputRef}
    selectFiledownload={selectFiledownload}
  />
)}


{/* 
         <div className='flex lg:flex-row flex-col lg:justify-end justify-center gap-3 w-full px-1'>
        {selectFiledownload?  <a href={`${process.env.NEXT_PUBLIC_BASE_URL}${selectFiledownload}`} download="StoreAddress.xlsx" className='relative flex justify-center items-center text-white gap-2 h-12 px-3 bg-red-800 rounded-md cursor-pointer'>
          <button className='font-semibold text-lg'>
            Error File Download
          </button>
        </a>:
        <a href={`/Pincode.csv`}   download="Pincode.csv" className='relative flex justify-center items-center text-white gap-2 h-12 px-3 bg-[#213E5A] rounded-md cursor-pointer'>
          <button className='font-semibold text-lg'>
            Download File Format
          </button>
        </a>}
        <div className='relative flex justify-center items-center text-white gap-2 h-12 px-3 bg-[#213E5A] rounded-md cursor-pointer'>
          <p className='font-semibold text-lg px-4'>Upload CSV</p>
          <input
            type='file'
            accept='.csv,.xlsx'
            className='absolute inset-0 opacity-0 cursor-pointer'
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          {selectedFileName && (
            <p className='mt-2 text-sm text-white'>
              {selectedFileName.length > 20
                ? `${selectedFileName.slice(0, 20)}...`
                : selectedFileName}
            </p>
          )}
        </div>
        <div className='relative flex justify-center items-center text-white gap-2 h-12 px-3 bg-[#213E5A] rounded-md cursor-pointer'>
          <button
            className='font-semibold text-lg'
            onClick={handleCsvFileUpload}>
            Submit
          </button>
        </div>
      </div> */}
      {openForm && (
        <form
          onSubmit={handleCreateOrUpdate}
          className='bg-white shadow-md border-[1px] rounded-lg lg:p-6 p-4 mb-6 lg:w-[90%] w-full'
        >
          <div className='grid grid-cols-1 lg:grid-cols-2 lg:gap-4 gap-5'>
            <div className='relative w-full bg-[#F3F3F3] rounded-lg shadow-sm'>
              <div className='flex bg-[#F3F3F3] p-3 h-12 rounded-md'>
                <RiArticleFill color='#A5B7C0' size={26} />

                <input
                  type='number'
                  name='Name'
                  value={newUser.zipcode}
                  onChange={(e) =>
                    setNewUser((prev) => ({
                      ...prev,

                      zipcode: e.target.value,
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
                  Enter zipcode
                </label>
              </div>
            </div>
            <div className='relative w-full bg-[#F3F3F3] rounded-lg shadow-sm'>
              <div className='flex bg-[#F3F3F3] p-3 h-12 rounded-md'>
                <RiArticleFill color='#A5B7C0' size={26} />

                <input
                  type='text'
                  name='state'
                  value={newUser.state}
                  onChange={(e) =>
                    setNewUser((prev) => ({
                      ...prev,

                      state: e.target.value,
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
                  Enter State
                </label>
              </div>
            </div>

            <div className='relative w-full bg-[#F3F3F3] rounded-lg shadow-sm'>
              <div className='flex bg-[#F3F3F3] p-3 h-12 rounded-md'>
                <RiArticleFill color='#A5B7C0' size={26} />
                <input
                  type='text'
                  name='city'
                  value={newUser.city}
                  onChange={(e) =>
                    setNewUser((prev) => ({
                      ...prev,

                      city: e.target.value,
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
                  Enter city
                </label>
              </div>
            </div>
            <div className='relative w-full bg-[#F3F3F3] rounded-lg shadow-sm'>
              <div className='flex bg-[#F3F3F3] p-3 h-12 rounded-md'>
                <RiArticleFill color='#A5B7C0' size={26} />
                <input
                  type='number'
                  name='Name'
                  value={newUser.estimated_delivery_days}
                  onChange={(e) =>
                    setNewUser((prev) => ({
                      ...prev,

                      estimated_delivery_days: Number(e.target.value),
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
                  Estimated Delivery Days
                </label>
              </div>
            </div>
            <div className='lg:flex gap-6 h-12'>
              <div className='flex items-center gap-4 w-full lg:mt-0 mt-4'>
                <div className='flex items-center justify-between gap-2 bg-[#F3F3F3] rounded-lg h-12 w-full p-4'>
                  <label className='text-md text-[#577C8E] px-3'>
                    Is Active?
                  </label>

                  <div className='switch w-full'>
                    <label>
                      <input
                        type='checkbox'
                        checked={newUser.is_active}
                        onChange={(e) =>
                          setNewUser((prev) => ({
                            ...prev,

                            is_active: e.target.checked,
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
              className={`text-lg lg:w-[200px] mt-3 ${
                isEdit ? "bg-green-500" : "bg-admin-buttonprimary"
              } text-white px-6 lg:py-3 py-2 rounded-md`}
            >
              {isEdit ? "Update" : "Create"}
            </button>

            {isEdit ? (
              <>
                <button
                  onClick={handlecCancleEdit}
                  className='text-lg lg:w-[200px] mt-3 bg-admin-buttonprimary text-white px-6 lg:py-3 py-2 rounded-md'
                >
                  Cancel
                </button>
              </>
            ) : null}
          </div>
        </form>
      )}
      <div className='bg-white mt-6 shadow-md rounded-lg w-full flex justify-center items-center'>
        <div className='overflow-x-auto w-full'>
          <table className='w-full border-collapse'>
            <thead className='bg-admin-secondary text-admin-text-primary lg:text-lg text-sm'>
              <tr>
                <th className='p-3 text-center '>State </th>
                <th className='p-3 text-center '>City </th>
                <th className='p-3 text-center '>Zipcode </th>
                <th
                  className='py-3 px-4 flex gap-1 justify-center items-center'
                  onClick={() => setIsActiveInactiveFilterPopup(true)}
                >
                  {isfiltervalue === "" ? "Status" : isfiltervalue}{" "}
                  <FaAngleDown className='text-admin-text-primary' />
                </th>
                {/* <th className='p-3 text-center '>Sub-Heading</th> */}
                <th className='p-3 text-center'>Action</th>
                <th className='p-3 text-center'>Info</th>
              </tr>
            </thead>
            <tbody>
              {data.map((store: any, index: any) => (
                <tr key={index} className='border-b hover:bg-purple-100'>
                  <td className='p-3 capitalize text-center'>{store?.state}</td>
                  <td className='p-3 capitalize text-center'>{store?.city}</td>
                  <td className='p-3 capitalize text-center'>
                    {store?.zipcode}
                  </td>
                  <td className='p-3 text-center'>
                    <div className='text-center'>
                      <Switch
                        checked={store?.is_active}
                        onChange={() => activeHandler(store, !store?.is_active)}
                        className={`${
                          store?.is_active ? "bg-green-500" : "bg-gray-300"
                        } relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-200 ease-in-out`}
                      >
                        <span
                          className={`${
                            store?.is_active ? "translate-x-6" : "translate-x-1"
                          } inline-block w-6 h-6 bg-white rounded-full transition-transform duration-200 ease-in-out`}
                        />
                      </Switch>
                    </div>
                  </td>
                  <td className='p-3 text-center'>
                    <div className='flex justify-center items-center space-x-3'>
                      <button
                        onClick={() => handleEdit(store)}
                        className='text-orange-500'
                      >
                        <TbEdit size={28} />
                      </button>
                      <button
                        onClick={() => handleDelete(store?.id)}
                        className='text-red-500'
                      >
                        <MdDelete size={28} />
                      </button>
                    </div>
                  </td>
                  <td className='p-3 text-center '>
                    <button
                      className='text-blue-500'
                      aria-label='Info'
                      onClick={() => {
                        handleOpenInfo(store?.id);
                      }}>
                      <img
                        src='/Info.png'
                        alt='Profile'
                        className='h-6 w-6 object-cover rounded-full'
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.length === 0 && (
            <div className='text-center p-4'>No pincode available</div>
          )}
          {isOpenDeletePopup && (
            <DeletePincodeComponent
              isOpenDeletePopup={isOpenDeletePopup}
              handleDeleteConform={() => handleDeleteConform(selectedRoleId)}
              setIsLogoutDialogOpen={setIsLogoutPopup}
              setIsOpen={setIsLogoutPopup}
            />
          )}
          {isActiveInactiveFitlerPopup && (
            <ActiveInactiveFilterPopup
              isOpenActiveInactivePopup={isActiveInactiveFitlerPopup}
              setIsActiveInactiveFilterPopup={setIsActiveInactiveFilterPopup}
              handlefilter={handlefilter}
              isActiveInactiveValue={isfiltervalue}
            />
          )}
        </div>
      </div>
      <div>
        {isUserInfo && (
          <UserInfoPopupComponent
            user={data.find((user: any) => user.id === isinfo)}
            isUserInfo={isUserInfo}
            setIsuserInfo={setIsuserInfo}
            setIsOpen={setIsuserInfo}
          />
        )}
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
    </div>
  );
};

export default PinCodeFormComponent;
