"use client";
import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import { useSelector } from "react-redux";
import RoleInfoPopup from "../RoleFormComponents/RoleInfoPopup";
import { BsFillTagFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { clearUserDetails } from "@/redux/userSlice";
import { FiPlus, FiMinus } from "react-icons/fi";
import TagDeleteComponent from "../TagComponents/TagDeleteComponent";
import {
  CounterAllDataApi,
  counterDeleteApi,
  counterUpdatedApi,
  createCounterApi,
} from "@/apis/counter";
import { Switch } from "@headlessui/react";
import ActiveInactiveFilterPopup from "../RoleFormComponents/ActiveInactiveFilterPopup";
import { FaAngleDown } from "react-icons/fa6";
import DeleteCounterComponent from "./DeleteCounterComponent";
interface Role {
  id: string;
  name: string;
  isActive: boolean;
}

const CounterComponent = () => {
  const [categry, setCategry] = useState<Role[]>([]);
  const [newRole, setNewRole] = useState({
    name: "",
    value: "",
    is_active: false,
  });
  const [isEdit, setIsEdit] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [isOpenDeletePopup, setIsLogoutPopup] = useState<boolean>(false);
  const [isOpenInfoPopup, setIsInfoPopup] = useState<boolean>(false);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [info, setinfo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [isActiveInactiveFitlerPopup, setIsActiveInactiveFilterPopup] =
    useState<boolean>(false);
  const [isfiltervalue, setfiltervalue] = useState<string>("");
  const token = useSelector((state: any) => state?.user?.token);
  const dispatch = useDispatch();
  const router = useRouter();
  const topRef = useRef<HTMLDivElement | null>(null);

  const tagFormRef = useRef<HTMLFormElement>(null);
  const handleCreateOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, value, is_active } = newRole;
    if (!name.trim() && !value.trim()) {
      return;
    }
    try {
      if (isEdit) {
        const response = await counterUpdatedApi(
          selectedRoleId,
          name,
          value,
          is_active,
          token
        );
        if (response?.status === 200) {
          toast.success("Counter updated successfully");
          setIsEdit(false);
        } else if (response?.data?.message === "Invalid or expired token ") {
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
        }
      } else {
        const response = await createCounterApi(name, value, is_active, token);
        if (response?.status === 201) {
          toast.success("Counter created successfully");
        } else if (response?.data?.message === "Invalid or expired token") {
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
        }
      }
      fetchTag();
      setOpenForm(false);
      setNewRole({ name: "", value: "", is_active: false });
    } catch (error) {
      console.error("Error creating or updating role:", error);
    }
  };

  const filtervalue =
    isfiltervalue === "Active"
      ? true
      : isfiltervalue === "Inactive"
      ? false
      : undefined;
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const fetchTag = async () => {
    try {
      const apiParams: {
        current_page: number;
        page_size: number;
        token: string;
        filtervalue?: boolean;
      } = {
        current_page: currentPage,
        page_size: pageSize,
        token: token,
        filtervalue,
      };
      if (filtervalue) {
        apiParams.filtervalue = filtervalue;
      }
      const response = await CounterAllDataApi(apiParams);
      if (response?.results) {
        setCategry(response?.results);
        setTotalPages(response?.total_pages);
      } else if (response?.message === "Invalid or expired token") {
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again");
        router.push("/");
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    fetchTag();
  }, [currentPage, pageSize, isfiltervalue]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleDelete = async (id: string) => {
    setSelectedRoleId(id);
    setIsLogoutPopup(true);
  };

  const handleDeleteConform = async (id: string) => {
    try {
      const response = await counterDeleteApi(id, token);
      if (response?.body.success) {
        toast.success("Tag deleted successfully");
        setIsLogoutPopup(false);
        fetchTag();
      } else if (response?.body.message === "Invalid or expired token") {
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again");
        router.push("/");
      }
    } catch (error) {
      console.error("Failed to delete role:");
    }
  };

  const handleEdit = (data: {
    id: string;
    name: string;
    value: string;
    is_active: boolean;
  }) => {
    setOpenForm(true);
    setNewRole({
      name: data?.name,
      value: data?.value,
      is_active: data?.is_active,
    });
    setIsEdit(true);
    setSelectedRoleId(data.id);

    if (tagFormRef.current) {
      tagFormRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
  const handlecCancleEdit = () => {
    setOpenForm(false);
    setIsEdit(false);
    setNewRole({ name: "", value: "", is_active: false });
  };
  const handleopenform = () => {
    const newOpenFormState = !openForm;
    setOpenForm(newOpenFormState);
    setIsEdit(false);
    setNewRole({ name: "", value: "", is_active: false });

    if (newOpenFormState && tagFormRef.current) {
      tagFormRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
  const handleOpenInfo = (id: string) => {
    setIsInfoPopup(true);
    setinfo(id);
  };

  const activeHandler = async (data: any, is_active: boolean) => {
    const response = await counterUpdatedApi(
      data?.id,
      data?.title,
      data?.number,
      is_active,
      token
    );
    if (response?.status === 200) {
      fetchTag();
    } else if (response?.data?.message === "Invalid or expired token") {
      dispatch(clearUserDetails());
      toast.error("Session Expired, Please Login Again");
      router.push("/");
    }
  };
  const handlefilter = (value: any) => {
    setfiltervalue(value);
    setIsActiveInactiveFilterPopup(false);
    setCurrentPage(1);
  };
  return (
    <div
      className='min-h-screen w-full flex flex-col lg:items-center'
      ref={topRef}
    >
      <div className='flex justify-center items-center mx-auto w-full mb-4 lg:gap-8 gap-3 '>
        <div className='md:w-[60%] w-[90%] relative'></div>
        <div onClick={handleopenform}>
          {openForm ? (
            <button type='button' className='button h-12'>
              <span className='button__text'>Close</span>
              <span className='button__icon'>
                {" "}
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
      {openForm && (
        <form
          ref={tagFormRef}
          onSubmit={handleCreateOrUpdate}
          className='bg-white border-[1px] w-full rounded-lg shadow-md lg:p-6 p-4'
        >
          <div className='grid lg:grid-cols-2 grid-cols-1 gap-6 mb-6 '>
            <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm'>
              <BsFillTagFill color='#A5B7C0' size={26} />
              <input
                type='text'
                // placeholder="Enter Tag"
                value={newRole.name}
                required
                onChange={(e) =>
                  setNewRole((prev) => ({ ...prev, name: e.target.value }))
                }
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
              />
              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                Enter Heading
              </label>
            </div>
            <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm'>
              <BsFillTagFill color='#A5B7C0' size={26} />
              <input
                type='number'
                // placeholder="Enter Tag"
                value={newRole.value}
                required
                onChange={(e) =>
                  setNewRole((prev) => ({ ...prev, value: e.target.value }))
                }
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
              />
              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                Enter Value
              </label>
            </div>
            <div className='lg:flex gap-6 h-12'>
              <div className='flex items-center gap-4 w-full lg:mt-0'>
                <div className='flex  items-center justify-between gap-2 bg-[#F3F3F3] rounded-lg h-12 w-full p-4'>
                  <label className='text-md text-[#577C8E] px-3'>
                    Is Active?
                  </label>
                  <div className='switch w-full'>
                    <label>
                      <input
                        type='checkbox'
                        checked={newRole.is_active}
                        onChange={(e) =>
                          setNewRole((prev) => ({
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
          <div className='flex justify-center items-center gap-6 col-span-2'>
              <button
                type='submit'
                className={`text-lg lg:w-[230px] w-full ${
                  isEdit ? "bg-green-500" : "bg-admin-buttonprimary"
                } text-white px-6 py-3 rounded-md`}
              >
                {isEdit ? "Update" : "Create"}
              </button>
              {isEdit && (
                <button
                  type='button'
                  onClick={handlecCancleEdit}
                  className='text-lg lg:w-[230px] w-full bg-admin-buttonprimary text-white px-6 py-3 rounded-md'
                >
                  Cancel
                </button>
              )}
            </div>
        </form>
      )}
      <div className='bg-white w-full shadow-md mt-6  flex justify-center items-center rounded-md'>
        <div className='overflow-x-auto w-full'>
          <table className='w-full bg-white  text-center text-md lg:text-xl'>
            <thead >
              <tr className='bg-admin-secondary text-admin-text-primary font-semibold'>
                <th className='py-3 px-4 text-left w-1/3'>Name</th>
                <th className='py-3 px-4 text-left w-1/3'>Value</th>
                <th
                  className='flex gap-1'
                  onClick={() => setIsActiveInactiveFilterPopup(true)}
                >
                 <div className="flex justify-center mt-2 items-center">
                 <p>{isfiltervalue === "" ? "Status" : isfiltervalue}</p>
                 <FaAngleDown className='text-admin-text-primary' />
                 </div>
                </th>
                <th className='py-3'>Action</th>
                <th className='py-3'>Info</th>
              </tr>
            </thead>
            <tbody>
              {categry?.map((data: any, index: any) => (
                <tr key={index} className='border-b-[1px] hover:bg-purple-100'>

                  <td className='py-3 px-4 text-left'>{data?.title}</td>
                  <td className='py-3 px-4 text-left'>{data?.number}</td>

                  <td className='p-3 text-start'> 
                    <div className='py-3'>
                      <Switch
                        checked={data?.is_active}
                        onChange={() => activeHandler(data, !data?.is_active)}
                        className={`${
                          data?.is_active ? "bg-green-500" : "bg-gray-300"
                        } relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-200 ease-in-out`}
                      >
                        <span
                          className={`${
                            data?.is_active ? "translate-x-6" : "translate-x-1"
                          } inline-block w-6 h-6 bg-white rounded-full transition-transform duration-200 ease-in-out`}
                        />
                      </Switch>
                    </div>
                  </td> 

                  <td className='py-3 flex justify-center items-center mt-3 gap-2'>
                    <button
                      onClick={() =>
                        handleEdit({
                          id: data?.id,
                          name: data?.title,
                          value: data?.number,
                          is_active: data?.is_active,
                        })
                      }
                      className='text-orange-500'
                    >
                      <TbEdit size={26} />
                    </button>
                    <button
                      onClick={() => handleDelete(data?.id)}
                      className='text-red-500'
                    >
                      <MdDelete size={26} />
                    </button>
                  </td>
                  <td className='py-3 '>
                    <button
                      className='text-blue-500'
                      aria-label='Info'
                      onClick={() => handleOpenInfo(data?.id)}
                    >
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
        </div>
      </div>
      {isOpenInfoPopup && (
        <RoleInfoPopup
          role={categry.find((data) => data.id === info)}
          isOpenInfoPopup={isOpenInfoPopup}
          setIsInfoPopup={setIsInfoPopup}
          setIsOpen={setIsInfoPopup}
        />
      )}
      {isOpenDeletePopup && (
        <DeleteCounterComponent
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
  );
};

export default CounterComponent;
