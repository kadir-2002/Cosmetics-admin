"use client";

import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { clearUserDetails } from "@/redux/userSlice";
import toast from "react-hot-toast";
import { categryDataApi } from "@/apis/productApi";

interface LogoutPopupProps {
    handlefilter: any; // Expected to be an object containing details of a single role
    isCategoryFilterPopup: boolean;
    setCategoryFilterPopup: (value: boolean) => void;
    iscaegoryvalue: any;
}
interface Role {
    id: string;
    name: string;
    isActive: boolean;
}
const CategoryFilterpopupComponent: React.FC<LogoutPopupProps> = ({
    handlefilter,
    isCategoryFilterPopup,
    setCategoryFilterPopup,
    iscaegoryvalue,
}) => {
    const token = useSelector((state: any) => state?.user?.token);
    const [categry, setCategry] = useState<Role[]>([]);

    const dispatch = useDispatch();
    const router = useRouter();
    const fetchCategory = async () => {
        try {
            const response = await categryDataApi(token);
            if (response?.results) {
                setCategry(response?.results);
            } else if (response?.detail === "Invalid token") {
                dispatch(clearUserDetails());
                toast.error("Session Expired, Please Login Again")
                router.push("/");
            }

        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    useEffect(() => {
        fetchCategory();
    }, []);
    return (
        <Transition.Root show={isCategoryFilterPopup} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-50"
                onClose={() => setCategoryFilterPopup(false)}   >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-999" onClick={(event) => event.stopPropagation()}>
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 lg:max-w-sm w-full">
                                <div className="bg-white text-center w-full">
                                    <div className="flex items-start justify-between border-b-[2px] text-[#577C8E] p-4">
                                        <div className="w-full lg:text-xl text-xl font-semibold">
                                            Select Category
                                        </div>
                                    </div>
                                    <div
                                        className="w-full hover:bg-blue-100 lg:text-lg text-xl py-2 cursor-pointer border-b-[1px]"
                                        onClick={() => {
                                            handlefilter("");
                                            setCategoryFilterPopup(false);
                                        }}
                                    >
                                        All
                                    </div>
                                    {categry?.map((data: any, index: any) => (
                                        <ul key={index} className="text-sm text-black">
                                            <li
                                                className={`w-full lg:text-lg text-xl py-2 cursor-pointer border-b-[1px] ${iscaegoryvalue?.name === data.name ? "bg-gray-200" : "hover:bg-blue-100"
                                                    }`}
                                                onClick={() => handlefilter(data)}
                                            >
                                                {data?.name}
                                            </li>
                                        </ul>
                                    ))}

                                </div>
                                <div className="absolute top-0 right-0 cursor-pointer flex justify-center items-center bg-red-600 w-16 h-8 text-white font-semibold" onClick={() => {
                                    setCategoryFilterPopup(false);
                                }}>
                                    <button>
                                        <RxCross2 size={20} />
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default CategoryFilterpopupComponent;
