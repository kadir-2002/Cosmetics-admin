"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { BsPuzzleFill } from "react-icons/bs";
import { Switch } from "@headlessui/react";
import RoleInfoPopup from "../RoleFormComponents/RoleInfoPopup";
import {
  createTaxApi,
  taxAllDataApi,
  taxDeleteApi,
  taxUpdatedApi,
} from "@/apis/taxFormApi";
import TaxDeleteComponent from "./TaxDeleteComponent";
import { useRouter } from "next/navigation";
import { clearUserDetails } from "@/redux/userSlice";
import { FiMinus, FiPlus } from "react-icons/fi";

interface Role {
  id: string;
  name: string;
  isActive: boolean;
}

const TaxFormComponent = () => {
  const [taxs, setTaxs] = useState<Role[]>([]);
  const [newRole, setNewRole] = useState({
    name: "",
    percentage: 0,
    isActive: false,
  });
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
    const { name, percentage, isActive } = newRole;
    if (!name.trim()) {
      return;
    }
    try {
      if (isEdit) {
        const response = await taxUpdatedApi(
          selectedRoleId,
          name,
          percentage,
          isActive,
          createdBy,
          token
        );
        if (
          response.status === 401 ||
          response.data?.detail === "Invalid or expired token"
        ) {
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
          return;
        }
        if (response.status === 200) {
          toast.success("Tax updated successfully");
          setIsEdit(false);
          setOpenForm(false);
        } else if (response.status === 400 || response.status === 500) {
          alert("Error updating tax. Please try again.");
        }
      } else {
        const response = await createTaxApi(
          name,
          percentage,
          isActive,
          createdBy,
          token
        );

        if (response?.body?.message === "Tax with this name already exists") {
          toast.error("Tax already exists");
        } else if (response?.status === 201) {
          toast.success("Tax created successfully");
          setOpenForm(false);
        } else if (response?.body?.message === "Invalid or expired toke ") {
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
        }
      }
      fetchRoles();
      setNewRole({ name: "", percentage: 0, isActive: false });
    } catch (error) {
      console.error("Error creating or updating role:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await taxAllDataApi({
        search: searchText,
        token: token,
      });
      if (response?.detail === "Invalid token") {
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again");
        router.push("/");
        return;
      }
      if (response?.taxes) {
        setTaxs(response?.taxes);
      }
    } catch (error) {
      console.error("Error fetching roles:", searchText);
    }
  };
  useEffect(() => {
    fetchRoles();
  }, [searchText]);

  const handleDelete = async (id: string) => {
    setSelectedRoleId(id);
    setIsLogoutPopup(true);
  };

  const handleDeleteConform = async (id: string) => {
    try {
      const response = await taxDeleteApi(id, token);
      if (response?.body.success) {
        toast.success("Tax deleted successfully");
        setIsLogoutPopup(false);
        fetchRoles();
      } else if (response?.body.message === "Invalid or expired token") {
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

  const handleEdit = (tax: {
    id: string;
    name: string;
    percentage: 0;
    is_active: boolean;
  }) => {
    setOpenForm(true);

    setNewRole({
      name: tax?.name,
      percentage: tax?.percentage,
      isActive: tax?.is_active,
    });
    setIsEdit(true);
    setSelectedRoleId(tax.id);
  };
  const handlecCancleEdit = () => {
    setOpenForm(false);
    setIsEdit(false);
    setNewRole({ name: "", percentage: 0, isActive: false });
  };
  const handleopenform = () => {
    setOpenForm(!openForm);
    setIsEdit(false);
    setNewRole({ name: "", percentage: 0, isActive: false });
  };
  const handleOpenInfo = (id: string) => {
    setIsInfoPopup(true);
    setinfo(id);
  };
  const activeHandler = async (tax: any, isActive: boolean) => {
    const response = await taxUpdatedApi(
      tax.id,
      tax.name,
      tax.percentage,
      isActive,
      createdBy,
      token
    );
    if (response?.status === 200) {
      fetchRoles();
    } else {
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
          className='bg-white lg:w-[90%] border-[1px] w-full rounded-lg shadow-md lg:p-6'
        >
          <div className='grid lg:grid-cols-2 grid-cols-1 p-4 items-center w-full lg:gap-8 gap-4 justify-between'>

            <div className='bg-admin-secondary h-12 rounded-lg px-3 '>
              <div className='w-full'>
                <select
                  value={newRole.name}
                  onChange={(e) =>
                    setNewRole((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                  className='bg-admin-secondary text-white font-semibold rounded-lg text-lg px-4 py-3 w-full focus:outline-none'
                >
                  <option value='' disabled className='text-white'>
                    Select Tax Type
                  </option>
                  <option value='CGST'>CGST</option>
                  <option value='SGST'>SGST</option>
                  <option value='IGST'>IGST</option>
                </select>
              </div>
            </div>
            <div className='flex bg-[#F3F3F3] relative rounded-md py-3 lg:w-2/3 w-full px-4'>
              <BsPuzzleFill color='#A5B7C0' size={26} />
              <input
                type='number'
                // placeholder="Enter percentage"
                value={newRole.percentage || ""}
                required
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? "" : parseFloat(e.target.value);
                  setNewRole((prev) => ({
                    ...prev,
                    percentage: value === "" ? 0 : value,
                  }));
                }}
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
              />
              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                Enter percentage
              </label>
            </div>
            <div className='flex items-center justify-between gap-2 bg-[#F3F3F3] rounded-lg h-12 lg:w-46 w-full p-4'>
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

          <div className='flex justify-center items-center lg:gap-12 gap-3 mb-3'>
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
        <div className='overflow-x-auto w-full '>
          <table className='w-full border-collapse'>
            <thead>
              <tr className='bg-admin-secondary text-admin-text-primary font-semibold'>
                <th className='py-3 px-4 text-start'> TaxName</th>
                <th className='py-3 px-4'>Status</th>
                <th className='py-3 px-4 text-end'>Percentage</th>
                <th className='py-3 px-4'>Action</th>
                <th className='py-3 px-4'>Info</th>
              </tr>
            </thead>
            <tbody>
              {taxs?.map((tax: any, index: any) => (
                <tr key={index} className='border-b-[1px] hover:bg-blue-100'>
                  <td className='py-3 px-4 text-start '>{tax?.name}</td>
                  <td className='py-3 px-4'>
                    <div className='flex flex-col items-center'>
                      <Switch
                        checked={tax?.is_active}
                        onChange={() => activeHandler(tax, !tax?.is_active)}
                        className={`${
                          tax?.is_active ? "bg-green-500" : "bg-gray-300"
                        } relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-200 ease-in-out`}
                      >
                        <span
                          className={`${
                            tax?.is_active ? "translate-x-6" : "translate-x-1"
                          } inline-block w-6 h-6 bg-white rounded-full transition-transform duration-200 ease-in-out`}
                        />
                      </Switch>
                    </div>
                  </td>
                  <td className='py-3 px-4  text-end'>
                    <p>{tax?.percentage}</p>
                  </td>

                  <td className='py-3 px-4 flex justify-center gap-4'>
                    <button
                      onClick={() => handleEdit(tax)}
                      className='text-orange-500'
                    >
                      <TbEdit size={26} />
                    </button>
                    <button
                      onClick={() => handleDelete(tax?.id)}
                      className='text-red-500'
                    >
                      <MdDelete size={26} />
                    </button>
                  </td>
                  <td className='py-3 px-4 text-center'>
                    <button
                      className='text-blue-500'
                      aria-label='Info'
                      onClick={() => handleOpenInfo(tax?.id)}
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
          role={taxs.find((role) => role.id === info)}
          isOpenInfoPopup={isOpenInfoPopup}
          setIsInfoPopup={setIsInfoPopup}
          setIsOpen={setIsInfoPopup}
        />
      )}
      {isOpenDeletePopup && (
        <TaxDeleteComponent
          isOpenDeletePopup={isOpenDeletePopup}
          handleDeleteConform={() => handleDeleteConform(selectedRoleId)}
          setIsLogoutDialogOpen={setIsLogoutPopup}
          setIsOpen={setIsLogoutPopup}
        />
      )}
    </div>
  );
};

export default TaxFormComponent;
