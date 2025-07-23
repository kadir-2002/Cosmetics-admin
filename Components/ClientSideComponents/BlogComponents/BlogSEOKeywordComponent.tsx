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
  blogtagAllDataApi,
  blogtagDeleteApi,
  blogtagUpdatedApi,
  createBlogTagApi,
  createSeoApi,
  seoAllDataApi,
  seoDeleteApi,
  seoUpdatedApi,
} from "@/apis/blogFormApi";
import { GoSearch } from "react-icons/go";
import { AiOutlineClose } from "react-icons/ai";
import BlogSeoDeleteComponent from "./BlogSeoDeleteComponent";
interface Role {
  id: string;
  name: string;
  isActive: boolean;
}

const BlogSEOKeywordComponent = () => {
  const [categry, setCategry] = useState<Role[]>([]);
  const [newRole, setNewRole] = useState({ tagName: "" });
  const [isEdit, setIsEdit] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [isOpenDeletePopup, setIsLogoutPopup] = useState<boolean>(false);
  const [isOpenInfoPopup, setIsInfoPopup] = useState<boolean>(false);
  const createdBy = useSelector((state: any) => state?.user?.details?.id);
  const [searchText, setSearchText] = useState<string>("");
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [info, setinfo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const token = useSelector((state: any) => state?.user?.token);
  const dispatch = useDispatch();
  const router = useRouter();
  const topRef = useRef<HTMLDivElement | null>(null);

  const tagFormRef = useRef<HTMLFormElement>(null);
  const handleCreateOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { tagName } = newRole;
    if (!tagName.trim()) {
      return;
    }
    try {
      if (isEdit) {
        const response = await seoUpdatedApi(
          selectedRoleId,
          tagName,
          createdBy,
          token
        );
        if (response?.status === 200) {
          toast.success("Tag updated successfully");
          setIsEdit(false);
        } else if (
          response?.data?.error === "Tag with this name already exists"
        ) {
          toast.error("Tag already exists");
        } else if (response?.data?.message === "Invalid or expired token") {
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
        }
      } else {
        const response = await createSeoApi(tagName, createdBy, token);
        if (response?.data?.error === "Tag with this name already exists") {
          toast.error("Tag already exists");
        } else if (response?.status === 201) {
          toast.success("Tag created successfully");
        } else if (response?.data?.message === "Invalid or expired token") {
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
        }
      }
      fetchTag();
      setOpenForm(false);
      setNewRole({ tagName: "" });
    } catch (error) {
      console.error("Error creating or updating role:", error);
    }
  };

  const fetchTag = async () => {
    try {
      const response = await seoAllDataApi({
        page: currentPage,
        page_size: pageSize,
        token: token,
        searchText:searchText
      });

      if (response?.data?.keywords) {
        setCategry(response?.data?.keywords);
        setTotalPages(response?.data?.totalPages);
      } else if (response?.body?.message === "Invalid or expired token") {
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
  }, [currentPage, pageSize,searchText]);

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
  const handleDelete = async (id: string) => {
    setSelectedRoleId(id);
    setIsLogoutPopup(true);
  };

  const handleDeleteConform = async (id: string) => {
    try {
      const response = await seoDeleteApi(id, token);
      if (response?.body?.success) {
        toast.success("Tag deleted successfully");
        setIsLogoutPopup(false);
        fetchTag(); 
      } else if (response?.body?.message === "Invalid or expired token") {
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again");
        router.push("/");
      }
    } catch (error) {
      console.error("Failed to delete role:");
    }
  };

  const handleEdit = (data: { id: string; name: string }) => {
    setOpenForm(true);
    setNewRole({ tagName: data?.name });
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
    setNewRole({ tagName: "" });
  };
  const handleopenform = () => {
    const newOpenFormState = !openForm;
    setOpenForm(newOpenFormState);
    setIsEdit(false);
    setNewRole({ tagName: "" });

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
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };
  const clearSearch = () => {
    setSearchText("");
  };
  return (
    <div className='w-full flex flex-col lg:items-center' ref={topRef}>
      <div className='flex justify-center items-center mx-auto w-full mb-4 lg:gap-8 gap-3 '>
        <div className='md:w-[60%] w-[90%] relative'>
          <div className='relative'>
            <span className='absolute top-1/2 transform -translate-y-1/2 bg-admin-buttonprimary h-full w-[50px] rounded-l-lg flex justify-center items-center'>
              <GoSearch size={23} color='white' />
            </span>
            <input
              type='text'
              className='w-full p-2 pl-16 pr-10 border h-12 bg-white border-gray-500 rounded-lg focus:outline-none'
              placeholder='Search by Key Word'
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
          className='bg-white  w-full rounded-lg shadow-md lg:p-6 p-4'
        >
          <div className='grid lg:grid-cols-2 grid-cols-1 gap-6 mb-6'>
            <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm'>
              <BsFillTagFill color='#A5B7C0' size={26} />
              <input
                type='text'
                // placeholder="Enter Tag"
                value={newRole.tagName}
                required
                onChange={(e) =>
                  setNewRole((prev) => ({ ...prev, tagName: e.target.value }))
                }
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
              />
              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                Enter Key Word
              </label>
            </div>
            <div className='flex justify-center items-center gap-6'>
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
          </div>
        </form>
      )}
      <div className='bg-white w-full shadow-md mt-6  flex justify-center items-center rounded-md'>
        <div className='w-full py-4'>
          <table className='w-full bg-white  text-center text-md lg:text-xl table-fixed'>
            <thead>
              <tr className='text-[#577C8E] font-semibold border-b-[1px] border-[#577C8E]'>
                <th className='py-3 px-4 text-left w-1/3'>Key Word Name</th>
                <th className='py-3 w-1/3'>Status</th>
                <th className='py-3 w-1/3'>Info</th>
              </tr>
            </thead>
            <tbody>
              {categry?.map((data: any, index: any) => (
                <tr key={index} className='border-b-[1px] hover:bg-blue-100 '>
                  <td className='py-3 px-4 text-left'>{data?.name}</td>

                  <td className='py-3 flex justify-center gap-4'>
                    <button
                      onClick={() =>
                        handleEdit({ id: data?.id, name: data?.name })
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
          {categry.length === 0 && (
            <div className='text-center p-4'>No key word available</div>
          )}
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
        <BlogSeoDeleteComponent
          isOpenDeletePopup={isOpenDeletePopup}
          handleDeleteConform={() => handleDeleteConform(selectedRoleId)}
          setIsLogoutDialogOpen={setIsLogoutPopup}
          setIsOpen={setIsLogoutPopup}
        />
      )}
      <div className='flex justify-center mt-4 mb-11'>
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

export default BlogSEOKeywordComponent;
