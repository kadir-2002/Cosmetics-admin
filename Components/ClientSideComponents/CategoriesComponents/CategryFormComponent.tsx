"use client";
import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { MdCategory, MdDelete } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { GoSearch } from "react-icons/go";
import RoleInfoPopup from "../RoleFormComponents/RoleInfoPopup";
import {
  categoryDeleteApi,
  categryAllDataApi,
  categryUpdatedApi,
  createCategryApi,
} from "@/apis/categoriesApi";
import CategoriesDeletePopUpComponent from "./CategoriesDeletePopUpComponent";
import { Switch } from "@headlessui/react";
import { BiSolidCategory, BiSolidImageAdd } from "react-icons/bi";
import SubCategoriesComponent from "./SubCategoriesComponent";
import { clearUserDetails } from "@/redux/userSlice";
import { useRouter } from "next/navigation";
import { FaAngleDown } from "react-icons/fa6";
import ActiveInactiveFilterPopup from "../RoleFormComponents/ActiveInactiveFilterPopup";
import { FiMinus, FiPlus } from "react-icons/fi";
import { IoImage } from "react-icons/io5";
import { BsPuzzleFill } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import DescriptionReatchTextComponent from "../ProductComponents/DescriptionReatchTextComponent";

interface Role {
  id: string;
  name: string;
  title: string;
  heading: string;
  isActive: boolean;
}

