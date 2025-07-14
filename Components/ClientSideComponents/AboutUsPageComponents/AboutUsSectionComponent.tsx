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
import { clearUserDetails } from "@/redux/userSlice";
import { useRouter } from "next/navigation";
import { BiSolidImageAdd } from "react-icons/bi";
import { IoImage } from "react-icons/io5";
import {
  componentAlldataApi,
  componentDeleteApi,
  createComponentApi,
  updateComponentApi,
} from "@/apis/AboutUspageApi";
import DeleteSectionComponent from "./DeleteSectionComponent";

interface AddComponents {
  isopenaddres: boolean;
  setIsopenAddre: (value: boolean) => void;
  section: any;
}
const AboutUsSectionComponent: React.FC<AddComponents> = ({
  isopenaddres,
  setIsopenAddre,
  section,
}) => {
  const [isComponent, setComponent] = useState([]);
  const [isSelectCategry, setSelectCategry] = useState<boolean>(false);
  const [isComponentid, setComponentId] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [newUser, setNewUser] = useState({
    sequence_number: "",
    heading: "",
    sub_heading: "",
    description: "",
    image: "",
    isActive: false,
    percentage: "",
  });
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [isfile, setfile] = useState("");
  const [fileName, setFileName] = useState("");
  const token = useSelector((state: any) => state?.user?.token);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleCreateOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {
      sequence_number,
      heading,
      sub_heading,
      description,
      image,
      isActive,
      percentage,
    } = newUser;
    try {
      let response;
      if (isEdit) {
        response = await updateComponentApi(
          isComponentid,
          section,
          sequence_number,
          heading,
          sub_heading,
          description,
          image,
          isActive,
          percentage,
          token
        );
        if (response?.status === 200) {
          toast.success("Component Updated Successfully");
          setFileName("");
          setIsEdit(false);
        } else if (
          response?.data?.error === "This sequence number already exists"
        ) {
          toast.error("This sequence number already exists");
        } else if (response?.data?.message === "Invalid or expired token") {
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
        }
      } else {
        response = await createComponentApi(
          section,
          sequence_number,
          heading,
          sub_heading,
          description,
          image,
          isActive,
          percentage,
          token
        );
        if (response?.status === 201) {
          toast.success("Component Created Successfully");
          setFileName("");
        } else if (
          response?.data?.error === "This sequence number already exists"
        ) {
          toast.error("This sequence number already exists");
        } else if (response?.data?.message === "Invalid or expired token") {
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
        }
      }
      if (response?.status === 200 || response?.status === 201) {
        loadCategry();
        setOpenForm(false);
        setNewUser({
          sequence_number: "",
          heading: "",
          sub_heading: "",
          description: "",
          image: "",
          isActive: false,
          percentage: "",
        });
        setFileName("");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please check your input.");
    }
  };
  const handleDelete = async (id: string) => {
    setComponentId(id);
    setSelectCategry(true);
  };

  const handleEdit = (item: {
    id: string;
    sequence_number: string;
    heading: string;
    sub_heading: string;
    description: string;
    image: string;
    is_active: false;
    precentage: string;
  }) => {
    setOpenForm(true);
    setFileName(item?.image);
    setNewUser({
      sequence_number: item.sequence_number,
      heading: item.heading,
      sub_heading: item?.sub_heading,
      description: item?.description,
      image: "",
      isActive: item.is_active,
      percentage: item?.precentage,
    });
    setIsEdit(true);
    setComponentId(item?.id);
  };
  const handlecCancleEdit = () => {
    setIsEdit(false);
    setNewUser({
      sequence_number: "",
      heading: "",
      sub_heading: "",
      description: "",
      image: "",
      isActive: false,
      percentage: "",
    });
    setFileName("");
  };

  const handleDeleteConform = async (id: string) => {
    try {
      const response = await componentDeleteApi(id, section, token);
      if (response?.body.success) {
        toast.success("Sub Categry deleted successfully");
        setSelectCategry(false);
        loadCategry();
      } else if (response?.body?.message === "Invalid or expired token") {
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again");
        router.push("/");
      }
    } catch (error) {
      console.error("Failed to delete role:");
    }
  };
  const loadCategry = async () => {
    if (section) {
      const response = await componentAlldataApi(section, token);
      if (response) {
        setComponent(response?.results);
      } else if (response?.data?.message === "Invalid or expired token") {
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again");
        router.push("/");
      } 
    }
  };
  useEffect(() => {
    loadCategry();
  }, [section]);
  const handleopenform = () => {
    setOpenForm(!openForm);
    setIsEdit(false);
    setNewUser({
      sequence_number: "",
      heading: "",
      sub_heading: "",
      description: "",
      image: "",
      isActive: false,
      percentage: "",
    });
  };
  const activeHandler = async (item: any, isActive: boolean) => {
    const image = "";
    const response = await updateComponentApi(
      item?.id,
      item?.section,
      item?.sequence_number,
      item?.heading,
      item?.sub_heading,
      item?.description,
      image,
      isActive,
      item?.precentage,
      token
    );
    if (response?.status === 200) {
      loadCategry();
    } else if (response?.data?.message === "Invalid or expired token") {
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
              <Dialog.Panel className='flex relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all max-w-5xl w-full'>
                <div className='w-full'>
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
                        onSubmit={handleCreateOrUpdate}
                        className='bg-white w-full border-[1px] rounded-lg shadow-md lg:p-6 p-4'
                      >
                        <div className='grid lg:grid-cols-2 grid-cols-1 gap-4 mb-4 w-full'>
                          <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm'>
                            <MdCategory color='#A5B7C0' size={26} />
                            <input
                              type='number'
                              name='Sub-Categry'
                              // placeholder="Enter Sub-Category"
                              value={newUser.sequence_number}
                              onChange={(e) =>
                                setNewUser((prev) => ({
                                  ...prev,
                                  sequence_number: e.target.value,
                                }))
                              }
                              className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-2 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
                              required
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
                              name='Sub-Categry'
                              // placeholder="Enter Sub-Category"
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
                              Enter Heading
                            </label>
                          </div>
                          <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm'>
                            <MdCategory color='#A5B7C0' size={26} />
                            <input
                              type='text'
                              name='Sub-heading'
                              // placeholder="Enter Sub-Category"
                              value={newUser.sub_heading}
                              onChange={(e) =>
                                setNewUser((prev) => ({
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

                          <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm'>
                            <MdCategory color='#A5B7C0' size={26} />
                            <input
                              type='text'
                              name='Percentage'
                              // placeholder="Description"
                              value={newUser.percentage}
                              onChange={(e) =>
                                setNewUser((prev) => ({
                                  ...prev,
                                  percentage: e.target.value,
                                }))
                              }
                              className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-2 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
                            />
                            <label
                              htmlFor='tag'
                              className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                            >
                              Enter Percentage
                            </label>
                          </div>

                          <div className='w-full focus:outline-none focus:outline-1 placeholder-black h-12'>
                            {/* <p className="mb-1">Image</p> */}
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
                          <div className='flex items-center  justify-between w-full gap-3 bg-[#F3F3F3] rounded-lg h-12 px-4 '>
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
                    <div className='overflow-x-auto w-full shadow-lg border-[1px] rounded-lg mt-4'>
                      <table className='w-full  w-7xl'>
                        <thead className='text-center'>
                          <tr className='bg-admin-secondary text-admin-text-primary'>
                            <th className='p-2'>Sequence Number</th>
                            <th className='p-2'>Heading</th>
                            <th className='p-2'>Sub-Heading</th>
                            <th className='py-3 px-5 text-start'>Image</th>
                            {/* <th className='p-2'>Description</th> */}
                            <th className='p-2'>Is Action</th>
                            <th className='p-2'>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {isComponent?.map((item: any, index: any) => (
                            <tr key={index} className='text-center'>
                              <th className='p-2'>{item?.sequence_number}</th>
                              <td className=' p-2'>{item?.heading}</td>
                              <td className=' p-2'>{item?.sub_heading}</td>
                              <td className='p-3'>
                                {item?.image ? (
                                  <>
                                    <img
                                      src={`${process.env.NEXT_PUBLIC_BASE_URL}${item?.image}`}
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
                              <td className='py-3 px-4'>
                                <div className='flex flex-col items-center'>
                                  <Switch
                                    checked={item?.is_active}
                                    onChange={() =>
                                      activeHandler(item, !item?.is_active)
                                    }
                                    className={`${
                                      item?.is_active
                                        ? "bg-green-500"
                                        : "bg-gray-300"
                                    } relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-200 ease-in-out`}
                                  >
                                    <span
                                      className={`${
                                        item?.is_active
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
                              {isSelectCategry && (
                                <DeleteSectionComponent
                                  isOpenDeletePopup={isSelectCategry}
                                  handleDeleteConform={() =>
                                    handleDeleteConform(isComponentid)
                                  }
                                  setIsLogoutDialogOpen={setSelectCategry}
                                  setIsOpen={setSelectCategry}
                                />
                              )}
                            </tr>
                          ))}
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

export default AboutUsSectionComponent;
