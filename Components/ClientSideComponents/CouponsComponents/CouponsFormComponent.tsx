"use client";
import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { MdArrowDropUp, MdDelete } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import {
  couponsAllDataApi,
  couponsDeleteApi,
  couponsUpdatedApi,
  createCouponsApi,
} from "@/apis/couponsApi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import RoleDeletePopUpComponent from "../RoleFormComponents/RoleDeleteComponent";
import RoleInfoPopup from "../RoleFormComponents/RoleInfoPopup";
import { RiCoupon4Fill } from "react-icons/ri";
import { IoIosWallet, IoMdArrowDropdown } from "react-icons/io";
import { Switch } from "@headlessui/react";
import { FaAngleDown, FaCalendarDays } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { clearUserDetails } from "@/redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import ActiveInactiveFilterPopup from "../RoleFormComponents/ActiveInactiveFilterPopup";
import CouponTypeFilterPopup from "./CouponTypeFilterPopup";
import DeleteCouponComponent from "./DeleteCouponComponent";
import { formatIST } from "../OrderComponents/OrderInfoComponent";

interface Coupons {
  id: string;
  type: string;
  code: string;
  value: number | string;
  usage_limit: number | string;
  valid_from: string | Date;
  valid_till: string | Date;
  isActive: boolean;
  redeemCount: number;
  title: string;
  description: string;
  show_on_homepage: boolean;
  is_active: boolean;
  createdAt: string;
  expiresAt: string;
  discount: number;
  name: string;
  maxRedeemCount: number;
}

