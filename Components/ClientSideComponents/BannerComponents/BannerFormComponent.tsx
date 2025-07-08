"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TbEdit } from "react-icons/tb";
import { MdArrowDropUp, MdDelete } from "react-icons/md";
import { RiArticleFill } from "react-icons/ri";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaAngleDown, FaCircleUser } from "react-icons/fa6";
import { BiSolidImageAdd } from "react-icons/bi";
import { Switch } from "@headlessui/react";
import "react-phone-number-input/style.css";
import UserInfoPopupComponent from "../UserComponents/UserInfoPopupComponent";
import { useDispatch, useSelector } from "react-redux";
import {bannerAllDataApi,bannerDeleteApi,bannerUpdatedApi,createBannerApi} from "@/apis/bannerApi";
import BannerDeleteComponent from "./BannerDeleteComponent";
import { clearUserDetails } from "@/redux/userSlice";
import { useRouter } from "next/navigation";
import ActiveInactiveFilterPopup from "../RoleFormComponents/ActiveInactiveFilterPopup";
import { FiMinus, FiPlus } from "react-icons/fi";

type banner = {
  id: number;
  sequence_number: string;
  heading: string;
  sub_heading: string;
  description: string;
  image: string;
  isActive: false;
  created_by: string;
  updated_at: string;
  updated_by: string;
};

