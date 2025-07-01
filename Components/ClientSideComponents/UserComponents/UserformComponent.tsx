"use client";
import {
  createUserApi,
  roleDataApi,
  roleFilterDataApi,
  userAllDataApi,
  userDeleteApi,
  userUpdatedApi,
} from "@/apis/userFormApi";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { TbEdit } from "react-icons/tb";
import { MdArrowDropUp, MdDelete, MdEmail } from "react-icons/md";
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import { GoSearch } from "react-icons/go";
import { AiOutlineClose } from "react-icons/ai";
import UserInfoPopupComponent from "./UserInfoPopupComponent";
import RoleFilterpopupComponent from "../RoleFormComponents/RoleFilterpopupComponent";
import { RiLockPasswordFill, RiSubtractFill } from "react-icons/ri";
import { IoMdAdd, IoMdArrowDropdown } from "react-icons/io";
import UserFormDeleteComponent from "./UserFormDeleteComponent";
import { FaAngleDown, FaCircleUser } from "react-icons/fa6";
import { BiSolidImageAdd } from "react-icons/bi";
import { Switch } from "@headlessui/react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { clearUserDetails } from "@/redux/userSlice";
import { useRouter } from "next/navigation";
import ActiveInactiveFilterPopup from "../RoleFormComponents/ActiveInactiveFilterPopup";
import { FiMinus, FiPlus } from "react-icons/fi";
type User = {
  id: number;
  password: string;
  profileImg: string;
  first_name: string;
  last_name: string;
  phone_number: number;
  email: string;
  county_code: string;
  profile_picture: string;
  is_active: false;
  category: string;
  last_login: string;
  date_joined: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
};