const CouponsFormComponent = () => {
  const [coupons, setRoles] = useState<Coupons[]>([]);
  const [newRole, setNewRole] = useState({
    type: "",
    code: "",
    value: "",
    usage_limit: "",
    valid_from: null as Date | null,
    valid_till: null as Date | null,
    title: "",
    description: "",
    show_on_homepage: false,
    isActive: false,
  });
  const [isEdit, setIsEdit] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [isOpenDeletePopup, setIsLogoutPopup] = useState<boolean>(false);
  const [isOpenInfoPopup, setIsInfoPopup] = useState<boolean>(false);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [info, setinfo] = useState("");
  const [isActiveInactiveFitlerPopup, setIsActiveInactiveFilterPopup] =
    useState<boolean>(false);
  const [isCouponTypeFilterPopupOpen, setIsCouponTypeFilterPopupOpen] =
    useState<boolean>(false);
  const [isfiltervalue, setfiltervalue] = useState<string>("");
  const [isfilterCouponType, setfilterCouponType] = useState<string>("");
  const [ordering, setOrdering] = useState("");
  const created_by = useSelector((state: any) => state?.user?.details?.id);
  const token = useSelector((state: any) => state?.user?.token);
  const dispatch = useDispatch();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const handleCreateOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {
      type,
      code,
      value,
      usage_limit,
      valid_from,
      valid_till,
      isActive,
      title,
      description,
      show_on_homepage,
    } = newRole;

    try {
      if (isEdit) {
        // If editing and show_on_homepage is true, first disable others
        if (show_on_homepage) {
          const otherHomepageCoupons = coupons.filter(
            (c) => c.show_on_homepage && c.id !== selectedRoleId
          );

          for (const coupon of otherHomepageCoupons) {
            await couponsUpdatedApi(
              coupon.id,
              coupon.type,
              coupon.code,
              coupon.discount,
              coupon.maxRedeemCount,
              coupon.createdAt,
              coupon.expiresAt,
              coupon.name,
              coupon.description,
              false, // turn off
              created_by,
              coupon.is_active,
              token
            );
          }
        }

        // Now update current coupon
        const response = await couponsUpdatedApi(
          selectedRoleId,
          type,
          code,
          value,
          usage_limit,
          valid_from,
          valid_till,
          title,
          description,
          show_on_homepage,
          created_by,
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
          toast.success("Coupon updated successfully");
          setIsEdit(false);
        }
      } else {
        // If creating and show_on_homepage is true, first disable others
        if (show_on_homepage) {
          const otherHomepageCoupons = coupons.filter((c) => c.show_on_homepage);
          for (const coupon of otherHomepageCoupons) {
            await couponsUpdatedApi(
              coupon.id,
              coupon.type,
              coupon.code,
              coupon.discount,
              coupon.maxRedeemCount,
              coupon.createdAt,
              coupon.expiresAt,
              coupon.name,
              coupon.description,
              false,
              created_by,
              coupon.is_active,
              token
            );
          }
        }

        // Create new coupon
        const response = await createCouponsApi(
          type,
          code,
          value,
          usage_limit,
          valid_from,
          valid_till,
          created_by,
          title,
          description,
          show_on_homepage,
          isActive,
          token
        );

        if (response?.status === 401) {
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
          return;
        }

        if (response?.data?.error === "Coupon with this code already exists") {
          toast.error("Coupon already exists");
        } else if (response?.status === 201) {
          toast.success("Coupon created successfully");
        }
      }

      fetchRoles();
      setOpenForm(false);
      setNewRole({
        type: "",
        code: "",
        value: "",
        usage_limit: "",
        valid_from: null as Date | null,
        valid_till: null as Date | null,
        title: "",
        description: "",
        show_on_homepage: false,
        isActive: false,
      });
    } catch (error) {
      console.error("Error creating or updating role:", error);
    }
  };

  const isActive =
    isfiltervalue === "Active"
      ? true
      : isfiltervalue === "Inactive"
        ? false
        : undefined;
  const fetchRoles = async () => {
    try {
      const response = await couponsAllDataApi(
        token,
        isfilterCouponType,
        ordering,
        isActive
      );
      if (response?.body.message === "Invalid or expired token") {
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again");
        router.push("/");
        return;
      }
      if (response?.body.data) {
        setRoles(response?.body.data || []);
      }
    } catch (error) { }
  };

  const handlefilter = (value: any) => {
    setfiltervalue(value);
    setIsActiveInactiveFilterPopup(false);
  };

  const handleCouponTypefilter = (value: any) => {
    setfilterCouponType(value);
    setIsCouponTypeFilterPopupOpen(false);
  };

  const handleOrdering = (field: string) => {
    setOrdering((prev) => (prev === field ? `-${field}` : field));
  };

  useEffect(() => {
    fetchRoles();
  }, [isfiltervalue, isfilterCouponType, ordering]);

  const handleDelete = async (id: string) => {
    setSelectedRoleId(id);
    setIsLogoutPopup(true);
  };

  const handleDeleteConform = async (id: string) => {
    try {
      const response = await couponsDeleteApi(id, token);
      if (response?.body.success) {
        toast.success("Coupon deleted successfully");
        setIsLogoutPopup(false);
        fetchRoles();
      } else if(response.body.message==="Invalid or expired token"){
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again");
        router.push("/");
        return;
      }else {
        console.error("Unexpected response format:", response);
      }
    } catch (error) {
      console.error("Failed to delete role:");
    }
  };

  const handleEdit = (role: {
    id: string;
    type: string;
    code: string;
    value: string;
    usage_limit: any;
    valid_from: any;
    valid_till: any;
    title: string;
    description: string;
    show_on_homepage: any;
    is_active: any;
  }) => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setOpenForm(true);
    setNewRole({
      type: role?.type,
      code: role?.code,
      value: role?.value,
      usage_limit: role?.usage_limit,
      valid_from: role?.valid_from,
      valid_till: role?.valid_till,
      title: role?.title,
      description: role?.description,
      show_on_homepage: role?.show_on_homepage,
      isActive: role?.is_active,
    });
    setIsEdit(true);
    setSelectedRoleId(role.id);
  };

  const handlecCancleEdit = () => {
    setOpenForm(false);
    setIsEdit(false);
    setNewRole({
      type: "",
      code: "",
      value: "",
      usage_limit: "",
      valid_from: null as Date | null,
      valid_till: null as Date | null,
      title: "",
      description: "",
      show_on_homepage: false,
      isActive: false,
    });
  };

  const handleopenform = () => {
    setOpenForm(!openForm);
    setIsEdit(false);
    setNewRole({
      type: "",
      code: "",
      value: "",
      usage_limit: "",
      valid_from: null as Date | null,
      valid_till: null as Date | null,
      title: "",
      description: "",
      show_on_homepage: false,
      isActive: false,
    });
  };

  const handleOpenInfo = (id: string) => {
    setIsInfoPopup(true);
    setinfo(id);
  };
  const handleValidFromChange = (date: any) => {
    if (date) {
      setNewRole((prev) => ({ ...prev, valid_from: date }));
    }
  };

  const handleValidTillChange = (date: any) => {
    setNewRole((prev) => ({ ...prev, valid_till: date }));
  };
  const activeHandler = async (
    selectedCoupon: any,
    isActive: boolean,
    showOnHomepage: boolean
  ) => {
    const safeIsActive = typeof isActive === "boolean" ? isActive : false
    const safeShowOnHomepage = typeof showOnHomepage === "boolean" ? showOnHomepage : false
    // If user is turning ON "show on homepage"
    if (safeShowOnHomepage) {
      const otherHomepageCoupons = coupons.filter(
        (c) => c.id !== selectedCoupon.id && c.show_on_homepage
      );

      // Turn off show_on_homepage for all others
      for (const coupon of otherHomepageCoupons) {
        await couponsUpdatedApi(
          coupon.id,
          coupon.type,
          coupon.code,
          coupon.discount,
          coupon.maxRedeemCount,
          coupon.createdAt,
          coupon.expiresAt,
          coupon.name,
          coupon.description,
          false, // force show_on_homepage to false
          created_by,
          typeof coupon.is_active === "boolean" ? coupon.is_active : false,
          token
        );
      }
    }

    // Now update the selected coupon
    const response = await couponsUpdatedApi(
      selectedCoupon.id,
      selectedCoupon.type,
      selectedCoupon.code,
      selectedCoupon.discount,
      selectedCoupon.maxRedeemCount,
      selectedCoupon.createdAt,
      selectedCoupon.expiresAt,
      selectedCoupon.name,
      selectedCoupon.description,
      safeShowOnHomepage,
      created_by,
      safeIsActive,
      token
    );

      if(response.body.message==="Invalid or expired token"){
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again");
        router.push("/");
        return;
      }

    if (response?.status === 200) {
      fetchRoles(); // Refresh table
      toast.success("Updated successfully");
    }
  };

  return (
    <div className='min-h-screen w-full flex flex-col lg:items-center'>
      <div className='flex justify-center items-center mx-auto w-full mb-4 lg:gap-8 gap-3 '>
        <div className='md:w-[60%] w-[90%] relative'></div>
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
          ref={formRef}
          onSubmit={handleCreateOrUpdate}
          className='bg-white lg:w-[100%] order-[1px] w-full rounded-lg shadow-md lg:p-6'
        >
          <div className='flex lg:flex-row flex-col p-4 items-center w-full lg:gap-8 gap-4 justify-between'>
            {/* <select
              name='role'
              onChange={(e) =>
                setNewRole((prev) => ({ ...prev, type: e.target.value }))
              }
              value={newRole?.type}
              className='px-3 h-12 rounded-md bg-[#F3F3F3]  w-full'
              required
            > */}
            {/* <option value=''>Select Coupons Type</option>
              <option>Flat</option>
              <option>Percentage</option>
            </select> */}
            <div className='bg-[#F3F3F3] relative flex p-3 rounded-md w-full'>
              <RiCoupon4Fill color='#A5B7C0' size={26} />
              <input
                type='text'
                // placeholder="Enter Code"
                value={newRole.code}
                required
                onChange={(e) =>
                  setNewRole((prev) => ({ ...prev, code: e.target.value }))
                }
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
              />
              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                Enter Code
              </label>
            </div>
          </div>
          <div className='flex lg:flex-row flex-col p-4 items-center w-full lg:gap-8 gap-4 justify-between'>
            <div className='bg-[#F3F3F3] relative flex p-3 rounded-md w-full'>
              <RiCoupon4Fill color='#A5B7C0' size={26} />
              <input
                type='text'
                // placeholder="Enter Code"
                value={newRole.title}
                required
                onChange={(e) =>
                  setNewRole((prev) => ({ ...prev, title: e.target.value }))
                }
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
              />
              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                Enter Title
              </label>
            </div>
            {/* <div className='bg-[#F3F3F3] relative flex p-3 rounded-md w-full'>
              <RiCoupon4Fill color='#A5B7C0' size={26} />
              <input
                type='text'
                // placeholder="Enter Code"
                value={newRole.description}
                required
                onChange={(e) =>
                  setNewRole((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
              />
              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                Enter Description
              </label>
            </div> */}
          </div>
          <div className='flex lg:flex-row flex-col p-4 items-center w-full lg:gap-8 gap-4 justify-between'>
            <div className='bg-[#F3F3F3] relative flex p-3 rounded-md lg:w-1/2 w-full'>
              <IoIosWallet color='#A5B7C0' size={26} />
              <input
                type='number'
                // placeholder="Enter value"
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
                Enter percent
              </label>
            </div>
            <div className='flex lg:flex-row flex-col lg:w-1/2 w-full justify-between items-center gap-3'>
              <div className='bg-[#F3F3F3] relative flex p-3 h-12 rounded-md lg:w-1/2 w-full'>
                <FaCalendarDays color='#A5B7C0' size={26} />
                <DatePicker
                  selected={
                    newRole.valid_from ? new Date(newRole.valid_from) : null
                  }
                  onChange={(date) =>
                    setNewRole((prev) => ({ ...prev, valid_from: date }))
                  }
                  showTimeSelect
                  dateFormat="yyyy-MM-dd'T'HH:mm"
                  // placeholderText="Select Valid From"
                  className='peer bg-[#F3F3F3]  focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out cursor-pointer'
                />
                <label
                  htmlFor='tag'
                  className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                >
                  Select Valid From
                </label>
              </div>
              <div className='bg-[#F3F3F3] relative flex p-3 h-12 rounded-md lg:w-1/2 w-full'>
                <FaCalendarDays color='#A5B7C0' size={26} />
                <DatePicker
                  selected={
                    newRole.valid_till ? new Date(newRole.valid_till) : null
                  }
                  onChange={handleValidTillChange}
                  showTimeSelect
                  dateFormat="yyyy-MM-dd'T'HH:mm"
                  // placeholderText="Select Valid Till"
                  className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out cursor-pointer '
                />
                <label
                  htmlFor='tag'
                  className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                >
                  Select Valid Till
                </label>
              </div>
            </div>
          </div>
          <div className='flex lg:flex-row flex-col p-4 items-center w-full lg:gap-8 gap-4'>
            <div className='bg-[#F3F3F3] relative flex p-3 rounded-md lg:w-1/2 w-full'>
              <IoIosWallet color='#A5B7C0' size={26} />
              <input
                type='text'
                // placeholder="Enter Usage limit"
                value={newRole.usage_limit}
                // required
                onChange={(e) =>
                  setNewRole((prev) => ({
                    ...prev,
                    usage_limit: e.target.value,
                  }))
                }
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
              />
              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                Enter Usage limit
              </label>
            </div>
            <div className='flex gap-2  h-12 w-full'>
              <div className='flex  items-center justify-center gap-2 bg-[#F3F3F3] rounded-lg h-12 w-46 p-4'>
                <label className='text-sm text-[#577C8E] px-3'>
                  Is Active?
                </label>
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
              <div className='flex  items-center justify-center gap-2 bg-[#F3F3F3] rounded-lg h-12 w-46 p-4'>
                <label className='text-sm text-[#577C8E] px-3'>
                  Show On Homepage?
                </label>
                <div className='switch'>
                  <label>
                    <input
                      type='checkbox'
                      checked={newRole.show_on_homepage}
                      onChange={(e) =>
                        setNewRole((prev) => ({
                          ...prev,
                          show_on_homepage: e.target.checked,
                        }))
                      }
                    />
                    <span className='slider'></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className='flex justify-center items-center lg:gap-8 gap-4 mb-3'>
            <div className='mt-2 flex gap-3 justify-center items-center'>
              <button
                type='submit'
                className={`text-lg lg:w-[230px] w-full mt-3  ${isEdit ? "bg-green-500" : "bg-admin-buttonprimary"
                  } text-white px-6 lg:py-3 py-2 rounded-md`}
              >
                {isEdit ? "Update" : "Create"}
              </button>
              {isEdit ? (
                <>
                  {" "}
                  <button
                    onClick={handlecCancleEdit}
                    className='text-lg lg:w-[230px] mt-3 bg-admin-buttonprimary text-white px-6 lg:py-3 py-2 rounded-md'
                  >
                    Cancel
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </form>
      )}
      <div className='bg-white shadow-md rounded-lg w-full flex justify-center items-center mt-6'>
        <div className='overflow-x-auto w-full'>
          <table className='w-full border-collapse'>
            <thead>
              <tr className='bg-admin-secondary text-admin-text-primary font-semibold cursor-pointer'>
                <th
                  className='p-3 text-center cursor-pointer transition-colors duration-200'
                // onClick={() => setIsCouponTypeFilterPopupOpen(true)}
                >
                  <div className='flex items-center justify-start space-x-1'>
                    <span className=''>
                      {" "}
                      {isfilterCouponType === ""
                        ? "Coupons Type"
                        : isfilterCouponType}
                    </span>
                    {/* <span className='flex flex-col leading-none'>
                      <FaAngleDown className='text-admin-text-primary' />
                    </span> */}
                  </div>
                </th>
                <th className='py-3 px-4 text-left'>title</th>
                <th className='py-3 px-4 text-left'>Code</th>
                <th className='py-3 px-4 text-end'>Value</th>
                <th
                  className={`py-3 px-4 text-start cursor-pointer transition-colors duration-200 ${ordering === "valid_from" || ordering === "-valid_from"
                    ? "text-admin-text-primary"
                    : "text-admin-text-primary"
                    }`}
                  onClick={() => handleOrdering("valid_from")}
                >
                  <div className='flex items-center justify-start space-x-0'>
                    <span className=''>Validity From</span>
                    <span className='flex flex-col leading-none'>
                      <MdArrowDropUp
                        className={`w-7 h-7 transform -mb-1 ${ordering === "valid_from"
                          ? "text-admin-text-primary"
                          : "text-admin-text-primary"
                          }`}
                      />
                      <IoMdArrowDropdown
                        className={`w-7 h-7 transform -mt-3 ${ordering === "-valid_from"
                          ? "text-admin-text-primary"
                          : "text-admin-text-primary"
                          }`}
                      />
                    </span>
                  </div>
                </th>
                <th className='py-3 px-4 text-left'>Validity To</th>
                <th className='py-3 px-4 text-end'>Usage Limit</th>
                <th className='py-3 px-4 text-end'>Redeem Count</th>
                <th
                  className='p-3 text-center cursor-pointer transition-colors duration-200'
                  onClick={() => setIsActiveInactiveFilterPopup(true)}
                >
                  <div className='flex items-center justify-center space-x-1'>
                    <span className=''>
                      {isfiltervalue === "" ? "Status" : isfiltervalue}
                    </span>
                    <span className='flex flex-col leading-none'>
                      <FaAngleDown className='text-admin-text-primary' />
                    </span>
                  </div>
                </th>
                <th className='py-3 px-4 text-left'>Homepage</th>
                <th className='py-3 px-4 text-left'>Action</th>
                <th className='py-3 px-4 text-left'>Info</th>
              </tr>
            </thead>
            <tbody>
              {coupons?.map((data: any, index: any) => (
                <tr key={index} className='border-b-[1px] hover:bg-purple-100 '>
                  <td className='py-3 px-4 text-left '>Percentage</td>
                  <th className='py-3 px-4 text-left'>{data?.name}</th>
                  <td className='py-3 px-4 text-left'>{data?.code}</td>
                  <td className='py-3 px-4 text-right'>{data?.discount}</td>
                  <td className='py-3 px-4 text-left'>{formatIST(data?.createdAt)}</td>
                  <td className='py-3 px-4 text-left'>{formatIST(data?.expiresAt)}</td>
                  <td className='py-3 px-4 text-right'>{data?.maxRedeemCount}</td>
                  <td className='py-3 px-4 text-right'>{data?.redeemCount} </td>
                  <td className='p-3 text-center'>
                    <div className='flex flex-col items-center'>
                      <Switch
                        checked={Boolean(data?.is_active)}
                        onChange={() => activeHandler(data, !data?.is_active, Boolean(data?.show_on_homepage))}
                        className={`${data?.is_active ? "bg-green-500" : "bg-gray-300"
                          } relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-200 ease-in-out`}
                      >
                        <span
                          className={`${data?.is_active ? "translate-x-6" : "translate-x-1"
                            } inline-block w-6 h-6 bg-white rounded-full transition-transform duration-200 ease-in-out`}
                        />
                      </Switch>
                    </div>
                  </td>
                  <td className='p-3 text-center'>
                    <div className='flex flex-col items-center'>
                      <Switch
                        checked={Boolean(data?.show_on_homepage)}
                        onChange={() => activeHandler(data, Boolean(data?.is_active), !data?.show_on_homepage)}
                        className={`${data?.show_on_homepage ? "bg-green-500" : "bg-gray-300"
                          } relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-200 ease-in-out`}
                      >
                        <span
                          className={`${data?.show_on_homepage ? "translate-x-6" : "translate-x-1"
                            } inline-block w-6 h-6 bg-white rounded-full transition-transform duration-200 ease-in-out`}
                        />
                      </Switch>
                    </div>
                  </td>
                  <td className='py-3 px-4 text-center gap-4'>
                    <div className='flex justify-center items-center'>
                      <button
                        onClick={() =>
                          handleEdit({
                            id: data?.id,
                            type: data?.type,
                            code: data?.code,
                            value: data?.discount,
                            usage_limit: data?.maxRedeemCount,
                            valid_from: data?.createdAt,
                            valid_till: data?.expiresAt,
                            title: data?.name,
                            description: data?.description,
                            show_on_homepage: data?.show_on_homepage,
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
                  <td className='py-3 px-4 text-center'>
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
          role={coupons.find((data) => data.id === info)}
          isOpenInfoPopup={isOpenInfoPopup}
          setIsInfoPopup={setIsInfoPopup}
          setIsOpen={setIsInfoPopup}
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

      {isCouponTypeFilterPopupOpen && (
        <CouponTypeFilterPopup
          isCouponTypeFilterPopupOpen={isCouponTypeFilterPopupOpen}
          setIsCouponTypeFilterPopupOpen={setIsCouponTypeFilterPopupOpen}
          handleCouponTypefilter={handleCouponTypefilter}
          isfilterCouponType={isfilterCouponType}
        />
      )}
      {isOpenDeletePopup && (
        <DeleteCouponComponent
          isOpenDeletePopup={isOpenDeletePopup}
          handleDeleteConform={() => handleDeleteConform(selectedRoleId)}
          setIsLogoutDialogOpen={setIsLogoutPopup}
          setIsOpen={setIsLogoutPopup}
        />
      )}
    </div>
  );
};

export default CouponsFormComponent;
