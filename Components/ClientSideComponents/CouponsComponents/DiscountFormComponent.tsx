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
  createDiscountApi,
  discountAllDataApi,
  discountDeleteApi,
  discountUpdatedApi,
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

interface Discount {
  id: string;
  minimum_spend: string;
  discount_percentage: string;
  discount_price: any;
  isActive: boolean;
}

const DiscountFormComponent = () => {
  const [discount, setDiscount] = useState<Discount[]>([]);
  const [newRole, setNewRole] = useState({
    title:"",
    minimum_spend: "",
    discount_percentage: "",
    discount_price: "",
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
  const [ordering, setOrdering] = useState("sequence_number");
  const token = useSelector((state: any) => state?.user?.token);
  const dispatch = useDispatch();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const currency = useSelector((state: any) => state?.user?.details?.currency_symbol);

  const handleCreateOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { title,minimum_spend, discount_percentage, discount_price, isActive } =
      newRole;
      if (
        (!discount_percentage || discount_percentage === "0") &&
        (!discount_price || discount_price === "0")
      ) {
        toast.error("Please provide either a Discount Percentage or Discount Price.");
        return;
      }
    try {
      if (isEdit) {
        const response = await discountUpdatedApi(
          selectedRoleId,
          title,
          minimum_spend,
          discount_percentage,
          discount_price,
          isActive,
          token
        );

        if (response?.status === 401) {
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
          return;
        }else if (response?.status === 200) {
          toast.success("Discount updated successfully");
          setIsEdit(false);
        }else if(response?.data?.error === "This tax already exists"){
          toast.error("Discount already exists");
        }
      } else {
        const response = await createDiscountApi(
          title,
          minimum_spend,
          discount_percentage,
          discount_price,
          isActive,
          token
        );
        if (response?.message === "Missing required fields: name, discount, expiresAt, code, maxRedeemCount") {
           toast.error("Missing required fields: name, discount, expiresAt, code, maxRedeemCount")
          return
        }
        if(response.detail === "Invalid token"){
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
          return;
        }
        if (response?.data?.error === "This Spending Discount already exists") {
          toast.error("Discount already exists");
        } else if (response?.status === 200) {
          toast.success("Discount created successfully");
        }
      }
      fetchDiscount();
      setOpenForm(false);
      setNewRole({
        title:"",
        minimum_spend: "",
        discount_percentage: "",
        discount_price: "",
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
  const fetchDiscount = async () => {
    try {
      const response = await discountAllDataApi(
        token,
        isfilterCouponType,
        ordering,
        isActive
      );
      if (response?.detail === "Invalid token") {
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again");
        router.push("/");
        return;
      }
      if (response?.spendingdiscount) {
        setDiscount(response?.spendingdiscount || []);
      }
    } catch (error) {}
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
    fetchDiscount();
  }, [isfiltervalue, isfilterCouponType, ordering]);

  const handleDelete = async (id: string) => {
    setSelectedRoleId(id);
    setIsLogoutPopup(true);
  };

  const handleDeleteConform = async (id: string) => {
    try {
      const response = await discountDeleteApi(id, token);
      if (response?.success) {
        toast.success("Discount deleted successfully");
        setIsLogoutPopup(false);
        fetchDiscount();
      } else {
        console.error("Unexpected response format:", response);
      }
    } catch (error) {
      console.error("Failed to delete role:");
    }
  };

  const handleEdit = (role: {
    id: string;
    title:string;
    minimum_spend: string;
    discount_percentage: string;
    discount_price: string;
    is_active: boolean;
  }) => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setOpenForm(true);
    setNewRole({
      title:role?.title,
      minimum_spend: role?.minimum_spend,
      discount_percentage: role?.discount_percentage,
      discount_price: role?.discount_price,
      isActive: role?.is_active,
    });
    setIsEdit(true);
    setSelectedRoleId(role.id);
  };

  const handlecCancleEdit = () => {
    setOpenForm(false);
    setIsEdit(false);
    setNewRole({
      title:"",
      minimum_spend: "",
      discount_percentage: "",
      discount_price: "",
      isActive: false,
    });
  };

  const handleopenform = () => {
    setOpenForm(!openForm);
    setIsEdit(false);
    setNewRole({
      title:"",
      minimum_spend: "",
      discount_percentage: "",
      discount_price: "",
      isActive: false,
    });
  };

  const handleOpenInfo = (id: string) => {
    setIsInfoPopup(true);
    setinfo(id);
  };
  const activeHandler = async (
    data: any,
    isActive: boolean,
    show_on_homepage: boolean
  ) => {
    const response = await discountUpdatedApi(
      data?.id,
      data?.title,
      data?.minimum_spend,
      data?.discount_percentage,
      data?.discount_price,
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
      fetchDiscount();
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
          className='bg-white lg:w-[100%] order-[1px] w-full rounded-lg shadow-md lg:p-6 border-[1px]'
        >
          <div className='grid grid-cols-2 p-4 items-center w-full lg:gap-8 gap-4 justify-between'>
          <div className='bg-[#F3F3F3] relative flex p-3 rounded-md w-full'>
              <RiCoupon4Fill color='#A5B7C0' size={26} />
              <input
                type='text'
                value={newRole.title}
                required
                onChange={(e) =>
                  setNewRole((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
              />
              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                Enter Name
              </label>
            </div>
            <div className='bg-[#F3F3F3] relative flex p-3 rounded-md w-full'>
              <RiCoupon4Fill color='#A5B7C0' size={26} />
              <input
                type='number'
                value={newRole.minimum_spend}
                required
                onChange={(e) =>
                  setNewRole((prev) => ({
                    ...prev,
                    minimum_spend: e.target.value,
                  }))
                }
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
              />
              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                Enter Minimum Spend
              </label>
            </div>
            <div className='bg-[#F3F3F3] relative flex p-3 rounded-md w-full'>
              <RiCoupon4Fill color='#A5B7C0' size={26} />
              <input
                type='text'
                value={newRole.discount_percentage}
                required
                onChange={(e) => {
                  const value = e.target.value;
                  setNewRole((prev) => ({
                    ...prev,
                    discount_percentage: value,
                    discount_price: value ? "0" : prev.discount_price,
                  }));
                }}
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
              />

              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                Enter Discount Percentage
              </label>
            </div>
            <div className='bg-[#F3F3F3] relative flex p-3 rounded-md w-full'>
              <IoIosWallet color='#A5B7C0' size={26} />
              <input
                type='text'
                value={newRole.discount_price}
                required
                onChange={(e) => {
                  const value = e.target.value;
                  setNewRole((prev) => ({
                    ...prev,
                    discount_price: value,
                    discount_percentage: value ? "0" : prev.discount_percentage,
                  }));
                }}
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
              />

              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                Enter Discount Price
              </label>
            </div>
            <div className='flex  items-center justify-between gap-2 bg-[#F3F3F3] rounded-lg w-full p-3'>
              <label className='text-sm text-[#577C8E] px-3'>Is Active?</label>
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
          </div>
          <div className='flex justify-center items-center lg:gap-8 gap-4 mb-3'>
            <div className='mt-2 flex gap-3 justify-center items-center'>
              <button
                type='submit'
                className={`text-lg lg:w-[230px] w-full mt-3  ${
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
              <th className='py-3 px-4 text-center'>Name</th>
                <th className='py-3 px-4 text-left'>Minimum Spend</th>
                <th className='py-3 px-4 text-left'>Discount Percentage</th>
                <th className='py-3 px-4 text-left'>Discount Price</th>
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
                <th className='py-3 px-4 text-center'>Action</th>
                <th className='py-3 px-4 text-left'>Info</th>
              </tr>
            </thead>
            <tbody>
              {discount?.map((data: any, index: any) => (
                <tr key={index} className='border-b-[1px] hover:bg-blue-100 '>
                   <th className='py-3 px-4 text-center'>
                    {data?.title}
                  </th>
                  <td className='py-3 px-4 text-left '>
                    {data?.minimum_spend} {currency}
                  </td>
                  <th className='py-3 px-4 text-left'>
                    {data?.discount_percentage}%
                  </th>
                  <td className='py-3 px-4 text-left'>
                    {data?.discount_price}{currency}
                  </td>
                  <td className='p-3 text-center'>
                    <div className='flex flex-col items-center'>
                      <Switch
                        checked={data?.is_active}
                        onChange={() =>
                          activeHandler(
                            data,
                            !data?.is_active,
                            data?.show_on_homepage
                          )
                        }
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
                  <td className='py-3 px-4 text-center gap-4'>
                    <div className='flex justify-center items-center'>
                      <button
                        onClick={() => handleEdit(data)}
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
          role={discount.find((data) => data.id === info)}
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

export default DiscountFormComponent;
