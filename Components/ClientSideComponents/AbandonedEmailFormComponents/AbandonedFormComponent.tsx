"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TbEdit } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import { RiArticleFill, RiSubtractFill } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";
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
  abandonedAllDataApi,
  abandonedCreateApi,
  abandonedDeleteApi,
  abandonedUpdatedApi,
} from "@/apis/abandonedemailApi";
import AbandonedDeleteComponent from "./AbandonedDeleteComponent";
import { FiMinus, FiPlus } from "react-icons/fi";

type data = {
  id: number;
  email_send_time: string;
  recovery_discount_percent: string;
  discount_expiry_time: string;
  is_active: false;
  created_by: string;
  updated_at: string;
  updated_by: string;
};

const AbandonedFormComponent = () => {
  const [data, setData] = useState<data[]>([]);
  const [newUser, setNewUser] = useState({
    id: "",
    sendTime: "",
    discount: "",
    expireTime: "",
    is_active: false,
  });
  const [isOpenDeletePopup, setIsLogoutPopup] = useState<boolean>(false);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isUserInfo, setIsuserInfo] = useState<boolean>(false);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [isActiveInactiveFitlerPopup, setIsActiveInactiveFilterPopup] =
    useState<boolean>(false);
  const [isfiltervalue, setfiltervalue] = useState<string>("");
  const [ordering, setOrdering] = useState("sequence_number");
  const [isinfo, setIsinfo] = useState<number>();
  const token = useSelector((state: any) => state?.user?.token);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleCreateOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { id, sendTime, discount, expireTime, is_active } = newUser;
    try {
      if (isEdit) {
        const response = await abandonedUpdatedApi(
          id,
          sendTime,
          discount,
          expireTime,
          is_active,
          token
        );
        if (response?.status === 200) {
          toast.success("Updated successfully");
          setIsEdit(false);
          fetchdata();
          setOpenForm(false);
          setNewUser({
            id: "",
            sendTime: "",
            discount: "",
            expireTime: "",
            is_active: false,
          });
        } else if (response?.data?.message === "Invalid or expired token") {
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again");
        router.push("/");
      }
    } else {
      const response = await abandonedCreateApi(
        sendTime,
        discount,
        expireTime,
        is_active,
        token
      );
      if (response?.status === 201) {
        toast.success("Created successfully!");
        fetchdata();
        setOpenForm(false);
        setNewUser({
          id: "",
          sendTime: "",
          discount: "",
          expireTime: "",
          is_active: false,
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
const handleEdit = (email: {
  id: string;
  hours_after_email_is_sent: string;
  discount_to_be_given_in_percent: string;
  hours_after_email_cart_is_emptied: string;
  is_active: boolean;
  created_by: string;
}) => {
  setOpenForm(true);
  setNewUser({
    id: email?.id,
    sendTime: email?.hours_after_email_is_sent,
    discount: email?.discount_to_be_given_in_percent,
    expireTime: email?.hours_after_email_cart_is_emptied,
    is_active: email?.is_active,
  });
  setIsEdit(true);
};

const isActive =
  isfiltervalue === "Active"
    ? true
    : isfiltervalue === "Inactive"
      ? false
      : undefined;
const fetchdata = async () => {
  try {
    const apiParams: { ordering: string; isActive?: boolean } = {
      ordering,
      isActive,
    };
    const response = await abandonedAllDataApi(apiParams, token);
    if (response?.detail === "Invalid token") {
      dispatch(clearUserDetails());
      toast.error("Session Expired, Please Login Again");
      router.push("/");
    } else if (response?.results) {
      setData(response?.results);
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
  fetchdata();
}, [ordering, isfiltervalue]);

const handleDelete = async (id: string) => {
  setSelectedRoleId(id);
  setIsLogoutPopup(true);
};
const handleDeleteConform = async (id: string) => {
  try {
    const response = await abandonedDeleteApi(id, token);
    if (response?.success) {
      toast.success("Deleted successfully");
      setIsLogoutPopup(false);
      fetchdata();
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
    sendTime: "",
    discount: "",
    expireTime: "",
    is_active: false,
  });
};

const handleopenform = () => {
  setOpenForm(!openForm);
  setIsEdit(false);
  setNewUser({
    id: "",
    sendTime: "",
    discount: "",
    expireTime: "",
    is_active: false,
  });
};
const handleOpenInfo = (id: number) => {
  setIsuserInfo(true);
  setIsinfo(id);
  console.log("info----->>", isinfo);
};

const activeHandler = async (banner: any, is_active: boolean) => {
  const response = await abandonedUpdatedApi(
    banner?.id,
    banner?.name,
    banner?.sequence_number,
    banner?.link,
    is_active,
    token
  );
  if (response?.status === 200) {
    fetchdata();
  } else if (response?.data?.message === "Invalid or expired token") {
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
                value={newUser.sendTime}
                onChange={(e) =>
                  setNewUser((prev) => ({
                    ...prev,
                    sendTime: e.target.value,
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
                Enter Email Send Time In Hr
              </label>
            </div>
          </div>
          <div className='relative w-full bg-[#F3F3F3] rounded-lg shadow-sm'>
            <div className='flex bg-[#F3F3F3] p-3  h-12 rounded-md'>
              <RiArticleFill color='#A5B7C0' size={26} />
              <input
                type='number'
                name='percentage'
                value={newUser.discount}
                onChange={(e) =>
                  setNewUser((prev) => ({
                    ...prev,
                    discount: e.target.value,
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
                Enter Discount Percent
              </label>
            </div>
          </div>
          <div className='relative w-full bg-[#F3F3F3] rounded-lg shadow-sm'>
            <div className='flex bg-[#F3F3F3] p-3  h-12 rounded-md'>
              <RiArticleFill color='#A5B7C0' size={26} />
              <input
                type='number'
                name='expiredtime'
                value={newUser.expireTime}
                onChange={(e) =>
                  setNewUser((prev) => ({
                    ...prev,
                    expireTime: e.target.value,
                  }))
                }
                required
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
              />
              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                Enter Discount Expiry Time In Hr
              </label>
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
            className={`text-lg lg:w-[200px] mt-3  ${isEdit ? "bg-green-500" : "bg-admin-buttonprimary"
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
      <div className=' overflow-x-auto w-full'>
        <table className='w-full border-collapse'>
          <thead className='bg-admin-secondary text-admin-text-primary lg:text-lg text-sm'>
            <tr>
              <th
                className='text-center cursor-pointer transition-colors duration-200 '
                onClick={() => handleOrdering("sequence_number")}
              >
                Email Send Time
              </th>
              <th className='p-3 text-center '>Discount Percent </th>
              <th className='p-3 text-center '>Discount Expiry Time </th>
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
            {data.map((data: any, index: any) => (
              <tr key={index} className='border-b'>
                <td className='p-3 text-center'>{data?.hours_after_email_is_sent} Hr</td>
                <td className='p-3 text-center lg:px-7 capitalize'>
                  {data?.discount_to_be_given_in_percent} %
                </td>
                <td className='p-3 capitalize text-center'>
                  {data?.hours_after_email_cart_is_emptied} Hr
                </td>
                <td className='p-3 text-center'>
                  <div className='text-center'>
                    <Switch
                      checked={data?.is_active}
                      onChange={() => activeHandler(data, !data?.is_active)}
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
                  <div className='flex justify-center items-center space-x-3'>
                    <button
                      onClick={() => handleEdit(data)}
                      className='text-orange-500'
                    >
                      <TbEdit size={28} />
                    </button>
                    <button
                      onClick={() => handleDelete(data?.id)}
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
                      handleOpenInfo(data?.id);
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
          <AbandonedDeleteComponent
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
          user={data.find((user) => user.id === isinfo)}
          isUserInfo={isUserInfo}
          setIsuserInfo={setIsuserInfo}
          setIsOpen={setIsuserInfo}
        />
      )}
    </div>
  </div>
);
};

export default AbandonedFormComponent;
