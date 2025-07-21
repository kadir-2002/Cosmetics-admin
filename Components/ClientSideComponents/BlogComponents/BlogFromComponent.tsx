"use client";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { TbEdit } from "react-icons/tb";
import { MdArrowDropUp, MdDelete } from "react-icons/md";
import { GoSearch } from "react-icons/go";
import { AiOutlineClose } from "react-icons/ai";
import { RiArticleFill } from "react-icons/ri";
import { IoMdArrowDropdown } from "react-icons/io";
import {
  FaAngleDown,
  FaCalendarDays,
  FaCircleArrowRight,
  FaCircleUser,
} from "react-icons/fa6";
import { BiSolidImageAdd } from "react-icons/bi";
import { Switch } from "@headlessui/react";
import "react-phone-number-input/style.css";
import "react-datepicker/dist/react-datepicker.css";
import {
  blogAllDataApi,
  blogcommentAllDataApi,
  blogDeleteApi,
  blogtagAllDataApi,
  blogtagfetchdata,
  blogUpdatedApi,
  createBlogApi,
  seoAllDataApi,
  seofetchdata,
} from "@/apis/blogFormApi";
import UserInfoPopupComponent from "../UserComponents/UserInfoPopupComponent";
import BlogDeleteComponent from "./BlogDeleteComponent";
import { useRouter } from "next/navigation";
import { clearUserDetails } from "@/redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import ActiveInactiveFilterPopup from "../RoleFormComponents/ActiveInactiveFilterPopup";
import { catagoryDataApi } from "@/apis/productApi";
import DatePicker from "react-datepicker";

type blogs = {
  id: number;
  title: string;
  content: string;
  image: string;
  image_alternate_text: string;
  seo_title: string;
  seo_metadata: string;
  product_category: string;
  author: string;
  tagjoints: number[];
  seofocuskeywordjoints: [];
  is_active: false;
  redirect_url: string;
  last_login: string;
  date_joined: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
};

interface UserType {
  id: string;
  title: string;
  content: string;
  image: string;
  product_tag_id: string;
  author: string;
  publish_date: string;
  image_alternate_text: string;
  seo_title: string;
  seo_metadata: string;
  tagjoints: any;
  seofocuskeywordjoints: any;
  is_active: boolean;
}

import dynamic from "next/dynamic";
import BlogCommentCOmponent from "./BlogCommentCOmponent";
import BlogInfoComponent from "./BlogInfoComponent";
import { apiCoreNode } from "@/APISFolder/APICoreNode";
import { formatIST } from "../OrderComponents/OrderInfoComponent";
const RichTextEditor = dynamic(
  () =>
    import(
      "@/Components/ServerSideComponents/EditorComponents/BlogTextEditorComponent"
    ),
  { ssr: false }
);

