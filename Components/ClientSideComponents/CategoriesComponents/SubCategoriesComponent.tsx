"use client";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Switch, Transition } from "@headlessui/react";
import { TbEdit } from "react-icons/tb";
import { MdCategory, MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { RiSubtractFill } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import {
  createSubCategryApi,
  subcategoryDeleteApi,
  subCategryAlldataApi,
  updateSubCategryApi,
} from "@/apis/categoriesApi";
import SubCategryDeletepopComponent from "./SubCategryDeletepopComponent";
import { clearUserDetails } from "@/redux/userSlice";
import { useRouter } from "next/navigation";
import { BiSolidImageAdd } from "react-icons/bi";
import { IoImage } from "react-icons/io5";
import DescriptionReatchTextComponent from "../ProductComponents/DescriptionReatchTextComponent";
import { BsPuzzleFill } from "react-icons/bs";
import RoleInfoPopup from "../RoleFormComponents/RoleInfoPopup";

interface AddAddressComponents {
  isopenaddres: boolean;
  setIsopenAddre: (value: boolean) => void;
  user: any;
}

const SubCategoriesComponent: React.FC<AddAddressComponents> = ({
  isopenaddres,
  setIsopenAddre,
  user,
}) => {
  const [isSubCategry, setSubCategry] = useState([]);
  const [isSelectCategry, setSelectCategry] = useState<boolean>(false);
  const [selectedCategryid, setSelectCategryid] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [newUser, setNewUser] = useState({
    id: "",
    sequence_number: "",
    name: "",
    title: "",
    heading: "",
    description: "",
    seo_description: "",
    seo_title: "",
    seo_data: "",
    seo_keyword: "",
    image: "",
    banner: "",
    isActive: false,
  });
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [isfile, setfile] = useState("");
  const [fileName, setFileName] = useState("");
  const createdBy = useSelector((state: any) => state?.user?.details?.id);
  const categry = Number(user);
  const token = useSelector((state: any) => state?.user?.token);
  const dispatch = useDispatch();
  const router = useRouter();
  const [fileBannerName, setBannerName] = useState("");
  const [isOpenInfoPopup, setIsInfoPopup] = useState<boolean>(false);
  const [info, setinfo] = useState("");

  const handleCreateOrUpdateadddres = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const {
      sequence_number,
      name,
      title,
      heading,
      description,
      seo_description,
      seo_title,
      seo_data,
      seo_keyword,
      image,
      banner,
      isActive,
    } = newUser;
    try {
      let response;
      if (isEdit) {
        response = await updateSubCategryApi(
          selectedCategryid,
          sequence_number,
          name,
          title,
          heading,
          description,
          seo_description,
          seo_title,
          seo_data,
          seo_keyword,
          categry,
          image,
          banner,
          isActive,
          createdBy,
          token
        );
        if (response?.status === 200) {
          toast.success("Sub Category Updated Successfully");
          setFileName("");
          setIsEdit(false);
        } else if (response?.data?.detail === "Invalid token") {
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
        } else if (
          response?.data?.error ===
          "Product category with this sequence number already exists"
        ) {
          toast.error("This Sequence Number already exists");
        } else if (
          response?.data?.error ===
          "Product category with this name already exists"
        ) {
          toast.error("This sub-Category already exists");
        }
      } else {
        response = await createSubCategryApi(
          sequence_number,
          name,
          title,
          heading,
          description,
          seo_description,
          seo_title,
          seo_data,
          seo_keyword,
          categry,
          image,
          banner,
          isActive,
          createdBy,
          token
        );
        if (response?.status === 201) {
          toast.success("Sub Category Created Successfully");
          setFileName("");
        } else if (
          response?.data?.error ===
          "Product category with this name already exists"
        ) {
          toast.error("This sub-Category already exists");
        } else if (
          response?.data?.error ===
          "Product category with this sequence number already exists"
        ) {
          toast.error("This Sequence Number already exists");
        } else if (response?.data?.detail === "Invalid token") {
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
        }
      }
      if (response?.status === 200 || response?.status === 201) {
        loadCategry();
        setOpenForm(false);
        setNewUser({
          id: "",
          sequence_number: "",
          title: "",
          name: "",
          heading: "",
          description: "",
          seo_description: "",
          seo_title: "",
          seo_data: "",
          seo_keyword: "",
          image: "",
          banner: "",
          isActive: false,
        });
        setFileName("");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please check your input.");
    }
  };
  const handleDelete = async (id: string) => {
    setSelectCategryid(id);
    setSelectCategry(true);
  };

  const handleEdit = (item: {
    id: string;
    sequence_number: string;
    name: string;
    title: string;
    heading: string;
    description: string;
    seo_description: string;
    seo_title: string;
    seo_data: string;
    seo_keyword: string;
    image: string;
    is_active: boolean;
  }) => {
    setOpenForm(true);
    setFileName(item?.image);
    setNewUser({
      id: item?.id,
      sequence_number: item?.sequence_number,
      name: item.name,
      heading: item?.heading,
      title: item.title,
      description: item.description,
      seo_title: item?.seo_title,
      seo_data: item?.seo_data,
      seo_keyword: item?.seo_keyword,
      image: "",
      banner: "",
      seo_description: item?.seo_description,
      isActive: item.is_active,
    });
    setIsEdit(true);
    setSelectCategryid(item?.id);
  };
  const handlecCancleEdit = () => {
    setIsEdit(false);
    setNewUser({
      id: "",
      sequence_number: "",
      title: "",
      name: "",
      heading: "",
      description: "",
      seo_description: "",
      seo_title: "",
      seo_data: "",
      seo_keyword: "",
      image: "",
      banner: "",
      isActive: false,
    });
    setFileName("");
  };

  const handleDeleteConform = async (id: string) => {
    try {
      const response = await subcategoryDeleteApi(id, token);
      if (response?.body.success) {
        toast.success("Sub Categry deleted successfully");
        setSelectCategry(false);
        loadCategry();
      } else if (response?.body.detail === "Invalid token") {
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again");
        router.push("/");
      }
    } catch (error) {
      console.error("Failed to delete role:");
    }
  };

  const loadCategry = async () => {
    if (user) {
      const response = await subCategryAlldataApi(user, token);
      if (response.body) {
        setSubCategry(response?.body?.subcategory);
      } else if (response?.body?.message === "Invalid or expired token") {
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again");
        router.push("/");
      }
    }
  };
  useEffect(() => {
    loadCategry();
  }, [user]);
  const handleopenform = () => {
    setOpenForm(!openForm);
    setIsEdit(false);
    setNewUser({
      id: "",
      sequence_number: "",
      title: "",
      name: "",
      heading: "",
      description: "",
      seo_description: "",
      seo_title: "",
      seo_data: "",
      seo_keyword: "",
      image: "",
      banner: "",
      isActive: false,
    });
  };
  const activeHandler = async (item: any, isActive: boolean) => {
    console.log("item", item)
    const image = "";
    const banner = "";
    const response = await updateSubCategryApi(
      item?.id,
      item?.sequence_number,
      item?.name,
      item?.heading,
      item?.title,
      item?.description,
      item?.seo_description,
      item?.seo_title,
      item?.seo_data,
      item?.seo_keyword,
      categry,
      image,
      banner,
      isActive,
      createdBy,
      token
    );
    if (response?.status === 200) {
      loadCategry();
    } else if (response?.data?.detail === "Invalid token") {
      dispatch(clearUserDetails());
      toast.error("Session Expired, Please Login Again");
      router.push("/");
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file: any = e.target.files?.[0];
    setfile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setNewUser((prev: any) => ({
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
          setNewUser((prev: any) => ({
            ...prev,
            banner: file,
          }));
          setBannerName(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const handleOpenInfo = (id: string) => {
    setIsInfoPopup(true);
    setinfo(id);
  };

  return (
    <Transition.Root show={isopenaddres} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-50'
        onClose={() => setIsopenAddre(false)}
      >
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div
          className='fixed inset-0 z-999'
          onClick={(event) => event.stopPropagation()}
        >
          <div className='flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='flex relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all max-w-7xl w-full'>
                <div className='w-full bg-white lg:h-[699px] h-[399px] py-4 overflow-scroll'>
                  {/* <div className="flex justify-end items-end p-2 mt-12 bg-white absolute -top-16 right-2" onClick={() => setIsopenAddre(false)}><p><RxCross2 size={26} color="black"/></p></div> */}
                  <div className='mx-auto bg-white shadow-lg rounded-lg p-6 w-full'>
                    <div
                      className='absolute top-0 right-0 cursor-pointer flex justify-center items-center bg-red-600 w-16 h-8 text-white font-semibold'
                      onClick={() => setIsopenAddre(false)}
                    >
                      <RxCross2 size={26} />
                    </div>
                    <div className='flex justify-end items-center mb-4 py-4'>
                      <button
                        onClick={handleopenform}
                        className='text-white font-semibold text-xl bg-admin-buttonprimary border-[1px] rounded-xl lg:w-[100px] w-[90px] h-10'
                      >
                        {openForm ? (
                          <div className='flex justify-center items-center text-white gap-2'>
                            <p>Close</p>{" "}
                            <RiSubtractFill size={23} color='white' />
                          </div>
                        ) : (
                          <div className='flex justify-center items-center text-white gap-2'>
                            Add <IoMdAdd size={26} color='white' />
                          </div>
                        )}
                      </button>
                    </div>
                    {openForm && (
                      <form
                        onSubmit={handleCreateOrUpdateadddres}
                        className='bg-white w-full rounded-lg border-[1px] shadow-md lg:p-6 p-4'
                      >
                        <div className='grid lg:grid-cols-2 grid-cols-1 gap-4 mb-4 w-full'>
                          <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm'>
                            <MdCategory color='#A5B7C0' size={26} />
                            <input
                              type='number'
                              // placeholder="Enter Category"
                              value={newUser.sequence_number}
                              required
                              onChange={(e) =>
                                setNewUser((prev) => ({
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
                            <MdCategory color='#A5B7C0' size={26} />
                            <input
                              type='text'
                              // placeholder="Enter Category"
                              value={newUser.title}
                              required
                              onChange={(e) =>
                                setNewUser((prev) => ({
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
                              name='Sub-Categry'
                              // placeholder="Enter Sub-Category"
                              value={newUser.name}
                              onChange={(e) =>
                                setNewUser((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                              className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-2 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
                              required
                            />
                            <label
                              htmlFor='tag'
                              className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                            >
                              Enter Sub-Category
                            </label>
                          </div>
                          <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm'>
                            <MdCategory color='#A5B7C0' size={26} />
                            <input
                              type='text'
                              // placeholder="Enter Category"
                              value={newUser.heading}
                              onChange={(e) =>
                                setNewUser((prev) => ({
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
                          </div>
                          <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm'>
                            <MdCategory color='#A5B7C0' size={26} />
                            <input
                              type='text'
                              name='Description'
                              // placeholder="Description"
                              value={newUser.description}
                              onChange={(e) =>
                                setNewUser((prev) => ({
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
                          <div className='flex bg-[#F3F3F3] p-2 relative w-full  h-12 rounded-lg shadow-sm'>
                            <BsPuzzleFill color='#A5B7C0' size={26} />
                            <input
                              type='text'
                              placeholder=' Minimum Order Quantity'
                              value={newUser.seo_title}
                              className='peer bg-[#F3F3F3] focus:outline-none w-full px-4  py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
                              onChange={(e) =>
                                setNewUser((prev) => ({
                                  ...prev,
                                  seo_title: e.target.value,
                                }))
                              }
                            />
                            <label
                              htmlFor='tag'
                              className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                            >
                              Enter SEO Title
                            </label>
                          </div>
                          <div className='flex bg-[#F3F3F3] p-2 relative w-full  h-12 rounded-lg shadow-sm'>
                            <BsPuzzleFill color='#A5B7C0' size={26} />
                            <input
                              type='text'
                              placeholder=' Minimum Order Quantity'
                              value={newUser.seo_data}
                              className='peer bg-[#F3F3F3] focus:outline-none w-full px-4  py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
                              onChange={(e) =>
                                setNewUser((prev) => ({
                                  ...prev,
                                  seo_data: e.target.value,
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
                              value={newUser.seo_keyword}
                              className='peer bg-[#F3F3F3] focus:outline-none w-full px-4  py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
                              onChange={(e) =>
                                setNewUser((prev) => ({
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

                          <div className='flex bg-[#F3F3F3] p-3 relative justify-between w-full h-12 rounded-lg shadow-sm'>
                            <label className='text-sm text-[#577C8E]'>
                              Is Active?
                            </label>
                            <div className='switch'>
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
                          <div className='lg:col-span-2 '>
                            <DescriptionReatchTextComponent
                              value={newUser.seo_description}
                              onChange={(seo_description) =>
                                setNewUser((prev: any) => ({
                                  ...prev,
                                  seo_description,
                                }))
                              }
                            />
                          </div>
                        </div>

                        <div className='grid lg:grid-cols-2 grid-cols-1 gap-4 '>
                          <div className='w-full focus:outline-none focus:outline-1 placeholder-black h-12 mt-3'>
                            <p className=''>Image</p>
                            <div className='flex bg-admin-secondary  justify-center items-center px-4 rounded-md'>
                              <input
                                id='img'
                                name='img'
                                type='file'
                                placeholder='Upload Image'
                                // value={newUser?.profile_picture}
                                onChange={handleFileChange}
                                accept='.jpeg,.png,'
                                className='block w-full text-sm text-admin-secondary  file:mr-4 file:py-1 file:h-12 file:px-4  file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-admin-secondary   bg-admin-secondary  file:text-white hover:file:bg-gray-700'
                              />
                              {fileName ? (
                                <span className='text-white px-2 w-full'>
                                  {fileName.length > 10
                                    ? `${fileName.slice(0, 10)}...`
                                    : fileName}
                                </span>
                              ) : (
                                <BiSolidImageAdd color='white' size={27} />
                              )}
                            </div>
                          </div>
                          <div className='rounded-md  w-full focus:outline-none focus:outline-1 placeholder-black h-12 mt-3'>
                            <p className=''>Banner Image</p>
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
                        </div>

                        <div className='mt-6 flex gap-3 justify-center items-center'>
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
                    <div className='lg:px-4 overflow-x-auto w-full'>
                      <table className='w-full mt-6 '>
                        <thead className='text-center bg-admin-secondary text-admin-text-primary'>
                          <tr className=''>
                            <th className='flex justify-start items-center'>
                              <div className='py-3 px-6 '>Sequence Number</div>
                            </th>
                            <th className='py-3 px-5 text-start'>Image</th>
                            <th className='py-3 px-5 text-start'>Banner</th>
                            <th className='p-2'>Sub-Category</th>
                            <th className='p-2'>Description</th>
                            <th className='p-2'>Is Action</th>
                            <th className='p-2'>Action</th>
                            <th className='p-2'>Info</th>
                          </tr>
                        </thead>
                        <tbody>
                          {isSubCategry?.map((item: any, index: any) => (
                            
                            <tr key={index} className='text-center hover:bg-purple-100'>
                              <td className=' p-2'>{item?.sequence_number}</td>

                              <td className='p-3 '>
                                {item?.imageUrl? (
                                  <>
                                    <img
                                      src={`${item?.imageUrl}`}
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
                                {item?.banner ? (
                                  <>
                                    <img
                                      src={`${item?.banner}`}
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
                              <td className=' p-2'>{item?.name}</td>
                              <td className=' p-2'>{item.description}</td>
                              <td className='py-3 px-4'>
                                <div className='flex flex-col items-center'>
                                  <Switch
                                    checked={item?.isDeleted}
                                    onChange={() =>
                                      activeHandler(item, !item?.isDeleted)
                                    }
                                    className={`${
                                      item?.isDeleted
                                        ? "bg-green-500"
                                        : "bg-gray-300"
                                    } relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-200 ease-in-out`}
                                  >
                                    <span
                                      className={`${
                                        item?.isDeleted
                                          ? "translate-x-6"
                                          : "translate-x-1"
                                      } inline-block w-6 h-6 bg-white rounded-full transition-transform duration-200 ease-in-out`}
                                    />
                                  </Switch>
                                </div>
                              </td>
                              <td className='p-2 text-center'>
                                <div className='flex justify-center '>
                                  <button
                                    onClick={() => handleEdit(item)}
                                    className='text-orange-500'
                                  >
                                    <TbEdit size={26} />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(item?.id)}
                                    className='text-red-500 px-3'
                                  >
                                    <MdDelete size={26} />
                                  </button>
                                </div>
                              </td>
                              <td className='py-3  text-center '>
                                <button
                                  className='mt-1'
                                  aria-label='Info'
                                  onClick={() => handleOpenInfo(item?.id)}
                                >
                                  <img
                                    src='/Info.png'
                                    alt='Profile'
                                    className='h-6 w-6 object-cover'
                                  />
                                </button>
                              </td>
                              {isSelectCategry && (
                                <SubCategryDeletepopComponent
                                  isOpenDeletePopup={isSelectCategry}
                                  handleDeleteConform={() =>
                                    handleDeleteConform(selectedCategryid)
                                  }
                                  setIsLogoutDialogOpen={setSelectCategry}
                                  setIsOpen={setSelectCategry}
                                />
                              )}
                            </tr>
                          ))}
                          {isOpenInfoPopup && (
                            <RoleInfoPopup
                              role={isSubCategry.find(
                                (item: any) => item.id === info
                              )}
                              isOpenInfoPopup={isOpenInfoPopup}
                              setIsInfoPopup={setIsInfoPopup}
                              setIsOpen={setIsInfoPopup}
                            />
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default SubCategoriesComponent;
