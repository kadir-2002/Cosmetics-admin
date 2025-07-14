"use client";
import { imgAllDataApi, imgDeleteApi, imgUpdatedApi, productImgApi } from "@/apis/productApi";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import ProductImageDeletecomponent from "./ProductImageDeletePopup";
import { BiSolidImageAdd } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import { MdDelete } from "react-icons/md";
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { clearUserDetails } from "@/redux/userSlice";
import { useRouter } from "next/navigation";


interface ImageUploadPopupProps {
    setOPenUploadImg: any;
    isSelectedProductImgId: any
    productdata: any
    isOPenUploadImg: any
    isParentProductId: any

}

const ImageUploadPopup: React.FC<ImageUploadPopupProps> = ({ setOPenUploadImg, isSelectedProductImgId, productdata, isOPenUploadImg, isParentProductId }) => {
    const [newImg, setNewImg] = useState({ id: "", product: "", sequence_number: "", image: "", is_active: false, });
    const created_by = useSelector((state: any) => state?.user?.details?.id);
    const [isOpenDeletePopup, setOpenDeletePopup] = useState<boolean>(false);
    const [isfile, setfile] = useState("");
    const [fileName, setFileName] = useState("");
    const [isImgPreview, setImgPreview] = useState("")
    const [imgData, setImgData] = useState<any[]>([]);
    const [error, setError] = useState(false);;
    const [isSelectedImgId, setSelectedImgId] = useState("")
    const token = useSelector((state: any) => state?.user?.token);
    const dispatch = useDispatch();
    const router = useRouter();

    const handleCreateOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { id, sequence_number, image, is_active } = newImg;
        try {
            console.log(setSelectedImgId,"id")
            const response = await productImgApi(isSelectedProductImgId, sequence_number, image, is_active, created_by, token);
            console.log("response------------------>>>.", response)
            if (response?.error === "This sequence number already exists for this product image") {
                setError(true);
            } else if (response?.status === 201) {
                toast.success("Image Added successfully!");
                productdata()
                setError(false);
                setNewImg({ id: "", product: "", sequence_number: "", image: "", is_active: false, });
                setFileName("")
                fetchimgData();
            } else if (response?.error === "This QueryDict instance is immutable") {
                toast.success("Image is Required");
            } else if (response?.data?.message === "Invalid or expired token") {
                dispatch(clearUserDetails());
                toast.error("Session Expired, Please Login Again")
                router.push("/");
            }
        } catch (error) {
            toast.error("An error occurred while processing your request.");
            console.error("Error:", error);
        }
    };
    const fetchimgData = async () => {
        try {
            const response = await imgAllDataApi(isSelectedProductImgId, token);
            if (response?.body.images) {
                const filteredImages = response.body.images.filter((data: any) => data.image);
                setImgData(filteredImages);
            } else if (response?.body?.detail === "Invalid token") {
                dispatch(clearUserDetails());
                toast.error("Session Expired, Please Login Again")
                router.push("/");
            }
        } catch (error: any) {
            console.error("Error fetching product images:", error.message);
        }
    };
    useEffect(() => {
        fetchimgData();
    }, [isSelectedProductImgId]);

    const handleDelete = async (id: string) => {
        setSelectedImgId(id);
        setOpenDeletePopup(true);
    };
    const handleDeleteConfirm = async (isSelectedImgId: any) => {
        try {
            const response = await imgDeleteApi(isSelectedImgId, isSelectedProductImgId, token);
            if (response?.body.success) {
                toast.success("Image deleted successfully");
                productdata()
                fetchimgData();
                setOpenDeletePopup(false);
            } else if (response?.body.message === "Invalid or expired token ") {
                dispatch(clearUserDetails());
                toast.error("Session Expired, Please Login Again")
                router.push("/");
            }
        } catch (error) {
            toast.error("Failed to delete the product image.");
            console.error("Error:", error);
        }
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const file: any = e.target.files?.[0];
        setfile(file)
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === "string") {
                    setImgPreview(reader.result)
                    setNewImg((prev) => ({
                        ...prev, image: file,
                    }));
                    setFileName(file.name);
                    // console.log("reader.result ", reader.result)
                }
            };
            reader.readAsDataURL(file);
        }
    };
    return (
        <Transition.Root show={isOPenUploadImg} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-50"
                onClose={(value) => {
                    if (!value) setOPenUploadImg(false);
                }}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 flex items-center justify-center p-4 h-auto">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4"
                        enterTo="opacity-100 translate-y-0"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-4">
                        <Dialog.Panel className="bg-white h-auto w-full max-w-4xl rounded-lg shadow-lg relative overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <div className="w-full">
                                    <div className="flex justify-between items-center mb-4 p-4">
                                        <h2 className="text-xl font-semibold text-[#577C8E]">Upload Images</h2>
                                        <div
                                            className="cursor-pointer absolute top-0 rounded-tr-md right-0 flex justify-center items-center bg-red-600 w-16 h-8 text-white font-semibold"
                                            onClick={() => setOPenUploadImg(false)}>
                                            <RxCross2 size={20} />
                                        </div>
                                    </div>
                                    <form onSubmit={handleCreateOrUpdate} className="mb-4">
                                        <div className="flex justify-center items-center lg:flex-row flex-col w-full p-6">
                                            <div className="flex  h-56 w-60 lg:h-72 p-4">
                                                {newImg.image ? (
                                                    <img
                                                        src={isImgPreview}
                                                        alt="Uploaded"
                                                        className="w-full h-full  object-contain rounded-lg border border-gray-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 rounded-lg border-[1px]">
                                                        No Image Uploaded
                                                    </div>
                                                )}
                                            </div>
                                            <div className="lg:w-1/2 w-full flex flex-col justify-start gap-6 p-4">
                                                <div className="border-primary/30 border-[1px] bg-gray-50 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-gray-300 placeholder-black h-12">
                                                    <div className="flex bg-admin-secondary justify-center items-center px-4 rounded-md ">
                                                        <input
                                                            id="img"
                                                            name="img"
                                                            type="file"
                                                            placeholder="Upload Image"
                                                            onChange={handleFileChange}
                                                            accept=".jpeg,.png,"
                                                            required
                                                            className="block w-full text-sm text-admin-secondary file:mr-4 file:py-1 file:h-12 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-admin-secondary bg-admin-secondary file:text-white hover:file:bg-admin-secondary"
                                                        />
                                                        {fileName ? (
                                                            <span className="text-white px-2 w-full ">{fileName.length > 13 ? `${fileName.slice(0, 13)}...` : fileName}</span>
                                                        ) : (
                                                            <BiSolidImageAdd color="white" size={27} />
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <input
                                                        type="number"
                                                        placeholder="Image Sequence"
                                                        value={newImg.sequence_number}
                                                        onChange={(e) =>
                                                            setNewImg((prev: any) => ({
                                                                ...prev,
                                                                sequence_number: e.target.value,
                                                            }))
                                                        }
                                                        required
                                                        className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring focus:ring-purple-500 w-full"
                                                    />
                                                    {error && (
                                                        <p className="text-red-500 text-sm mt-2">This sequence number already exists</p>
                                                    )}
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="text-white px-4 py-3 rounded-lg bg-admin-buttonprimary">
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mb-4 overflow-x-auto px-4">
                                            {imgData.map((image, index) => (
                                                <div key={index} className="relative flex-shrink-0 w-28 h-28 border border-gray-300 rounded-lg overflow-hidden P-3">
                                                    <img
                                                        src={`${image?.image}`}
                                                        alt={`Uploaded ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div
                                                        onClick={() => handleDelete(image?.id)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs hover:bg-red-600">
                                                        <MdDelete size={20} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </form>
                                </div>
                                {isOpenDeletePopup && (<ProductImageDeletecomponent
                                    isOpenDeletePopup={isOpenDeletePopup}
                                    handleDeleteConform={() => handleDeleteConfirm(isSelectedImgId)}
                                    setIsLogoutDialogOpen={setOpenDeletePopup}
                                    setIsOpen={setOpenDeletePopup} />)}
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default ImageUploadPopup;