const BlogFormComponent = () => {
  const [blog, setBlog] = useState<blogs[]>([]);
  const [newUser, setNewUser] = useState<UserType>({
    id: "",
    title: "",
    content: "",
    image: "",
    product_tag_id: "",
    author: "",
    publish_date: "",
    image_alternate_text: "",
    seo_title: "",
    seo_metadata: "",
    tagjoints: [],
    seofocuskeywordjoints: [],
    is_active: false,
  });
  const [isOpenDeletePopup, setIsLogoutPopup] = useState<boolean>(false);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [searchText, setSearchText] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [isUserInfo, setIsuserInfo] = useState<boolean>(false);
  const [isfile, setfile] = useState("");
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [isinfo, setIsinfo] = useState<number>();
  const [fileName, setFileName] = useState("");
  const [ordering, setOrdering] = useState("");
  const [numbering, setnumbering] = useState("");
  const [categories, setCategories] = useState<any>("");
  const [isActiveInactiveFitlerPopup, setIsActiveInactiveFilterPopup] =
    useState<boolean>(false);
  const [isActiveInactiveValue, setActiveInactivevalue] = useState<string>("");
  const created_by = useSelector((state: any) => state?.user?.details?.id);
  const token = useSelector((state: any) => state?.user?.token);
  const dispatch = useDispatch();
  const router = useRouter();
  const topRef = useRef<HTMLDivElement | null>(null);
  const [isTagData, setTagData] = useState([]);
  const [isSeoData, setSeoData] = useState([]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    setSearchText(e.target.value);
  };

  const clearSearch = () => {
    setSearchText("");
  };

  const handleCreateOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {
      id,
      title,
      content,
      image,
      product_tag_id,
      author,
      publish_date,
      image_alternate_text,
      seo_title,
      seo_metadata,
      tagjoints,
      seofocuskeywordjoints,
      is_active,
    } = newUser;
    try {
      if (isEdit) {
        const response = await blogUpdatedApi(
          id,
          title,
          content,
          image,
          product_tag_id,
          author,
          publish_date,
          image_alternate_text,
          seo_title,
          seo_metadata,
          tagjoints,
          seofocuskeywordjoints,
          is_active,
          created_by,
          token
        );
        if (response?.status === 401) {
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
          return;
        }
        if (response?.status === 200) {
          toast.success("Blog updated successfully");
          setIsEdit(false);
          fetchBlog();
          setOpenForm(false);
          setFileName("");
          setfile("");
          setNewUser({
            id: "",
            title: "",
            content: "",
            image: "",
            product_tag_id: "",
            author: "",
            publish_date: "",
            image_alternate_text: "",
            seo_title: "",
            seo_metadata: "",
            tagjoints: [],
            seofocuskeywordjoints: [],
            is_active: false,
          });
        }
      } else {
        const response = await createBlogApi(
          title,
          content,
          image,
          product_tag_id,
          author,
          publish_date,
          image_alternate_text,
          seo_title,
          seo_metadata,
          tagjoints,
          seofocuskeywordjoints,
          is_active,
          created_by,
          token
        );

        if (response?.status === 401) {
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
          return;
        }
        if (response?.error === "This sequence number already exists") {
          toast.error("sequence number already exists");
        } else if (response?.status === 201) {
          toast.success("Blog created successfully!");
          fetchBlog();
          setOpenForm(false);
          setFileName("");
          setfile("");
          setNewUser({
            id: "",
            title: "",
            content: "",
            image: "",
            product_tag_id: "",
            author: "",
            publish_date: "",
            image_alternate_text: "",
            seo_title: "",
            seo_metadata: "",
            tagjoints: [],
            seofocuskeywordjoints: [],
            is_active: false,
          });
        }
      }
    } catch (error) {
      toast.success("Network error");
    }
  };

  const handleEdit = (blogs: {
    id: string;
    title: string;
    content: string;
    image: string;
    product_tag_id: string;
    author: string;
    publish_date: string;
    image_alternate_text: string;
    seo_title: string;
    seo_metadata: string;
    tagjoints: [];
    seofocuskeywordjoints: [];
    is_active: boolean;
    created_by: string;
  }) => {
    setOpenForm(true);
    setFileName(blogs?.image);
    const formattedTagList =
      blogs?.tagjoints
        ?.filter((tag: any) => tag?.frontend_blogtag?.id)
        .map((tag: any) => Number(tag?.frontend_blogtag?.id)) || [];
    const formattedSeoList =
      blogs?.seofocuskeywordjoints
        ?.filter((seo: any) => seo?.seo_focus_keyword?.id)
        .map((seo: any) => Number(seo?.seo_focus_keyword.id)) || [];

    if (topRef.current) {
      topRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setNewUser({
      id: blogs?.id,
      title: blogs?.title,
      content: blogs?.content,
      image: isfile,
      product_tag_id: blogs?.product_tag_id,
      author: blogs?.author,
      publish_date: blogs?.publish_date,
      image_alternate_text: blogs?.image_alternate_text,
      seo_title: blogs?.seo_title,
      seo_metadata: blogs?.seo_metadata,
      tagjoints: formattedTagList,
      seofocuskeywordjoints: formattedSeoList,
      is_active: blogs?.is_active,
    });
    if (topRef.current) {
      topRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setIsEdit(true);
  };

  const isActiveInactive =
    isActiveInactiveValue === "Active"
      ? true
      : isActiveInactiveValue === "Inactive"
      ? false
      : undefined;
  const fetchBlog = async () => {
    try {
      const apiParams: {
        current_page: number;
        page_size: number;
        token: any;
        ordering: string;
        numbering: string;
        search?: string;
        isActiveInactive?: boolean;
      } = {
        current_page: currentPage,
        page_size: pageSize,
        token,
        ordering,
        numbering,
        isActiveInactive,
      };
      if (searchText) {
        apiParams.search = searchText;
      }
      const response = await blogAllDataApi(apiParams);
      if (response?.body?.message === "Invalid or expired token") {
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again");
        router.push("/");
        return;
      }
      if (response?.data) {
        setBlog(response?.data);
        setTotalPages(response?.page_size);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const handleOrdering = (field: string) => {
    setOrdering((prev) => (prev === field ? `-${field}` : field));
    setnumbering((prev) => (prev === field ? `-${field}` : field));
  };

  useEffect(() => {
    fetchBlog();
  }, [searchText, currentPage, ordering, isActiveInactiveValue]);

  const handleDelete = async (id: string) => {
    setSelectedRoleId(id);
    setIsLogoutPopup(true);
  };
  const handleDeleteConform = async (id: string) => {
    try {
      const response = await blogDeleteApi(id, token);
      if (response?.body?.message === "Invalid or expired token") {
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again");
        router.push("/");
        return;
      }
      if (response?.body?.success) {
        toast.success("Blog deleted successfully");
        setIsLogoutPopup(false);
        fetchBlog();
      } else {
        console.error("Unexpected response format:", response);
      }
    } catch (error) {
      console.error("Failed to delete role:");
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file: any = e.target.files?.[0];
    setfile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setNewUser((prev) => ({
            ...prev,
            image: file,
          }));
          setFileName(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const handlecCancleEdit = () => {
    setIsEdit(false);
    setOpenForm(false);
    setNewUser({
      id: "",
      title: "",
      content: "",
      image: "",
      product_tag_id: "",
      author: "",
      publish_date: "",
      image_alternate_text: "",
      seo_title: "",
      seo_metadata: "",
      tagjoints: [],
      seofocuskeywordjoints: [],
      is_active: false,
    });
  };
  const handleopenform = () => {
    setOpenForm(!openForm);
    setIsEdit(false);
    setFileName("");
    setNewUser({
      id: "",
      title: "",
      content: "",
      image: "",
      product_tag_id: "",
      author: "",
      publish_date: "",
      image_alternate_text: "",
      seo_title: "",
      seo_metadata: "",
      tagjoints: [],
      seofocuskeywordjoints: [],
      is_active: false,
    });
  };
  const handleOpenInfo = (id: number) => {
    setIsuserInfo(true);
    setIsinfo(id);
  };
  const activeHandler = async (blogs: any, is_active: boolean) => {
    const image = isfile;
    const tagListIds = blogs?.tagjoints?.map((tag: any) => tag.id);
    const seoListIds = blogs?.seofocuskeywordjoints?.map((seo: any) => seo.id);
    const response = await apiCoreNode(`/blog/toggle/${blogs.id}`,{"is_active": is_active},'PATCH',token)
    if (response?.status === 200) {
      fetchBlog();
    } else {
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
  const handleActiveInactivefilter = (value: any) => {
    setActiveInactivevalue(value);
    setCurrentPage(1);
    setIsActiveInactiveFilterPopup(false);
  };
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    setNewUser((prev: any) => ({
      ...prev,
      product_tag_id: categoryId,
    }));
  };

  const fetchtagdata = async () => {
    try {
      const [seoResponse, tagResponse] = await Promise.all([
        await apiCoreNode(`/blog/keyword/`,{},"GET",token),
        await apiCoreNode(`/blog/tag/`,{},"GET",token),
      ]);
      if (tagResponse?.body?.data && seoResponse?.body?.data) {
        setSeoData(seoResponse?.body?.data?.keywords);
        setTagData(tagResponse?.body?.data?.tags);
      } else if (
        seoResponse?.body?.message === "Invalid or expired token" &&
        tagResponse?.body?.message === "Invalid or expired token"
      ) {
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again");
        router.push("/");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiCoreNode(`/product-tag?is_active=true`, {}, "GET", token);
        console.log(response,"tags in blog ")
        if (response?.body?.results) {
          setCategories(response?.body?.results);
          console.log('testinggggg',response?.body?.results)
        } else if (response?.body?.message === "Invalid or expired token") {
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    fetchtagdata();
  }, []);
  const [isParentProductId, setParentProductId] = useState("");
  const [isReviews, setReviews] = useState<[]>([]);
  const [isopenReview, setopenReview] = useState<boolean>(false);
  const handleOpenReview = async (id: string) => {
    setopenReview(true);
    setParentProductId(id);
    fetchReview(id);
  };

  const fetchReview = async (productId: string) => {
    try {
      const response = await blogcommentAllDataApi({
        product: productId,
        current_page: 1,
        page_size: 20,
        token: token,
      });
      setReviews(response?.blog_comments);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  };

  return (
    <div
      className='w-full flex flex-col lg:items-center justify-center'
      ref={topRef}
    >
      <div className='flex justify-center items-center mx-auto w-full mb-4 lg:gap-8 gap-3'>
        <div className='md:w-[60%] w-[90%] relative'>
          <div className='relative'>
            <span className='absolute top-1/2 transform -translate-y-1/2 bg-admin-buttonprimary h-full w-[50px] rounded-l-lg flex justify-center items-center'>
              <GoSearch size={23} color='white' />
            </span>
            <input
              type='text'
              className='w-full p-2 pl-16 pr-10 border h-12 bg-white border-gray-500 rounded-lg focus:outline-none'
              placeholder='Search by Blog Name'
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
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  fill='none'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <line x1='5' y1='12' x2='19' y2='12'></line>
                </svg>
              </span>
            </button>
          ) : (
            <button type='button' className='button h-12'>
              <span className='button__text'>Add</span>
              <span className='button__icon'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  fill='none'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <line x1='12' y1='5' x2='12' y2='19'></line>
                  <line x1='5' y1='12' x2='19' y2='12'></line>
                </svg>
              </span>
            </button>
          )}
        </div>
      </div>
      {openForm && (
        <form
          onSubmit={handleCreateOrUpdate}
          className='bg-white shadow-md border-[1px] rounded-lg lg:py-6 p-4 mb-6 lg:w-[90%] w-full'
        >
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
            <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm'>
              <RiArticleFill color='#A5B7C0' size={26} />
              <input
                type='text'
                name='title'
                value={newUser.title}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, title: e.target.value }))
                }
                // placeholder="Enter Title"
                required
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
              />
              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                Enter Title
              </label>
            </div>
            <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm'>
              <RiArticleFill color='#A5B7C0' size={26} />
              <input
                type='text'
                name='title'
                value={newUser.author}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, author: e.target.value }))
                }
                // placeholder="Enter Title"
                required
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
              />
              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                Enter Author Name
              </label>
            </div>
            <div className='lg:col-span-2'>
              <RichTextEditor
                value={newUser.content}
                onChange={(content) =>
                  setNewUser((prev) => ({ ...prev, content }))
                }
              />
            </div>

            <div className='bg-[#F3F3F3] relative flex p-3 h-12 rounded-md w-full'>
              <FaCalendarDays color='#A5B7C0' size={26} />
              <DatePicker
                selected={
                  newUser.publish_date ? new Date(newUser.publish_date) : null
                }
                onChange={(date) => {
                  if (date) {
                    const formattedDate = date.toISOString().split("T")[0];
                    setNewUser((prev: any) => ({
                      ...prev,
                      publish_date: formattedDate,
                    }));
                  } else {
                    setNewUser((prev: any) => ({
                      ...prev,
                      publish_date: null,
                    }));
                  }
                }}
                showTimeSelect={false}
                dateFormat='yyyy-MM-dd'
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
              />
              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                Select Date
              </label>
            </div>

            {categories ? (
              <div className='bg-admin-secondary px-2 rounded-md'>
                <select
                  name='Category'
                  className='p-3 rounded-md bg-admin-secondary w-full text-white font-semibold text-lg h-12 focus:outline-none overflow-y-auto'
                  value={newUser.product_tag_id}
                  onChange={handleCategoryChange}
                >
                  required
                  <option value=''>Select Product Tag</option>
                  {categories.map((category: any) => (
                    <option
                      key={category.id}
                      value={category.id}
                      className='bg-white text-black'
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            <div className='lg:flex gap-3 w-full'>
              <div className='border-primary/30 border-[1px] bg-gray-50 rounded-md  w-full focus:outline-none focus:outline-1 placeholder-black h-12'>
                <div className='flex bg-admin-secondary justify-center items-center px-4 rounded-md'>
                  <input
                    id='img'
                    name='img'
                    type='file'
                    placeholder='Upload Image'
                    // value={newUser?.profile_picture}
                    onChange={handleFileChange}
                    accept='.jpeg,.png,'
                    {...(isEdit ? {} : { required: true })}
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
            </div>
            <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm'>
              <RiArticleFill color='#A5B7C0' size={26} />
              <input
                type='text'
                name='title'
                value={newUser.image_alternate_text}
                onChange={(e) =>
                  setNewUser((prev) => ({
                    ...prev,
                    image_alternate_text: e.target.value,
                  }))
                }
                // placeholder="Enter Title"
                required
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
              />
              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                Enter Image Alternate Text
              </label>
            </div>

            <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm'>
              <RiArticleFill color='#A5B7C0' size={26} />
              <input
                type='text'
                name='title'
                value={newUser.seo_title}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, seo_title: e.target.value }))
                }
                // placeholder="Enter Title"
                required
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
              />
              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                Enter Seo Title
              </label>
            </div>
            <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm'>
              <RiArticleFill color='#A5B7C0' size={26} />
              <input
                type='text'
                name='title'
                value={newUser.seo_metadata}
                onChange={(e) =>
                  setNewUser((prev) => ({
                    ...prev,
                    seo_metadata: e.target.value,
                  }))
                }
                // placeholder="Enter Title"
                required
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
              />
              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                Enter Seo Metadata
              </label>
            </div>
            <div className='lg:flex gap-6 h-12'>
              <div className='flex items-center gap-4 w-full lg:mt-0 mt-4'>
                <div className='flex  items-center justify-between gap-2 bg-[#F3F3F3] rounded-lg h-12 w-full p-4'>
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

            <div className='-mt-2 lg:col-span-2'>
              <p className='p-2'>Tag</p>
              <div className='flex flex-wrap gap-2 p-2 bg-[#F3F3F3] rounded-md border border-gray-300 h-20 overflow-auto  cursor-pointer'>
               {isTagData?.map((data: any) => {
                  const isSelected = (newUser.tagjoints).includes(
                    data.id
                  );
                  return (
                    <div
                      key={data.id}
                      onClick={() => {
                        const updatedTags = isSelected
                          ? newUser.tagjoints.filter(
                              (tagId: number) => tagId !== data.id
                            )
                          : [...newUser.tagjoints, data.id];
                        setNewUser((prev: any) => ({
                          ...prev,
                          tagjoints: updatedTags,
                        }));
                      }}
                      className={`px-4 py-2 rounded-md cursor-pointer h-12 flex items-center justify-center  ${
                        isSelected
                          ? "bg-admin-buttonprimary text-white"
                          : "bg-gray-200 text-black"
                      } transition-all duration-300`}>
                      {data.name}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className='-mt-2 lg:col-span-2'>
              <p className='p-2'>Seo Key Word</p>
              <div className='flex flex-wrap gap-2 p-2 bg-[#F3F3F3] rounded-md border border-gray-300 h-20 overflow-auto  cursor-pointer'>
                {isSeoData?.map((data: any) => {
                  const isSelected = (newUser.seofocuskeywordjoints).includes(
                    data.id
                  );
                  return (
                    <div
                      key={data.id}
                      onClick={() => {
                        const updatedTags = isSelected
                          ? newUser.seofocuskeywordjoints.filter(
                              (tagId: number) => tagId !== data.id
                            )
                          : [...newUser.seofocuskeywordjoints, data.id];
                        setNewUser((prev: any) => ({
                          ...prev,
                          seofocuskeywordjoints: updatedTags,
                        }));
                      }}
                      className={`px-4 py-2 rounded-md cursor-pointer h-12 flex items-center justify-center  ${
                        isSelected
                          ? "bg-admin-buttonprimary text-white"
                          : "bg-gray-200 text-black"
                      } transition-all duration-300`}>
                      {data.name}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className='lg:mt-12 mt-12 flex gap-3 justify-center items-center'>
            <button
              type='submit'
              className={`text-lg lg:w-[200px] mt-3  ${
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
                <th className='p-3 text-left '>Blog Image</th>
                <th
                  className={`p-3 text-start cursor-pointer transition-colors duration-200 ${
                    ordering === "title" || ordering === "-title"
                      ? "text-admin-text-primary"
                      : "text-admin-text-primary"
                  }`}
                  onClick={() => handleOrdering("title")}
                >
                  <div className='flex items-center justify-start space-x-0'>
                    <span className=''>Name</span>
                    <span className='flex flex-col leading-none'>
                      <MdArrowDropUp
                        className={`w-7 h-8 transform -mb-1 ${
                          ordering === "title"
                            ? "text-admin-text-primary"
                            : "text-admin-text-primary"
                        }`}
                      />
                      <IoMdArrowDropdown
                        className={`w-7 h-7 transform -mt-3 ${
                          ordering === "-title"
                            ? "text-admin-text-primary"
                            : "text-admin-text-primary"
                        }`}
                      />
                    </span>
                  </div>
                </th>
                <th className='p-3 text-left'>Auther Name</th>
                <th className='p-3 text-left'>Publish Date</th>
                {/* <th className='p-3 text-left'>Comment</th> */}
                <th
                  className='py-3 px-4 flex gap-1 justify-center items-center'
                  onClick={() => setIsActiveInactiveFilterPopup(true)}
                >
                  {isActiveInactiveValue === ""
                    ? "Status"
                    : isActiveInactiveValue}{" "}
                  <FaAngleDown className='text-admin-text-primary' />
                </th>
                <th className='p-3 text-center'>Action</th>
                <th className='p-3 text-center'>Info</th>
              </tr>
            </thead>
            <tbody>
              {blog.map((user: any, index: any) => (
                <tr key={index} className='border-b'>
                  {/* <td className='p-3 text-center'>
                    <div className='flex justify-center items-center'>
                      {user?.sequence_number}
                    </div>
                  </td> */}
                  <td className='p-3'>
                    {user?.image ? (
                      <>
                        <img
                          src={`${user?.image}`}
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
                  <td className='p-3 capitalize text-start truncate'>
                    {user?.title}
                  </td>
                  <th className='p-3 text-left '> {user?.author}</th>
                  <th className='p-3 text-left '> {formatIST(user?.publish_date)}</th>

                  {/* <td
                    className='p-4 capitalize text-center'
                    onClick={() => handleOpenReview(user?.id)}
                  >
                    <div className='p-2 flex gap-2 justify-center items-center bg-[#EFBF04] rounded-md text-white font-semibold'>
                      <FaCircleArrowRight />
                    </div>
                  </td> */}
                  <td className='p-3 text-center'>
                    <div className='text-center'>
                      <Switch
                        checked={user?.is_active}
                        onChange={() => activeHandler(user, !user?.is_active)}
                        className={`${
                          user?.is_active ? "bg-green-500" : "bg-gray-300"
                        } relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-200 ease-in-out`}
                      >
                        <span
                          className={`${
                            user?.is_active ? "translate-x-6" : "translate-x-1"
                          } inline-block w-6 h-6 bg-white rounded-full transition-transform duration-200 ease-in-out`}
                        />
                      </Switch>
                    </div>
                  </td>

                  <td className='p-3 text-center'>
                    <div className='flex justify-center items-center space-x-3'>
                      <button
                        onClick={() => handleEdit(user)}
                        className='text-orange-500'
                      >
                        <TbEdit size={28} />
                      </button>
                      <button
                        onClick={() => handleDelete(user?.id)}
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
                        handleOpenInfo(user?.id);
                      }}
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
          {blog.length === 0 && (
            <div className='text-center p-4'>No blog available</div>
          )}
          {isOpenDeletePopup && (
            <BlogDeleteComponent
              isOpenDeletePopup={isOpenDeletePopup}
              handleDeleteConform={() => handleDeleteConform(selectedRoleId)}
              setIsLogoutDialogOpen={setIsLogoutPopup}
              setIsOpen={setIsLogoutPopup}
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
      <div>
        {isUserInfo && (
          <BlogInfoComponent
            user={blog.find((user) => user.id === isinfo)}
            isUserInfo={isUserInfo}
            setIsuserInfo={setIsuserInfo}
            setIsOpen={setIsuserInfo}
          />
        )}
      </div>{" "}
      {isopenReview && (
        <BlogCommentCOmponent
          review={isReviews}
          isOpenInfoPopup={isopenReview}
          setIsInfoPopup={setopenReview}
          setIsOpen={setopenReview}
          fetchReview={fetchReview}
          isParentProductId={isParentProductId}
        />
      )}
      {isActiveInactiveFitlerPopup && (
        <ActiveInactiveFilterPopup
          isOpenActiveInactivePopup={isActiveInactiveFitlerPopup}
          setIsActiveInactiveFilterPopup={setIsActiveInactiveFilterPopup}
          handlefilter={handleActiveInactivefilter}
          isActiveInactiveValue={isActiveInactiveValue}
        />
      )}
    </div>
  );
};

export default BlogFormComponent;