const UserFormComponent = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({
    id: "",
    password: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    county_code: "",
    is_active: false,
    profile_picture: "",
    category_name: "",
  });
  const [isOpenDeletePopup, setIsLogoutPopup] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [userrole, setuserrole] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [searchText, setSearchText] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [isUserInfo, setIsuserInfo] = useState<boolean>(false);
  const [isOpenRoleFilterPopup, SetIsOpenRoleFilterPopup] = useState<boolean>(false);
  const [isActiveInactiveFitlerPopup, setIsActiveInactiveFilterPopup] = useState<boolean>(false);
  const [isfile, setfile] = useState("");
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [isfiltervalue, setfiltervalue] = useState<any>();
  const [isActiveInactiveValue, setActiveInactivevalue] = useState<string>("");
  const [ordering, setOrdering] = useState("first_name");
  const [isinfo, setIsinfo] = useState<number>();
  const [fileName, setFileName] = useState("");
  const [isFilterrole, setFilterrole] = useState([]);
  const [county_code, setPhoneCode] = useState<string | undefined>("+91");
  const [emailError, setEmailError] = useState("");
  const [isloading, setloading] = useState<boolean>(false);
  const token = useSelector((state: any) => state?.user?.token);
  const dispatch = useDispatch();
  const router = useRouter();
  const tokenErrorShown = useRef(false);
  const topRef = useRef<HTMLDivElement | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setCurrentPage(1)
  };

  const clearSearch = () => {
    setSearchText("");
  };

  const handleCreateOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {
      id,
      password,
      first_name,
      last_name,
      phone_number,
      email,
      is_active,
      profile_picture,
      category_name,
    } = newUser;
    if (emailError === "Please enter a valid email address.") {
      return;
    }
    // else if (phone_number) {
    //   if (!county_code) {
    //     toast.error("Select Country Code")
    //     return
    //   }
    // }
    try {
      if (isEdit) {
        const response = await userUpdatedApi(
          id,
          first_name,
          last_name,
          phone_number,
          email,
          county_code,
          profile_picture,
          is_active,
          category_name,
          token
        );
        if (response?.data?.error === "User with this email already exists") {
          toast.error("This Email Id is already existed");
        } else if (response?.data?.error === "This username already exists") {
          toast.error("This Email Id is already existed on website");
        } else if (
          response?.data?.error === "User with this username already exists"
        ) {
          toast.error("This Email Id is already existed");
        } else if (response?.status === 200) {
          toast.success("User updated successfully");
          setIsEdit(false);
          fetchUser();
          setOpenForm(false);
          setFileName("");
          setPhoneCode("+91");
          setNewUser({
            id: "",
            password: "",
            first_name: "",
            last_name: "",
            phone_number: "",
            email: "",
            county_code: "",
            is_active: false,
            profile_picture: "",
            category_name: "",
          });
        } else if (response?.data?.detail === "Invalid token") {
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
        }
      } else {
        const response = await createUserApi(
          password,
          first_name,
          last_name,
          phone_number,
          email,
          county_code,
          profile_picture,
          is_active,
          category_name,
          token
        );
        if (response?.error === "User with this email already exists") {
          toast.error("This Email Id is already existed");
        } else if (response?.error === "This username already exists") {
          toast.error("This Email Id is already existed on website");
        } else if (
          response?.error === "User with this username already exists"
        ) {
          toast.error("This Email Id is already existed");
        } else if (response?.status === 201) {
          console.log("response", response?.status);
          toast.success("User created successfully!");
          fetchUser();
          setOpenForm(false);
          setFileName("");
          setPhoneCode("+91");
          setNewUser({
            id: "",
            password: "",
            first_name: "",
            last_name: "",
            phone_number: "",
            email: "",
            county_code: "",
            is_active: false,
            profile_picture: "",
            category_name: "",
          });
        } else if (response?.data?.detail === "Invalid token") {
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
        }
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  const handleEdit = (users: {
    id: string;
    password: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    country_code_for_phone_number: string;
    profile_picture: string;
    is_active: boolean;
    category_name: string;
  }) => {
    setOpenForm(true);
    setFileName(users?.profile_picture);
    setPhoneCode(
      users?.country_code_for_phone_number
        ? users?.country_code_for_phone_number
        : "+91"
    );
    if (topRef.current) {
      topRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setNewUser({
      id: users?.id,
      password: users.password,
      first_name: users.first_name,
      last_name: users.last_name,
      phone_number: users.phone_number,
      email: users.email,
      county_code: users?.country_code_for_phone_number,
      is_active: users.is_active,
      profile_picture: isfile,
      category_name: users.category_name,
    });
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setIsEdit(true);
    setSelectedUserId(users.id);
    console.log("users.category", users.category_name);
  };

  const searchParams = useSearchParams();
  const status = searchParams.get("is_active") || "";
  const isActive =
    status === "true" ? true : status === "false" ? false : undefined;
  const isActiveInactive =
    isActiveInactiveValue === "Active"
      ? true
      : isActiveInactiveValue === "Inactive"
      ? false
      : undefined;

  useEffect(() => {
    if (isActive === true) {
      setActiveInactivevalue("Active");
    } else if (isActive === false) {
      setActiveInactivevalue("Inactive");
    } else {
      setActiveInactivevalue("");
    }
  }, [status]);
  const fetchUser = async () => {
    try {
      const apiParams: {
        search?: string;
        category?: string;
        current_page: number;
        page_size: number;
        is_active?: boolean;
        token: string;
        isActiveInactive?: boolean;
        ordering: string;
      } = {
        current_page: currentPage,
        page_size: pageSize,
        is_active: isActive,
        isActiveInactive,
        ordering,
        token: token,
      };
      if (isfiltervalue) {
        apiParams.category = isfiltervalue;
      } else if (searchText) {
        apiParams.search = searchText;
      } else if (isActive) {
        apiParams.is_active = isActive;
      } else if (isfiltervalue === "") {
        apiParams.category = "";
      }
      const response = await userAllDataApi(apiParams);
      if (response?.body) {
        setUsers(response?.body.results);
        setuserrole(response.body.results.role)
        setTotalPages(response?.body.total_pages);
      } else if (response?.body.detail === "Invalid token") {
        if (!tokenErrorShown.current) {
          tokenErrorShown.current = true; // Prevent further toasts
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
        }
        return;
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
    SetIsOpenRoleFilterPopup(false);
    setCurrentPage(1);
  };

  const handleActiveInactivefilter = (value: any) => {
    setActiveInactivevalue(value);
    setIsActiveInactiveFilterPopup(false);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchUser();
  }, [
    searchText,
    currentPage,
    isActive,
    isActiveInactiveValue,
    ordering,
    isfiltervalue,
  ]);

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
      const response = await userDeleteApi(id, token);
      if (response?.body.success) {
        toast.success("User deleted successfully");
        setIsLogoutPopup(false);
        fetchUser();
      } else if (response?.body.detail === "Invalid token") {
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again");
        router.push("/");
      }
    } catch (error) {
      console.error("Failed to delete role:");
    }
  };

  const fetchRolesdata = async () => {
    try {
      const data = await roleDataApi(token);
      setuserrole(data?.user_roles);
    } catch (error) {
      console.error("Error fetching roles:", searchText);
    }
  };
  useEffect(() => {
    fetchRolesdata();
  }, []);
  const fetchFilterdata = async () => {
    try {
      const data = await roleFilterDataApi(token);

      setFilterrole(data?.user_roles);
    } catch (error) {
      console.error("Error fetching roles:", searchText);
    }
  };
  useEffect(() => {
    fetchFilterdata();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file: any = e.target.files?.[0];
    setfile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setNewUser((prev) => ({
            ...prev,
            profile_picture: file,
          }));
          setFileName(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handlecCancleEdit = () => {
    setIsEdit(false);
    setOpenForm(false);
    setNewUser({
      id: "",
      password: "",
      first_name: "",
      last_name: "",
      phone_number: "",
      email: "",
      county_code: "",
      is_active: false,
      profile_picture: "",
      category_name: "",
    });
  };
  const handleopenform = () => {
    setOpenForm(!openForm);
    setIsEdit(false);
    setFileName("");
    setPhoneCode("+91");
    setNewUser({
      id: "",
      password: "",
      first_name: "",
      last_name: "",
      phone_number: "",
      email: "",
      county_code: "",
      is_active: false,
      profile_picture: "",
      category_name: "",
    });
  };

  useEffect(() => {
    setfiltervalue("");
  }, [searchText]);
  const handleOpenInfo = (id: number) => {
    setIsuserInfo(true);
    setIsinfo(id);
  };

  const activeHandler = async (data: any, isActive: boolean) => {
    setloading(true);
    const profile_picture = isfile;
    const response = await userUpdatedApi(
      data?.id,
      data?.first_name,
      data?.last_name,
      data?.phone_number,
      data?.email,
      data?.country_code_for_phone_number,
      profile_picture,
      isActive,
      data?.category,
      token
    );
    if (response?.status === 200) {
      fetchUser();
      setloading(false);
    } else if (response?.data?.detail === "Invalid token") {
      dispatch(clearUserDetails());
      toast.error("Session Expired, Please Login Again");
      router.push("/");
    }
    setloading(false);
  };

  const handlePhoneCodeChange = (newValue: string | undefined) => {
    setPhoneCode(newValue);
  };

  const handleEmailChange = (e: any) => {
    const { value } = e.target;
    const lowerCaseValue = value.toLowerCase();
    setNewUser((prev) => ({ ...prev, email: lowerCaseValue }));

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(lowerCaseValue)) {
      setEmailError("Please Enter a Valid Email Address.");
    } else {
      setEmailError("");
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
              <span className='button__text'>Add</span>
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
          className='bg-white shadow-md border-[1px] rounded-lg lg:p-6 p-4 mb-6 lg:w-[90%] w-full'
        >
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm'>
              <FaUser color='#A5B7C0' size={26} />
              <input
                type='text'
                name='firstName'
                value={newUser.first_name}
                onChange={(e) => {
                  const { value } = e.target;
                  const regex = /^[A-Za-z\s]*$/;
                  if (regex.test(value)) {
                    setNewUser((prev) => ({ ...prev, first_name: value }));
                  }
                }}
                // placeholder="First Name"

                required
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
              />
              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                Enter First Name
              </label>
            </div>
            <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm'>
              <FaUser color='#A5B7C0' size={26} />
              <input
                type='text'
                name='last_name'
                value={newUser.last_name}
                onChange={(e) => {
                  const { value } = e.target;
                  const regex = /^[A-Za-z\s]*$/;
                  if (regex.test(value)) {
                    setNewUser((prev) => ({ ...prev, last_name: value }));
                  }
                }}
                // placeholder="Last Name"
                required
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
              />
              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                Enter Last Name
              </label>
            </div>
            <div className='flex bg-[#F3F3F3] rounded-md px-3 '>
              <div className='flex items-center justify-center'>
                <PhoneInput
                  international
                  defaultCountry='IN'
                  value={county_code}
                  // onChange={(value) =>
                  //   setNewUser((prev) => ({ ...prev, county_code: value || '' }))
                  // }
                  onChange={(value) => handlePhoneCodeChange(value)}
                  placeholder='Country Code'
                  className='w-full h-full'
                />
                <p className='text-md font-semibold text-center'>
                  {county_code}
                </p>
              </div>
              <div className='flex bg-[#F3F3F3]  relative w-full h-12 rounded-lg shadow-sm'>
                <input
                  type='number'
                  name='phone'
                  value={newUser.phone_number}
                  onChange={(e) => {
                    const onlyNumbers = e.target.value.replace(/[^0-9]/g, "");

                    setNewUser((prev) => ({
                      ...prev,
                      phone_number: onlyNumbers.slice(0, 13),
                    }));
                  }}
                  // placeholder="Phone Number"
                  className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
                />
                <label
                  htmlFor='tag'
                  className='absolute left-3 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                >
                  Enter Phone Number
                </label>
              </div>
            </div>

            <div className='flex flex-col'>
              <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm'>
                <MdEmail color='#A5B7C0' size={26} />
                <input
                  type='email'
                  name='email'
                  value={newUser.email}
                  onChange={handleEmailChange}
                  // placeholder="Email"
                  required
                  className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
                />
                <label
                  htmlFor='tag'
                  className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                >
                  Enter Email
                </label>
              </div>
              {emailError && (
                <p className='text-red-500 text-sm mt-1'>{emailError}</p>
              )}
            </div>
            <div className='lg:flex gap-3 w-full'>
              {isEdit ? (
                <></>
              ) : (
                <div className='relative mb-4 flex justify-center items-center w-full'>
                  <div className='p-3 flex rounded-md bg-[#F3F3F3] w-full'>
                    <RiLockPasswordFill color='#A5B7C0' size={26} />
                    <input
                      type={showPassword ? "text" : "password"}
                      name='password'
                      value={newUser.password}
                      onChange={(e) =>
                        setNewUser((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      // placeholder="Password"
                      required
                      className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
                    />
                    <label
                      htmlFor='tag'
                      className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                    >
                      Enter Password
                    </label>
                  </div>
                  <button
                    type='button'
                    className='absolute right-3 top-3'
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <FaEyeSlash size={20} />
                    ) : (
                      <FaEye size={20} />
                    )}
                  </button>
                </div>
              )}
              <div className='border-primary/30 border-[1px] bg-gray-50 rounded-md  w-full focus:outline-none focus:outline-1 placeholder-black h-12'>
                <div className='flex bg-admin-secondary justify-center items-center px-4 rounded-md'>
                  <input
                    id='img'
                    name='img'
                    type='file'
                    placeholder='Upload Image'
                    value={newUser?.profile_picture}
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
            </div>
            <div className='lg:flex gap-6 h-12 '>
              {/* <select
                name='role'
                value={newUser?.category_name}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, category: e.target.value }))
                }
                className='p-3 rounded-md bg-[#F3F3F3]  w-full px-3'
                required
              >
                <option value=''>Select Role</option>
                {userrole.map((data: any, index: any) => (
                  <option key={index} value={data?.id}>
                    {data?.name}
                  </option>
                ))}
              </select> */}
              <div className='flex items-center gap-4 w-full lg:mt-0 mt-4'>
                <div className='flex  items-center justify-center gap-2 bg-[#F3F3F3] rounded-lg h-12 w-46 p-4'>
                  <label className='text-sm text-[#577C8E] px-3'>
                    Is Active?
                  </label>
                  <div className='switch'>
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
          <div className='lg:mt-12 mt-16 flex gap-3 justify-center items-center'>
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
              <tr className='px-4'>
                <th className='p-3 text-left'>Profile</th>
                <th
                  className={`text-center cursor-pointer transition-colors duration-200 ${
                    ordering === "first_name" || ordering === "-first_name"
                      ? "text-admin-text-primary"
                      : "text-admin-text-primary"
                  }`}
                  onClick={() => handleOrdering("first_name")}
                >
                  <div className='flex items-center justify-start space-x-0'>
                    <span className='text-start'>Name</span>
                    <span className='flex flex-col leading-none'>
                      <MdArrowDropUp
                        className={`w-7 h-7 transform -mb-1 ${
                          ordering === "first_name"
                            ? "text-admin-text-primary"
                            : "text-admin-text-primary"
                        }`}
                      />
                      <IoMdArrowDropdown
                        className={`w-7 h-7 transform -mt-3 ${
                          ordering === "-first_name"
                            ? "text-admin-text-primary"
                            : "text-admin-text-primary"
                        }`}
                      />
                    </span>
                  </div>
                </th>
                {/* <th className="p-3 text-center flex gap-2 lg:mt-0 mt-3" onClick={() => SetIsOpenRoleFilterPopup(true)}>Role <img
                  src="/rolefilter.png"
                  alt="Profile"s
                  className="h-6 w-6 object-cover "
                /></th> */}
                <th
                  className='p-4 flex gap-1 justify-start items-center'
                  onClick={() => SetIsOpenRoleFilterPopup(true)}
                >
                  {/* <span>Role</span> */}
                  {isfiltervalue === "" ? "All Role" : isfiltervalue?.name}{" "}
                  <FaAngleDown className='text-admin-text-primary' />
                </th>
                <th className='p-3 text-end'>Phone Number</th>
                <th className='p-3 text-start'>Email</th>
                <th
                  className='py-3 px-4 flex gap-1 justify-center items-center'
                  onClick={() => setIsActiveInactiveFilterPopup(true)}
                >
                  {isActiveInactiveValue === ""
                    ? "Status"
                    : isActiveInactiveValue}{" "}
                  <FaAngleDown className='text-admin-text-primary' />
                </th>
                <th className='p-3 text-right'>Action</th>
                <th className='p-3 text-center'>Info</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any, index: any) => (
                <tr key={index} className='border-b'>
                  <td className='p-3'>
                    {user?.profile_picture? (
                      <>
                        <img
                          src={`${user?.profile_picture}`}
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
                  <td className='p-3 capitalize text-start'>
                    {user?.first_name} {user?.last_name}
                  </td>
                  <td className='p-3 capitalize text-start'>
                    {user?.category_name}
                  </td>
                  <td className='p-3 text-end'>
                    {user?.phone_number ? (
                      <>
                        {user?.country_code_for_phone_number}
                        {user?.phone_number}
                      </>
                    ) : null}
                  </td>
                  <td className='p-3 text-start'>{user?.email}</td>
                  <td className='p-3 text-center'>
                    <div className='text-center'>
                     <Switch
  checked={!user?.isDeleted}
  onChange={() => activeHandler(user, user?.is_active)}
  className={`
    ${user?.is_active ? "bg-green-500" : "bg-gray-300"} 
    relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-200 ease-in-out
  `}
>
  <span
    className={`
      ${user?.is_active ? "translate-x-6" : "translate-x-1"} 
      inline-block w-6 h-6 bg-white rounded-full transition-transform duration-200 ease-in-out
    `}
  />
</Switch>
                    </div>
                  </td>
                  <td className='p-3 text-right'>
                    <div className='flex justify-end items-center space-x-3'>
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
                  <td className='p-3 text-center'>
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
          {users.length === 0 && (
            <div className='text-center p-4'>No user available</div>
          )}
          {isOpenDeletePopup && (
            <UserFormDeleteComponent
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
          <UserInfoPopupComponent
            user={users.find((user) => user.id === isinfo)}
            isUserInfo={isUserInfo}
            setIsuserInfo={setIsuserInfo}
            setIsOpen={setIsuserInfo}
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
        {isOpenRoleFilterPopup && (
          <RoleFilterpopupComponent
            role={isFilterrole}
            isOpenRoleFilterPopup={isOpenRoleFilterPopup}
            SetIsOpenRoleFilterPopup={SetIsOpenRoleFilterPopup}
            setIsOpens={SetIsOpenRoleFilterPopup}
            handlefilter={handlefilter}
            isfiltervalue={isfiltervalue}
          />
        )}
      </div>
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
  );
};

export default UserFormComponent;
