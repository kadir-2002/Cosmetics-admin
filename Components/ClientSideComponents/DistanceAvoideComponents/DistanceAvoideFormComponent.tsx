"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { TbEdit } from "react-icons/tb";
import { GoSearch } from "react-icons/go";
import { AiOutlineClose } from "react-icons/ai";
import RoleInfoPopup from "../RoleFormComponents/RoleInfoPopup";
import {
  createDistanceApi,
  distanceDataApi,
  distanceDeleteApi,
  UpdateDistanceApi,
} from "@/apis/distanceavoideApi";
import { MdDelete } from "react-icons/md";
import { RiPinDistanceFill } from "react-icons/ri";
import { FaMoneyBill } from "react-icons/fa";
import DistanceDeletePopComponent from "./DistanceDeletePopComponent";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { clearUserDetails } from "@/redux/userSlice";
interface Role {
  id: "";
  distance: "";
  delivery: "";
}

const DistanceAvoideComponent = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [newRole, setNewRole] = useState({ distance: "", delivery: "" });
  const [isEdit, setIsEdit] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [isOpenDeletePopup, setIsLogoutPopup] = useState<boolean>(false);
  const [isOpenInfoPopup, setIsInfoPopup] = useState<boolean>(false);
  const createdBy = useSelector((state: any) => state?.user?.details?.id);
  const [searchText, setSearchText] = useState<string>("");
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [info, setinfo] = useState("");
  const token = useSelector((state: any) => state?.user?.token);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleCreateOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { distance, delivery } = newRole;
    const numericDistance = Number(distance);
    const numericDelivery = Number(delivery);

    try {
      if (isEdit) {
        const response = await UpdateDistanceApi(
          selectedRoleId,
          numericDistance,
          numericDelivery,
          createdBy,
          token
        );
        if (response?.status === 401) {
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
          return;
        }
        if (response?.status === 200) {
          toast.success("Distance updated successfully");
          setIsEdit(false);
        }
      } else {
        const response = await createDistanceApi(
          numericDistance,
          numericDelivery,
          createdBy,
          token
        );
        if (response?.status === 401) {
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
          return;
        }
        if (response?.error === "group with this name already exists") {
          toast.error("User already exists");
        } else if (response?.status === 201) {
          toast.success("Distance created successfully");
        }
      }
      fetchRoles();
      setOpenForm(false);
      setNewRole({ distance: "", delivery: "" });
    } catch (error) {
      console.error("Error creating or updating role:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await distanceDataApi(token);
      //
      if (response?.detail === "Invalid token") {
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again");
        router.push("/");
        return;
      }
      if (response?.delivery_settings) {
        setRoles(response?.delivery_settings || []);
      }
    } catch (error) {}
  };
  useEffect(() => {
    fetchRoles();
  }, []);

  const handleDelete = async (id: string) => {
    setSelectedRoleId(id);
    setIsLogoutPopup(true);
  };

  const handleDeleteConform = async (id: string) => {
    try {
      const response = await distanceDeleteApi(id, createdBy, token);
      if (response?.status === 401) {
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again");
        router.push("/");
        return;
      }
      if (response?.status === 204) {
        toast.success("distance deleted successfully");
        setIsLogoutPopup(false);
        fetchRoles();
      } else {
        console.error("Unexpected response format:", response);
      }
    } catch (error) {
      console.error("Failed to delete role:");
    }
  };

  const handleEdit = (role: {
    id: string;
    distance: string;
    delivery: string;
  }) => {
    setOpenForm(true);
    setNewRole({ distance: role?.distance, delivery: role?.delivery });
    setIsEdit(true);
    setSelectedRoleId(role.id);
  };
  const handlecCancleEdit = () => {
    setOpenForm(false);
    setIsEdit(false);
    setNewRole({ distance: "", delivery: "" });
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };
  const clearSearch = () => {
    setSearchText("");
  };
  const handleopenform = () => {
    setOpenForm(!openForm);
  };
  const handleOpenInfo = (id: string) => {
    setIsInfoPopup(true);
    setinfo(id);
  };

  return (
    <div className='w-full flex flex-col lg:items-center'>
      <div className='flex justify-center items-center mx-auto w-full mb-4 lg:gap-8 gap-3 '>
        {roles.length === 0 ? (
          <>
            <div
             onClick={handleopenform}
             >
              {openForm ? (
                <button type='button' className='button h-12'>
                  <span className='button__text'>Close</span>
                  <span className='button__icon'>
                    <line y2='12' y1='12' x2='19' x1='5'>
                      -
                    </line>
                  </span>
                </button>
              ) : (
                <button type='button' className='button h-12'>
                  <span className='button__text'>Add </span>
                  <span className='button__icon'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      viewBox='0 0 24 24'
                      strokeLinejoin='round'
                      strokeLinecap='round'
                      stroke='currentColor'
                      height='24'
                      fill='none'
                      className='svg'
                    >
                      <line y2='19' y1='5' x2='12' x1='12'></line>
                      <line y2='12' y1='12' x2='19' x1='5'></line>
                    </svg>
                  </span>
                </button>
              )}
            </div>
          </>
        ) : null}
      </div>
      {openForm && (
        <form
          onSubmit={handleCreateOrUpdate}
          className='bg-white lg:max-w-screen-xl border-[1px] w-full rounded-lg shadow-md lg:p-6'>
          <div className='grid lg:grid-cols-2 grid-cols-1 gap-6 mb-6 p-5'>
            <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm'>
              <RiPinDistanceFill color='#A5B7C0' size={26} />
              <input
                type='number'
                // placeholder="Enter Delivery Distance in KM"
                value={newRole.distance}
                required
                onChange={(e) =>
                  setNewRole((prev) => ({ ...prev, distance: e.target.value }))
                }
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
              />
              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                Enter Delivery Distance in KM
              </label>
            </div>
            <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm'>
              <FaMoneyBill color='#A5B7C0' size={26} />
              <input
                type='number'
                // placeholder="Enter Delivery Charge"
                value={newRole.delivery}
                required
                onChange={(e) =>
                  setNewRole((prev) => ({ ...prev, delivery: e.target.value }))
                }
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
              />
              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                Enter Delivery Charge
              </label>
            </div>
          </div>
          <div className='flex justify-center items-center lg:gap-12 gap-3  mb-3'>
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
      <div className='bg-white shadow-md rounded-lg w-full flex mt-12 justify-center items-center'>
        <div className='overflow-x-auto w-full'>
          <table className='w-full'>
            <thead>
              <tr className='bg-admin-secondary text-admin-text-primary font-semibold'>
                <th className='py-3 px-4 text-center lg:px-3'>
                  Maximum Delivery Distance(Km)
                </th>
                <th className='py-3 px-4 text-center'>
                  Delivery Charge for Maximum Delivery Distance
                </th>
                <th className='py-3 px-4'>Action</th>
                <th className='py-3 px-4'>Info</th>
              </tr>
            </thead>
            <tbody>
              {roles?.map((role: any, index: any) => (
                <tr key={index} className='border-b-[1px] hover:bg-blue-100 '>
                  <td className='py-3 px-4 text-center'>
                    {role?.maximum_delivery_distance}
                  </td>
                  <td className='py-3 px-4 text-center'>
                    {role?.delivery_charge_for_maximum_delivery_distance}
                  </td>

                  <td className='py-3 px-4 flex justify-center gap-4'>
                    <button
                      onClick={() =>
                        handleEdit({
                          id: role?.id,
                          distance: role?.maximum_delivery_distance,
                          delivery:
                            role?.delivery_charge_for_maximum_delivery_distance,
                        })
                      }
                      className='text-orange-500'
                    >
                      <TbEdit size={26} />
                    </button>
                    <button
                      onClick={() => handleDelete(role?.id)}
                      className='text-red-500'
                    >
                      <MdDelete size={26} />
                    </button>
                  </td>
                  <td className='py-3 px-4 text-center'>
                    <button
                      className='text-blue-500'
                      aria-label='Info'
                      onClick={() => handleOpenInfo(role?.id)}
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
          role={roles.find((role) => role.id === info)}
          isOpenInfoPopup={isOpenInfoPopup}
          setIsInfoPopup={setIsInfoPopup}
          setIsOpen={setIsInfoPopup}
        />
      )}
      {isOpenDeletePopup && (
        <DistanceDeletePopComponent
          isOpenDeletePopup={isOpenDeletePopup}
          handleDeleteConform={() => handleDeleteConform(selectedRoleId)}
          setIsLogoutDialogOpen={setIsLogoutPopup}
          setIsOpen={setIsLogoutPopup}
        />
      )}
    </div>
  );
};

export default DistanceAvoideComponent;
