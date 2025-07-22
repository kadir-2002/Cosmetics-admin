"use client";
import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { MdCategory, MdDelete } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import RoleInfoPopup from "../RoleFormComponents/RoleInfoPopup";
import { Switch } from "@headlessui/react";
import { BiSolidCategory, BiSolidImageAdd } from "react-icons/bi";
import { clearUserDetails } from "@/redux/userSlice";
import { useRouter } from "next/navigation";
import { FiMinus, FiPlus } from "react-icons/fi";
import {
  createSectionApi,
  sectionAllDataApi,
  sectionDeleteApi,
  sectionUpdatedApi,
} from "@/apis/AboutUspageApi";
import AboutUsSectionComponent from "./AboutUsSectionComponent";
import SectionDeleteComponent from "./SectionDeleteComponent";

interface section {
  id: string;
  section_name: string;
  heading: string;
  sub_heading: string;
  description: string;
  image: string;
  isActive: boolean;
}
const AboutUsComponent = () => {
  const [data, setData] = useState<section[]>([]);
  const [newRole, setNewRole] = useState({
    section_name: "",
    sequence_number: "",
    heading: "",
    sub_heading: "",
    description: "",
    image: "",
    isActive: false,
  });
  const [isEdit, setIsEdit] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [isOpenDeletePopup, setIsLogoutPopup] = useState<boolean>(false);
  const [isOpenInfoPopup, setIsInfoPopup] = useState<boolean>(false);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [info, setinfo] = useState("");
  const [isopenCategry, setIsopenCategry] = useState<boolean>(false);
  const [isSectionId, setSectionID] = useState("");
  const [isfile, setfile] = useState("");
  const [fileName, setFileName] = useState("");
  const token = useSelector((state: any) => state?.user?.token);
  const dispatch = useDispatch();
  const router = useRouter();
  const topRef = useRef<HTMLDivElement | null>(null);
  const handleCreateOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {
      section_name,
      sequence_number,
      heading,
      sub_heading,
      description,
      image,
      isActive,
    } = newRole;
    try {
      if (isEdit) {
        const response = await sectionUpdatedApi(
          section_name,
          selectedRoleId,
          sequence_number,
          heading,
          sub_heading,
          description,
          image,
          isActive,
          token
        );
        if (response?.status === 200) {
          toast.success("Section updated successfully");
          setIsEdit(false);
          fetchSectiondata();
          setOpenForm(false);
          setFileName("");
          setNewRole({
            section_name: "",
            sequence_number: "",
            heading: "",
            sub_heading: "",
            description: "",
            image: "",
            isActive: false,
          });
        } else if (response?.data?.message === "Invalid or expired token") {
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
        }else if (
          response?.data?.message === "sequence_number is not positive"
        ) {
          toast.error("sequence_number is not positive");
        } 
        else if (
          response?.data?.message === "This sequence number already exists"
        ) {
          toast.error("This sequence number already exists");
        }
      } else {
        const response = await createSectionApi(
          section_name,
          sequence_number,
          heading,
          sub_heading,
          description,
          image,
          isActive,
          token
        );
        if (response?.status === 201) {
          toast.success("Section Created Successfully");
          fetchSectiondata();
          setOpenForm(false);
          setFileName("");
          setNewRole({
            section_name: "",
            sequence_number: "",
            heading: "",
            sub_heading: "",
            description: "",
            image: "",
            isActive: false,
          });
        }else if(response?.message === "This sequence number already exists") {
          toast.error("This sequence number already exists");
        } 
        else if (response?.message === "sequence_number is not positive") {
          toast.error("sequence_number is not positive");
        } else if (response?.data?.message === "Invalid or expired token") {
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
        }
      }
    } catch (error) {
      console.error("Error creating or updating Categry:", error);
    }
  };
  const fetchSectiondata = async () => {
    try {
      const apiParams: {
        token: string;
      } = {
        token: token,
      };
      const response = await sectionAllDataApi(apiParams);
      if (response?.results) {
        setData(response?.results);
      } else if (response?.detail === "Invalid token") {
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again");
        router.push("/");
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };
  useEffect(() => {
    fetchSectiondata();
  }, []);

  const handleDelete = async (id: string) => {
    setSelectedRoleId(id);
    setIsLogoutPopup(true);
  };
  const handleDeleteConform = async (id: string) => {
    try {
      const response = await sectionDeleteApi(id, token);
      if (response?.body.success) {
        toast.success("Section deleted successfully");
        setIsLogoutPopup(false);
        fetchSectiondata();
      } else if (response?.body.message === "Invalid or expired token") {
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again");
        router.push("/");
      }
    } catch (error) {
      console.error("Failed to delete Categry:");
    }
  };
  const handleEdit = (data: {
    section_name: string;
    id: string;
    sequence_number: string;
    heading: string;
    sub_heading: string;
    description: string;
    image: string;
    is_active: boolean;
  }) => {
    setFileName(data?.image)
    setOpenForm(true);
    if (topRef.current) {
      topRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setNewRole({
      section_name: data?.section_name,
      sequence_number: data?.sequence_number,
      heading: data?.heading,
      sub_heading: data?.sub_heading,
      description: data?.description,
      image: "",
      isActive: data?.is_active,
    });
    setIsEdit(true);
    setSelectedRoleId(data.id);
  };

  const handlecCancleEdit = () => {
    setOpenForm(false);
    setIsEdit(false);
    setFileName("");
    setNewRole({
      section_name: "",
      sequence_number: "",
      heading: "",
      sub_heading: "",
      description: "",
      image: "",
      isActive: false,
    });
  };

  const handleopenform = () => {
    setOpenForm(!openForm);
    setIsEdit(false);
    setFileName("");
    setNewRole({
      section_name: "",
      sequence_number: "",
      heading: "",
      sub_heading: "",
      description: "",
      image: "",
      isActive: false,
    });
  };
  const handleOpenInfo = (id: string) => {
    setIsInfoPopup(true);
    setinfo(id);
  };
  const activeHandler = async (data: any, isActive: boolean) => {
    const image = "";
    const response = await sectionUpdatedApi(
      data?.section_name,
      data?.id,
      data?.sequence_number,
      data?.heading,
      data?.sub_heading,
      data?.description,
      image,
      isActive,
      token
    );
    if (response?.status === 200) {
      fetchSectiondata();
    } else if (response?.data?.detail === "Invalid token") {
      dispatch(clearUserDetails());
      toast.error("Session Expired, Please Login Again");
      router.push("/");
    }
  };
  const handleAddComponent = (id: any) => {
    setIsopenCategry(true);
    setSectionID(id);
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
  return (
    <div
      className='min-h-screen w-full flex flex-col lg:items-center'
      ref={topRef}
    >
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
          className='bg-white lg:w-[90%] border-[1px] w-full rounded-lg shadow-md lg:p-6 p-4'
        >
          <div className='grid lg:grid-cols-2 grid-cols-1 gap-6 mb-6'>
            <div className='flex bg-admin-secondary py-3 relative w-full h-12 rounded-lg shadow-sm px-2'>
              <select
                value={newRole.section_name}
                required
                onChange={(e) =>
                  setNewRole((prev) => ({
                    ...prev,
                    section_name: e.target.value,
                  }))
                }
                className='peer bg-admin-secondary focus:outline-none w-full  text-white px-3 font-semibold'
              >
                <option value='' disabled className='text-white bg-white'>
                  Select Section
                </option>
                <option value='banner'>Banner</option>
                <option value='superior_quality'>Superior Quality</option>
                <option value='our_mission'>Our Mission</option>
                <option value='our_story'>Our Story</option>
                <option value='about_glam'>About Glam</option>
                <option value='our_journey'>Our Journey</option>
                <option value='our_vision'>Our Vision</option>
                <option value='counter'>Counter</option>
                <option value='awards'>Awards</option>

                <option value='very_close'>Very Close</option>
                <option value='inner_banner'>Inner Banner</option>
                <option value='quality_and_Innovation'>Quality And Innovation</option>
                <option value='our_commitment'>Our Commitment</option>
              </select>
            </div>
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
            <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm'>
              <BiSolidCategory color='#A5B7C0' size={26} />
              <input
                type='text'
                // placeholder="Enter Description"
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
                Enter Heading
              </label>
            </div>
            <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm'>
              <BiSolidCategory color='#A5B7C0' size={26} />
              <input
                type='text'
                // placeholder="Enter Description"
                value={newRole.sub_heading}
                onChange={(e) =>
                  setNewRole((prev) => ({
                    ...prev,
                    sub_heading: e.target.value,
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
            </div>
            <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm'>
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
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                Enter Description
              </label>
            </div>
            <div className='rounded-md  w-full focus:outline-none focus:outline-1 placeholder-black h-12'>
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
            <div className='flex items-center  justify-between  gap-3 bg-[#F3F3F3] rounded-lg h-12 px-4 w-full'>
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
          </div>
          <div className='flex justify-center items-center gap-6'>
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
            <thead className="bg-admin-secondary text-admin-text-primary">
              <tr className='bg-admin-secondary text-admin-text-primary  font-semibold text-start'>
                <th className='py-3 px-5 text-start'>Section Name</th>
                <th className='py-3 px-5 text-start'>Sequence Number</th>
                <th className='py-3 text-start'>Image</th>
                <th
                  className={`text-left cursor-pointer transition-colors duration-200 `}
                >
                  <div className=''>
                    <span className=''>Heading</span>
                  </div>
                </th>
                <th className='py-3 text-start'>Sub Heading</th>
                <th className='p-4 flex gap-1 justify-center items-center'>
                  Status
                </th>
                <th className='p-3 text-center'>Component</th>
                <th className='py-3 px-6'>Action</th>
                <th className='py-3 px-6'>Info</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((data: any, index: any) => (
                <tr key={index} className='border-b-[1px] hover:bg-blue-100'>
                  <td className='p-3 capitalize'>
                    {data?.section_name?.replace(/_/g, " ")}
                  </td>

                  <td className='p-3 '>{data?.sequence_number}</td>
                  <td className='p-3 '>
                    {data?.image ? (
                      <>
                        <img
                          src={`${data?.image}`}
                          alt='Profile'
                          className='lg:h-10 lg:w-12 h-10 w-12 object-cover rounded-full'
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
                  <td className='text-left'>
                    <div className='py-3'>{data?.heading}</div>
                  </td>
                  <th className='py-3 text-start'>{data?.sub_heading}</th>
                  <td className='py-3 px-6 text-center'>
                    <div className=''>
                      <Switch
                        checked={data?.is_active}
                        onChange={() => activeHandler(data, !data?.is_active)}
                        className={`${data?.is_active ? "bg-green-500" : "bg-gray-300"
                          } relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-200 ease-in-out`}
                      >
                        <span
                          className={`${data?.is_active ? "translate-x-6" : "translate-x-1"
                            } inline-block w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out`}
                        />
                      </Switch>
                    </div>
                  </td>
                  <td className='py-3 px-6'>
                    <div
                      className='flex justify-center items-center'
                      onClick={() => handleAddComponent(data?.id)}
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
                            section_name: data?.section_name,
                            id: data?.id,
                            sequence_number: data?.sequence_number,
                            heading: data?.heading,
                            sub_heading: data?.sub_heading,
                            description: data?.description,
                            image: data?.image,
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
        </div>
      </div>
      {isopenCategry && (
        <AboutUsSectionComponent
          section={isSectionId}
          // user={user.find((id:any) => user.id === isaddresid)}
          isopenaddres={isopenCategry}
          setIsopenAddre={setIsopenCategry}
        />
      )}
      {isOpenInfoPopup && (
        <RoleInfoPopup
          role={data.find((data) => data.id === info)}
          isOpenInfoPopup={isOpenInfoPopup}
          setIsInfoPopup={setIsInfoPopup}
          setIsOpen={setIsInfoPopup}
        />
      )}
      {isOpenDeletePopup && (
        <SectionDeleteComponent
          isOpenDeletePopup={isOpenDeletePopup}
          handleDeleteConform={() => handleDeleteConform(selectedRoleId)}
          setIsLogoutDialogOpen={setIsLogoutPopup}
          setIsOpen={setIsLogoutPopup}
        />
      )}
    </div>
  );
};

export default AboutUsComponent;