const CategryFormComponent = () => {
  const [categry, setCategry] = useState<Role[]>([]);
  const [newRole, setNewRole] = useState({
    id: "",
    sequence_number: "",
    categryName: "",
    title: "",
    heading: "",
    description: "",
    image: "",
    banner: "",
    seodescription: "",
    seo_title: "",
    seo_description: "",
    seo_keyword: "",
    parent_catgory: "",
    minimum_order_quantity: "",
    isActive: false,
  });
  const [isEdit, setIsEdit] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [isOpenDeletePopup, setIsLogoutPopup] = useState<boolean>(false);
  const [isOpenInfoPopup, setIsInfoPopup] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [info, setinfo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [isopenCategry, setIsopenCategry] = useState<boolean>(false);
  const [isCategryID, setCategryID] = useState("");
  const [isActiveInactiveFitlerPopup, setIsActiveInactiveFilterPopup] =
    useState<boolean>(false);
  const [isfiltervalue, setfiltervalue] = useState<string>("");
  const [isfile, setfile] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileBannerName, setBannerName] = useState("");
  const token = useSelector((state: any) => state?.user?.token);
  const [ordering, setOrdering] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const topRef = useRef<HTMLDivElement | null>(null);
  const handleCreateOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {
      id,
      sequence_number,
      categryName,
      title,
      heading,
      description,
      image,
      banner,
      seodescription,
      seo_title,
      seo_description,
      seo_keyword,
      parent_catgory,
      minimum_order_quantity,
      isActive,
    } = newRole;
    if (!categryName.trim()) {
      return;
    }
    try {
      if (isEdit) {
        const response = await categryUpdatedApi(
          id,
          sequence_number,
          isActive,
          categryName,
          image,
          banner,
          token
        );
        if (response?.data?.success) {
          toast.success("Category updated successfully");
          setIsEdit(false);
          fetchCategory();
          setOpenForm(false);
          setFileName("");
          setBannerName("");
          setNewRole({
            id: "",
            sequence_number: "",
            categryName: "",
            title: "",
            heading: "",
            description: "",
            image: "",
            banner: "",
            seodescription: "",
            seo_title: "",
            seo_description: "",
            seo_keyword: "",
            parent_catgory: "",
            minimum_order_quantity: "",
            isActive: false,
          });
        } else if (response?.data?.message === "Invalid or expired token") {
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
        } else if (
          response?.data?.error ===
          "Product category with this sequence number already exists"
        ) {
          toast.error("Sequence Number already exists");
        } else if (
          response?.data?.error ===
          "Product category with this sequence number already exists"
        ) {
          toast.error("Sequence Number already exists");
        }
      } else {
        const response = await createCategryApi(
          sequence_number,
          categryName,
          isActive,
          image,
          banner,
          token
        );
        if (
          response?.message === "Sequence number already exists"
        ) {
          toast.error("Sequence Number already exists");
        } else if (response?.status === 201) {
          toast.success("Category created successfully");
          fetchCategory();
          setOpenForm(false);
          setFileName("");
          setBannerName("");
          setNewRole({
            id: "",
            sequence_number: "",
            categryName: "",
            title: "",
            heading: "",
            description: "",
            image: "",
            banner: "",
            seodescription: "",
            seo_title: "",
            seo_description: "",
            seo_keyword: "",
            parent_catgory: "",
            minimum_order_quantity: "",
            isActive: false,
          });
        } else if (response?.data?.message === "Invalid or expired token") {
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
        } else if (
          response?.error ===
          "Product category with this sequence number already exists"
        ) {
          toast.error("Sequence Number already exists");
        }
      }
    } catch (error) {
      console.error("Error creating or updating Categry:", error);
    }
  };
  const filtervalue =
    isfiltervalue === "Active"
      ? true
      : isfiltervalue === "Inactive"
        ? false
        : undefined;
  const fetchCategory = async () => {
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
      if (filtervalue) {
        apiParams.filtervalue = filtervalue;
      } else if (searchText) {
        apiParams.search = searchText;
      } else if (ordering) {
        apiParams.ordering = ordering;
      }
      const response = await categryAllDataApi(apiParams);
      if (response.body) {
        setCategry(response.body.categories);
        setTotalPages(response?.body.total_pages);
      } else if (response?.body.detail === "Invalid token") {
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again");
        router.push("/");
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [searchText, currentPage, pageSize, ordering, isfiltervalue]);

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
      const response = await categoryDeleteApi(id, token);
      if(response.body.success === false){
        toast.error("error to delete category")
      }
      if (response?.body.message === 'Category deleted') {
        toast.success("Category deleted successfully");
        setIsLogoutPopup(false);
        fetchCategory();
      } else if (response?.body.detail === "Invalid token") {
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again");
        router.push("/");
      }
    } catch (error) {
      console.error("Failed to delete Categry:");
    }
  };
  const handleEdit = (data: {
    id: string;
    sequence_number: string;
    title: string;
    heading: string;
    description: string;
    image: string;
    banner: string;
    seo_description: string,
    seo_title: string;
    seo_data: string,
    seo_keyword: string,
    parent_catgory: string;
    name: string;
    minimum_order_quantity: string;
    is_active: boolean;
  }) => {
    setOpenForm(true);
    setFileName(data?.image);
    setBannerName(data?.image);
    if (topRef.current) {
      topRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setNewRole({
      id: data?.id,
      sequence_number: data?.sequence_number,
      categryName: data?.name,
      description: data?.description,
      title: data?.title,
      heading: data?.heading,
      image: "",
      banner: "",
      seodescription: data?.seo_description,
      seo_title: data?.seo_title,
      seo_description: data?.seo_data,
      seo_keyword: data?.seo_keyword,
      parent_catgory: data?.parent_catgory,
      minimum_order_quantity: data?.minimum_order_quantity,
      isActive: data?.is_active,
    });
    setIsEdit(true);
    setSelectedRoleId(data.id);
  };
  const handlecCancleEdit = () => {
    setOpenForm(false);
    setIsEdit(false);
    setBannerName("");
    setFileName("");
    setNewRole({
      id: "",
      sequence_number: "",
      categryName: "",
      title: "",
      heading: "",
      description: "",
      image: "",
      banner: "",
      seodescription: "",
      seo_title: "",
      seo_description: "",
      seo_keyword: "",
      parent_catgory: "",
      minimum_order_quantity: "",
      isActive: false,
    });
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  };
  const clearSearch = () => {
    setSearchText("");
  };
  const handleopenform = () => {
    setOpenForm(!openForm);
    setIsEdit(false);
    setFileName("");
    setBannerName("");
    setNewRole({
      id: "",
      sequence_number: "",
      categryName: "",
      title: "",
      heading: "",
      description: "",
      image: "",
      banner: "",
      seodescription: "",
      seo_title: "",
      seo_description: "",
      seo_keyword: "",
      parent_catgory: "",
      minimum_order_quantity: "",
      isActive: false,
    });
  };
  const handleOpenInfo = (id: string) => {
    setIsInfoPopup(true);
    setinfo(id);
  };
  const activeHandler = async (data: any, isActive: boolean) => {
    const image = "";
    const banner = "";
    const response = await categryUpdatedApi(
      data?.id,
      data?.sequence_number,
      isActive,
      data?.name,
      image,
      banner,
      token
    );
    if (response?.status === 200) {
      fetchCategory();
    } else if (response?.data?.detail === "Invalid token") {
      dispatch(clearUserDetails());
      toast.error("Session Expired, Please Login Again");
      router.push("/");
    }
  };
  const handleAddCategry = (id: any) => {
    setIsopenCategry(true);
    setCategryID(id);
  };
  const handleOrdering = (field: string) => {
    setOrdering((prev) => (prev === field ? `-${field}` : field));
  };
  const handlefilter = (value: any) => {
    setfiltervalue(value);
    setIsActiveInactiveFilterPopup(false);
    setCurrentPage(1);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file: any = e.target.files?.[0];
    setfile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setNewRole((prev: any) => ({
            ...prev,
            image: file,
          }));
          setFileName(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file: any = e.target.files?.[0];
    // setfile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setNewRole((prev: any) => ({
            ...prev,
            banner: file,
          }));
          setBannerName(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (

    <div className='min-h-screen w-full flex flex-col lg:items-center' ref={topRef}>
      <div className='flex justify-center items-center mx-auto w-full mb-4 lg:gap-8 gap-3 '>
        <div className='md:w-[60%] w-[90%] relative'>
          <div className='relative'>
            <span className='absolute top-1/2 transform -translate-y-1/2 bg-admin-buttonprimary h-full w-[50px] rounded-l-lg flex justify-center items-center'>
              <GoSearch size={23} color='white' />
            </span>
            <input
              type='text'
              className='w-full p-2 pl-16 pr-10 border h-12 bg-white border-gray-500 rounded-lg focus:outline-none'
              placeholder='Search by Category Name'
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
      {openForm && (
        <form
          onSubmit={handleCreateOrUpdate}
          className='bg-white lg:w-[90%] border-[1px] w-full rounded-lg shadow-md lg:p-6 p-4'
        >
          <div className='grid lg:grid-cols-2 grid-cols-1 gap-6 mb-6'>
            <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm'>
              <MdCategory color='#A5B7C0' size={26} />
              <input
                type='number'
                // placeholder="Enter Category"
                value={newRole.sequence_number}
                required
                onChange={(e) =>
                  setNewRole((prev) => ({
                    ...prev,
                    sequence_number: e.target.value,
                  }))
                }
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-2 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
              />
              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                Enter Sequence Number
              </label>
            </div>
            {/* title */}
            {/* <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm'>
              <MdCategory color='#A5B7C0' size={26} />
              <input
                type='text'
                // placeholder="Enter Category"
                value={newRole.title}
                required
                onChange={(e) =>
                  setNewRole((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-2 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
              />
              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                Enter Title
              </label>
            </div>
            <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm'>
              <MdCategory color='#A5B7C0' size={26} />
              <input
                type='text'
                // placeholder="Enter Category"
                value={newRole.heading}
                onChange={(e) =>
                  setNewRole((prev) => ({
                    ...prev,
                    heading: e.target.value,
                  }))
                }
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-2 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
              />
              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                Enter Sub Heading
              </label>
            </div> */}
            <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm'>
              <MdCategory color='#A5B7C0' size={26} />
              <input
                type='text'
                // placeholder="Enter Category"
                value={newRole.categryName}
                required
                onChange={(e) =>
                  setNewRole((prev) => ({
                    ...prev,
                    categryName: e.target.value,
                  }))
                }
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-2 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
              />
              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                Enter Category
              </label>
            </div>
            {/* <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm'>
              <BiSolidCategory color='#A5B7C0' size={26} />
              <input
                type='text'
                // placeholder="Enter Description"
                value={newRole.description}
                onChange={(e) =>
                  setNewRole((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-2 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
              />
              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'>
                Enter Description
              </label>
            </div> */}
            <div className='flex bg-[#F3F3F3] p-2 relative w-full  h-12 rounded-lg shadow-sm'>
              <BsPuzzleFill color='#A5B7C0' size={26} />

            </div>
            {/* <div className='flex bg-[#F3F3F3] p-2 relative w-full  h-12 rounded-lg shadow-sm'>
              <BsPuzzleFill color='#A5B7C0' size={26} />
              <input
                type='text'
                placeholder=' Minimum Order Quantity'
                value={newRole.seo_description}
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4  py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
                onChange={(e) =>
                  setNewRole((prev) => ({
                    ...prev,
                    seo_description: e.target.value,
                  }))
                }
              />
              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                Enter SEO Description
              </label>
            </div>
            <div className='flex bg-[#F3F3F3] p-2 relative w-full  h-12 rounded-lg shadow-sm'>
              <BsPuzzleFill color='#A5B7C0' size={26} />
              <input
                type='text'
                placeholder=' Minimum Order Quantity'
                value={newRole.seo_keyword}
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4  py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
                onChange={(e) =>
                  setNewRole((prev) => ({
                    ...prev,
                    seo_keyword: e.target.value,
                  }))
                }
              />
              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                Enter SEO Keyword
              </label>
            </div>
            <div className='flex bg-[#F3F3F3] p-2 relative w-full  h-12 rounded-lg shadow-sm'>
              <BsPuzzleFill color='#A5B7C0' size={26} />
              <input
                type='number'
                placeholder=' Minimum Order Quantity'
                value={newRole.minimum_order_quantity}
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4  py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
                onChange={(e) =>
                  setNewRole((prev) => ({
                    ...prev,
                    minimum_order_quantity: e.target.value,
                  }))
                }
              />
              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                Minimum Order Quantity
              </label>
            </div> */}
            <div className='flex items-center  justify-between gap-3 bg-[#F3F3F3] rounded-lg h-12 px-4 w-full '>
              <label className='text-sm text-[#577C8E]'>Is Active?</label>
              <div className='switch'>
                <label>
                  <input
                    type='checkbox'
                    checked={newRole.isActive}
                    onChange={(e) =>
                      setNewRole((prev) => ({
                        ...prev,
                        isActive: e.target.checked,
                      }))
                    }
                  />
                  <span className='slider'></span>
                </label>
              </div>
            </div>




            <div className='rounded-md  w-full focus:outline-none focus:outline-1 placeholder-black h-12'>
              <p className='lg:py-2 mb-1'>Image</p>
              <div className='flex bg-admin-secondary justify-center items-center px-4 rounded-md'>
                <input
                  id='img'
                  name='img'
                  type='file'
                  placeholder='Upload Image'
                  // value={newUser?.profile_picture}
                  onChange={handleFileChange}
                  accept='.jpeg,.png,'
                  className='block w-full text-sm text-admin-secondary file:mr-4 file:py-1 file:h-12 file:px-4  file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-admin-secondary bg-admin-secondary file:text-white hover:file:bg-gray-700'
                />
                {fileName ? (
                  <span className='text-white px-2 w-full'>
                    {fileName.length > 10
                      ? `${fileName.slice(0, 20)}...`
                      : fileName}
                  </span>
                ) : (
                  <BiSolidImageAdd color='white' size={27} />
                )}
              </div>
            </div>
            <div className='rounded-md  w-full focus:outline-none focus:outline-1 placeholder-black h-12'>
              <p className='py-2'>Banner Image</p>
              <div className='flex bg-admin-secondary justify-center items-center px-4 rounded-md'>
                <input
                  id='img'
                  name='img'
                  type='file'
                  placeholder='Upload Image'
                  // value={newUser?.profile_picture}
                  onChange={handleBannerChange}
                  accept='.jpeg,.png,'
                  className='block w-full text-sm text-admin-secondary file:mr-4 file:py-1 file:h-12 file:px-4  file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-admin-secondary bg-admin-secondary file:text-white hover:file:bg-gray-700'
                />
                {fileBannerName ? (
                  <span className='text-white px-2 w-full'>
                    {fileBannerName.length > 10
                      ? `${fileBannerName.slice(0, 20)}...`
                      : fileBannerName}
                  </span>
                ) : (
                  <BiSolidImageAdd color='white' size={27} />
                )}
              </div>
            </div>
            <div className='lg:col-span-2 mt-12'>
              <DescriptionReatchTextComponent
                value={newRole.seodescription}
                onChange={(seodescription) =>
                  setNewRole((prev: any) => ({ ...prev, seodescription }))
                }
              />
            </div>

          </div>
          <div className='flex lg:flex-row flex-col justify-center items-center gap-6 '>
            <button
              type='submit'
              className={`text-lg lg:w-[230px] w-full ${isEdit ? "bg-green-500" : "bg-admin-buttonprimary"
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
      <div className='bg-white shadow-md rounded-lg w-full flex justify-center items-center mt-6'>
        <div className='overflow-x-auto w-full'>
          <table className='w-full'>
            <thead>
              <tr className='bg-admin-secondary text-admin-text-primary  font-semibold  text-start'>
                <th
                  className={`text-center cursor-pointer transition-colors duration-200 ${ordering === "name" || ordering === "-name"
                      ? "text-admin-text-primary"
                      : "text-admin-text-primary"
                    }`}
                  onClick={() => handleOrdering("name")}
                >
                  <div className='flex items-center justify-center space-x-0'>
                    <span className=''>Sequence Number</span>
                    {/* <span className='flex flex-col leading-none'>
                      <MdArrowDropUp
                        className={`w-7 h-7 transform -mb-1 ${
                          ordering === "name"
                            ? "text-admin-text-primary"
                            : "text-admin-text-primary"
                        }`}
                      />
                      <IoMdArrowDropdown
                        className={`w-7 h-7 transform -mt-3 ${
                          ordering === "-name"
                            ? "text-admin-text-primary"
                            : "text-admin-text-primary"
                        }`}
                      />
                    </span> */}
                  </div>
                </th>
                <th className='py-3 px-5 text-start'>Image</th>
                <th className='py-3 text-start'>Banner Image</th>
                <th
                  className={`p-3 text-center cursor-pointer transition-colors duration-200 ${ordering === "name" || ordering === "-name"
                      ? "text-admin-text-primary"
                      : "text-admin-text-primary"
                    }`}
                  onClick={() => handleOrdering("name")}
                >
                  <div className='flex items-center justify-start space-x-0'>
                    <span className=''>Category Name</span>
                    {/* <span className='flex flex-col leading-none'>
                      <MdArrowDropUp
                        className={`w-7 h-8 transform -mb-1 ${
                          ordering === "name"
                            ? "text-admin-text-primary"
                            : "text-admin-text-primary"
                        }`}
                      />
                      <IoMdArrowDropdown
                        className={`w-7 h-7 transform -mt-3 ${
                          ordering === "-name"
                            ? "text-admin-text-primary"
                            : "text-admin-text-primary"
                        }`}
                      />
                    </span> */}
                  </div>
                </th>
                <th
                  className='p-4 flex gap-1 justify-center items-center'
                  // onClick={() => setIsActiveInactiveFilterPopup(true)}
                >
                 Status
                </th>
                <th className='p-3 text-center'>Sub-Category</th>
                <th className='py-3 px-6'>Action</th>
                <th className='py-3 px-6'>Info</th>
              </tr>
            </thead>


            <tbody>
              {Array.isArray(categry) && categry?.map((data: any, index: any) => (
                <tr key={index} className='border-b-[1px] hover:bg-purple-100 '>
                  <td className='flex justify-start items-center'>
                    <div className='py-3 px-6 '>{data?.sequence_number}</div>
                  </td>
                  <td className='p-3'>
                    {data?.imageUrl ? (
                      <>
                        <img
                          src={data?.imageUrl}
                          alt='Profile'
                          className='lg:h-12 lg:w-12 h-12 w-12 object-cover rounded-full'
                        />
                      </>
                    ) : (
                      <div className='lg:h-12 lg:w-12 h-12 w-12 flex justify-center items-center'>
                        <IoImage className='w-full h-full' />
                      </div>
                    )}
                  </td>
                  <td className='p-3 '>
                    {data?.banner ? (
                      <>
                        <img
                          src={data?.banner}
                          alt='Profile'
                          className='lg:h-12 lg:w-12 h-12 w-12 object-cover rounded-full'
                        />
                      </>
                    ) : (
                      <img
                        src='/bannericon.png'
                        alt='Profile'
                        className='lg:h-12 lg:w-12 h-12 w-12 object-contain'
                      />
                    )}
                  </td>
                  <td className='flex justify-start items-center'>
                    <div className='py-3 px-6 '>{data?.name}</div>
                  </td>
                  <td className='py-3 px-6 text-center'>
                    <div className=''>
                      <Switch
                        checked={!data?.isDeleted}
                        onChange={() => activeHandler(data, !data?.isDeleted)}
                        className={`${!data?.isDeleted ? "bg-green-500" : "bg-gray-300"
                          } relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-200 ease-in-out`}
                      >
                        <span
                          className={`${!data?.isDeleted ? "translate-x-6" : "translate-x-1"
                            } inline-block w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out`}
                        />
                      </Switch>
                    </div>
                  </td>

                  <td className='py-3 px-6'>
                    <div
                      className='flex justify-center items-center'
                      onClick={() => handleAddCategry(data?.id)}
                    >
                      <img
                        src='/addressicon.png'
                        alt='Profile'
                        className='h-7 w-7 object-cover'
                      />
                    </div>
                  </td>

                  <td className='py-3 px-6 text-center '>
                    <div className='flex justify-center gap-4'>
                      <button
                        onClick={() =>
                          handleEdit({
                            id: data?.id,
                            sequence_number: data?.sequence_number,
                            name: data?.name,
                            title: data?.title,
                            heading: data?.heading,
                            description: data?.description,
                            image: data?.image,
                            banner: data?.banner,
                            seo_description: data?.seo_description,
                            seo_title: data?.seo_title,
                            seo_data: data?.seo_data,
                            seo_keyword: data?.seo_keyword,
                            parent_catgory: data?.parent_category,
                            minimum_order_quantity:
                              data?.minimum_order_quantity,
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
                    </div>
                  </td>
                  <td className='py-3 px-6 text-center '>
                    <button
                      className='mt-1'
                      aria-label='Info'
                      onClick={() => handleOpenInfo(data?.id)}
                    >
                      <img
                        src='/Info.png'
                        alt='Profile'
                        className='h-6 w-6 object-cover'
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {categry.length === 0 && (
            <div className='text-center p-4'>No Category available</div>
          )}
        </div>
      </div>
      {isopenCategry && (
        <SubCategoriesComponent
          user={isCategryID}
          // user={user.find((id:any) => user.id === isaddresid)}
          isopenaddres={isopenCategry}
          setIsopenAddre={setIsopenCategry}
        />
      )}
      {isOpenInfoPopup && (
        <RoleInfoPopup
          role={categry.find((data) => data.id === info)}
          isOpenInfoPopup={isOpenInfoPopup}
          setIsInfoPopup={setIsInfoPopup}
          setIsOpen={setIsInfoPopup}
        />
      )}
      {isOpenDeletePopup && (
        <CategoriesDeletePopUpComponent
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

export default CategryFormComponent;