const BannerFormComponent = () => {
  const [banner, setBanner] = useState<banner[]>([]);
  const [newUser, setNewUser] = useState({
    id: "",
    sequence_number: "",
    heading: "",
    sub_heading: "",
    description: "",
    button: "",
    button_link: "",
    image: "",
    mobile_banner:"",
    isActive: false,
  });
  const [isOpenDeletePopup, setIsLogoutPopup] = useState<boolean>(false);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isUserInfo, setIsuserInfo] = useState<boolean>(false);
  const [isfile, setfile] = useState("");
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [isActiveInactiveFitlerPopup, setIsActiveInactiveFilterPopup] =useState<boolean>(false);
  const [isfiltervalue, setfiltervalue] = useState<string>("");
  const [ordering, setOrdering] = useState("sequence_number");
  const [isinfo, setIsinfo] = useState<number>();
  const [fileName, setFileName] = useState("");
  const created_by = useSelector((state: any) => state?.user?.details?.id);
  const token = useSelector((state: any) => state?.user?.token);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isFileNamemobile,setFileNamemobile]=useState("")

  const handleCreateOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {
      id,
      sequence_number,
      heading,
      sub_heading,
      description,
      image,
      isActive,
      button,
      mobile_banner,
      button_link,
    } = newUser;
    try {
      if (isEdit) {
        const response = await bannerUpdatedApi(
          id,
          sequence_number,
          heading,
          sub_heading,
          description,
          image,
          mobile_banner,
          isActive,
          button,
          button_link,
          token
        );
        if (response?.status === 200) {
          toast.success("Banner Updated successfully");
          setIsEdit(false);
          fetchBanner();
          setOpenForm(false);
          setFileName("");
          setfile("");
          setFileNamemobile("")
          setNewUser({
            id: "",
            sequence_number: "",
            heading: "",
            sub_heading: "",
            description: "",
            image: "",
            mobile_banner:"",
            button: "",
            button_link: "",
            isActive: false,
          });
        } else if (
          response?.data?.error === "This sequence number already exists"
        ) {
          toast.error("This sequence number already exists");
        } else if (response?.data?.detail === "Invalid or expired token") {
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
        }
      } else {
        const response = await createBannerApi(
          sequence_number,
          heading,
          sub_heading,
          description,
          image,
          mobile_banner,
          isActive,
          button,
          button_link,
          token
        );
        if (response?.error === "A banner with this sequence_number already exists.") {
          toast.error("This sequence number already exists");
        } else if (response?.status === 201) {
          toast.success("Banner created successfully!");
          fetchBanner();
          setOpenForm(false);
          setFileName("");
          setfile("");
          setFileNamemobile("")
          setNewUser({
            id: "",
            sequence_number: "",
            heading: "",
            sub_heading: "",
            description: "",
            image: "",
            mobile_banner:"",
            button: "",
            button_link: "",
            isActive: false,
          });
        } else if (response?.detail === "Invalid token") {
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
        }
      }
    } catch (error) {
      toast.error("Network error");
    }
  };
  const handleEdit = (banner: {
    id: string;
    sequence_number: string;
    heading: string;
    subheading: string;
    banner: string;
    buttonText: string;
    buttonLink: string;
    description: string;
    image: string;
    mobile_banner:string,
    isActive: boolean;
    created_by: string;
  }) => {
    setOpenForm(true);
    setFileName(banner?.image)
    setFileNamemobile(banner?.mobile_banner)
    setNewUser({
      id: banner?.id,
      sequence_number: banner?.sequence_number,
      heading: banner?.heading,
      sub_heading: banner?.subheading,
      description: banner?.description,
      image: isfile,
      mobile_banner:"",
      button: banner?.buttonText,
      button_link: banner?.buttonLink,
      isActive: banner?.isActive,
    });
    setIsEdit(true);
  };

  const isActive =
    isfiltervalue === "Active"
      ? true
      : isfiltervalue === "Inactive"
      ? false
      : undefined;
  const fetchBanner = async () => {
    try {
      const apiParams: { ordering: string; isActive?: boolean } = {
        ordering,
        isActive,
      };
      const response = await bannerAllDataApi(apiParams, token);
      if (response?.status === "01") {
        // dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again");
        router.push("/");
      } else if (response) {
        setBanner(response.body);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleOrdering = (field: string) => {
    setOrdering((prev) => (prev === field ? `-${field}` : field));
  };

  const handlefilter = (value: any) => {
    setfiltervalue(value);
    setIsActiveInactiveFilterPopup(false);
  };
  useEffect(() => {
    fetchBanner();
  }, [ordering, isfiltervalue]);

  const handleDelete = async (id: string) => {
    setSelectedRoleId(id);
    setIsLogoutPopup(true);
  };
  const handleDeleteConform = async (id: string) => {
    try {
      const response = await bannerDeleteApi(id, token);
      if (response.status === 200) {
        toast.success("Banner deleted successfully");
        setIsLogoutPopup(false);
        fetchBanner();
      } else if (response?.status === 401) {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file: any = e.target.files?.[0];
    setfile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setNewUser((prev) => ({ ...prev, image: file }));
          setFileName(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };


  const handleMobileFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file: any = e.target.files?.[0];
    setfile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setNewUser((prev) => ({ ...prev, mobile_banner: file }));
          setFileNamemobile(file.name);
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
      sequence_number: "",
      heading: "",
      sub_heading: "",
      description: "",
      image: "",
      mobile_banner:"",
      button: "",
      button_link: "",
      isActive: false,
    });
  };

  const handleopenform = () => {
    setOpenForm(!openForm);
    setIsEdit(false);
    setFileName("");
    setNewUser({
      id: "",
      sequence_number: "",
      heading: "",
      sub_heading: "",
      description: "",
      image: "",
      mobile_banner:"",
      button: "",
      button_link: "",
      isActive: false,
    });
  };
  const handleOpenInfo = (id: number) => {
    setIsuserInfo(true);
    setIsinfo(id);
  };

  const activeHandler = async (banner: any, isActive: boolean) => {
    const image = isfile;
    const mobile_banner=""
    const response = await bannerUpdatedApi(
      banner?.id,
      banner?.sequence_number,
      banner?.heading,
      banner?.subheading??"",
      banner?.description??"",
      image,
      mobile_banner,
      isActive,
      banner?.button,
      banner?.button_link,
      token
    );
    if (response?.status === 200) {
      fetchBanner();
    } else if (response?.data?.detail === "Invalid token") {
      dispatch(clearUserDetails());
      toast.error("Session Expired, Please Login Again");
      router.push("/");
    }
  };

  return (
    <div className='w-full flex flex-col lg:items-center justify-center'>
      <div className='flex justify-center items-center mx-auto w-full mb-4 lg:gap-8 gap-3'>
        <div className='md:w-[60%] w-[90%] relative'></div>
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
          className='bg-white border-[1px] shadow-md rounded-lg lg:p-6 p-4 mb-6 lg:w-[90%] w-full'
        >
          <div className='grid grid-cols-1 lg:grid-cols-2 lg:gap-4 gap-5'>
            <div className='relative w-full bg-[#F3F3F3] rounded-lg shadow-sm'>
              <div className='flex bg-[#F3F3F3] p-3  h-12 rounded-md'>
                <RiArticleFill color='#A5B7C0' size={26} />
                <input
                  type='number'
                  name='Sequence Number'
                  value={newUser.sequence_number}
                  onChange={(e) =>
                    setNewUser((prev) => ({
                      ...prev,
                      sequence_number: e.target.value,
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
                  Enter Sequence Number
                </label>
              </div>
            </div>
            <div className='relative w-full  bg-[#F3F3F3] rounded-lg shadow-sm'>
              <div className='flex items-center px-4 py-2 h-12'>
                <RiArticleFill className='text-gray-400' size={24} />
                <input
                  type='text'
                  name='heading'
                  value={newUser?.heading}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, heading: e.target.value }))
                  }
                  // placeholder="Enter Heading"
                  className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
                />
                <label
                  htmlFor='tag'
                  className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                >
                  Enter Heading
                </label>
              </div>
            </div>
            <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm  mt-3'>
              <RiArticleFill color='#A5B7C0' size={26} />
              <input
                type='text'
                name='sub_heading'
                value={newUser.sub_heading}
                onChange={(e) =>
                  setNewUser((prev) => ({
                    ...prev,
                    sub_heading: e.target.value,
                  }))
                }
                // placeholder="Enter description"
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
              />
              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                Enter Sub Heading
              </label>
            </div>
            <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm  mt-3'>
              <RiArticleFill color='#A5B7C0' size={26} />
              <input
                type='text'
                name='description'
                value={newUser.description}
                onChange={(e) =>
                  setNewUser((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                // placeholder="Enter description"
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
              />
              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                Enter Description
              </label>
            </div>
            <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm  mt-3'>
              <RiArticleFill color='#A5B7C0' size={26} />
              <input
                type='text'
                name='button'
                value={newUser.button}
                onChange={(e) =>
                  setNewUser((prev) => ({
                    ...prev,
                    button: e.target.value,
                  }))
                }
                // placeholder="Enter description"
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
              />
              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                Enter Button Text
              </label>
            </div>
            <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm  mt-3'>
              <RiArticleFill color='#A5B7C0' size={26} />
              <input
                type='text'
                name='button_link'
                value={newUser.button_link}
                onChange={(e) =>
                  setNewUser((prev) => ({
                    ...prev,
                    button_link: e.target.value,
                  }))
                }
                // placeholder="Enter description"
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
              />
              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                Enter Button Link
              </label>
            </div>
            <div className='gap-3 w-full'>
              <p className="mb-2 px-2">Desktop Banner Image </p>
              <div className='border-primary/30 border-[1px] bg-gray-50 rounded-md  w-full focus:outline-none focus:outline-1 placeholder-black h-12'>
                <div className='flex bg-admin-secondary justify-center items-center px-2 rounded-md'>
                  <input
                    id='img'
                    name='img'
                    type='file'
                    placeholder='Upload Image'
                    // value={newUser?.image}
                    onChange={handleFileChange}
                    accept='.jpeg,.png,'
                    {...(isEdit ? {} : { required: true })}
                    className='block w-full text-sm text-admin-secondary file:mr-4 file:py-1 file:h-12 file:px-4  file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-admin-secondary bg-admin-secondary file:text-white hover:file:bg-gray-700'
                  />
                  {fileName ? (
                    <span className='text-white px-2'>{fileName}</span>
                  ) : (
                    <BiSolidImageAdd color='white' size={27} />
                  )}
                </div>
              </div>
            </div>
            <div className='gap-3 w-full'>
            <p className="mb-2 px-2">Mobile Banner Image </p>
              <div className='border-primary/30 border-[1px] bg-gray-50 rounded-md  w-full focus:outline-none focus:outline-1 placeholder-black h-12'>
                <div className='flex bg-admin-secondary justify-center items-center px-2 rounded-md'>
                  <input
                    id='img'
                    name='img'
                    type='file'
                    placeholder='Upload Image'
                    // value={newUser?.image}
                    onChange={handleMobileFileChange}
                    accept='.jpeg,.png,'
                    {...(isEdit ? {} : { required: true })}
                    className='block w-full text-sm text-admin-secondary file:mr-4 file:py-1 file:h-12 file:px-4  file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-admin-secondary bg-admin-secondary file:text-white hover:file:bg-gray-700'
                  />
                  {isFileNamemobile ? (
                    <span className='text-white px-2'>{isFileNamemobile}</span>
                  ) : (
                    <BiSolidImageAdd color='white' size={27} />
                  )}
                </div>
              </div>
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
                        checked={newUser.isActive}
                        onChange={(e) =>
                          setNewUser((prev) => ({
                            ...prev,
                            isActive: e.target.checked,
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
              className={`text-lg lg:w-[200px] mt-3  ${
                isEdit ? "bg-green-500" : "bg-admin-buttonprimary"
              } text-white px-6 lg:py-3 py-2 rounded-md`}
            >
              {isEdit ? "Update" : "Create"}
            </button>
            {isEdit ? (
              <>
                {" "}
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
                <th
                  className={`text-center cursor-pointer transition-colors duration-200 ${
                    ordering === "sequence_number" ||
                    ordering === "-sequence_number"
                      ? "text-admin-text-primary"
                      : "text-admin-text-primary"
                  }`}
                  onClick={() => handleOrdering("sequence_number")}
                >
                  <div className='flex items-center justify-center space-x-0'>
                    <span className=''>Sequence Number</span>
                    <span className='flex flex-col leading-none'>
                      <MdArrowDropUp
                        className={`w-7 h-7 transform -mb-1 ${
                          ordering === "sequence_number"
                            ? "text-admin-text-primary"
                            : "text-admin-text-primary"
                        }`}
                      />  
                      <IoMdArrowDropdown
                        className={`w-7 h-7 transform -mt-3 ${
                          ordering === "-sequence_number"
                            ? "text-admin-text-primary"
                            : "text-admin-text-primary"
                        }`}
                      />
                    </span>
                  </div>
                </th>
                <th className='p-3 text-left '>Banner Image</th>
                <th className='p-3 text-left '>Mobile Image</th>
                <th className='p-3 text-center '>Heading</th>
                <th className='p-3 text-center '>Sub Heading</th>
                <th
                  className='py-3 px-4 flex gap-1 justify-center items-center'
                  onClick={() => setIsActiveInactiveFilterPopup(true)}
                >
                  {isfiltervalue === "" ? "Status" : isfiltervalue}{" "}
                  <FaAngleDown className='text-admin-text-primary' />
                </th>
                <th className='p-3 text-center'>Action</th>
                <th className='p-3 text-center'>Info</th>
              </tr>
            </thead>
            <tbody>
              {banner.map((banner: any, index: any) => (
                <tr key={index} className='border-b hover:bg-purple-100'>
                  <td className='p-3 text-center'>{banner?.sequence_number}</td>
                  <td className='p-3 text-center lg:px-7'>
                    {banner?.imageUrl ? (
                      <>
                        <img
                          src={banner?.imageUrl}
                          alt='Profile'
                          className='lg:h-16 lg:w-16 h-12 w-12 object-cover rounded-full'
                        />
                      </>
                    ) : (
                      <div className='lg:h-16 lg:w-16 h-12 w-12'>
                        <FaCircleUser className='w-full h-full' />
                      </div>
                    )}
                  </td>
                  <td className='p-3 text-center lg:px-7'>
                    {banner?.mobile_banner ? (
                      <>
                        <img
                          src={banner?.mobile_banner}
                          alt='Profile'
                          className='lg:h-16 lg:w-16 h-12 w-12 object-cover rounded-full'
                        />
                      </>
                    ) : (
                      <div className='lg:h-16 lg:w-16 h-12 w-12'>
                        <FaCircleUser className='w-full h-full' />
                      </div>
                    )}
                  </td>
                  <td className='p-3 capitalize text-center'>
                    {banner?.heading}
                  </td>
                  <th className='p-3 text-center capitalize '>
                    {" "}
                    {banner?.subheading}
                  </th>
                  <td className='p-3 text-center'>
                    <div className='text-center'>
                      <Switch
                        checked={banner?.isActive}
                        onChange={() =>
                          activeHandler(banner, !banner?.isActive)
                        }
                        className={`${
                          banner?.isActive ? "bg-green-500" : "bg-gray-300"
                        } relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-200 ease-in-out`}
                      >
                        <span
                          className={`${
                            banner?.isActive
                              ? "translate-x-6"
                              : "translate-x-1"
                          } inline-block w-6 h-6 bg-white rounded-full transition-transform duration-200 ease-in-out`}
                        />
                      </Switch>
                    </div>
                  </td>
                  <td className='p-3 text-center'>
                    <div className='flex justify-center items-center space-x-3'>
                      <button
                        onClick={() => handleEdit(banner)}
                        className='text-orange-500'
                      >
                        <TbEdit size={28} />
                      </button>
                      <button
                        onClick={() => handleDelete(banner?.id)}
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
                        handleOpenInfo(banner?.id);
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
          {isOpenDeletePopup && (
            <BannerDeleteComponent
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
            user={banner.find((user) => user.id === isinfo)}
            isUserInfo={isUserInfo}
            setIsuserInfo={setIsuserInfo}
            setIsOpen={setIsuserInfo}
          />
        )}
      </div>
    </div>
  );
};

export default BannerFormComponent;
