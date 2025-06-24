"use client";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { RxCross2 } from "react-icons/rx";

interface LogoutPopupProps {
    handleCouponTypefilter: any; // Expected to be an object containing details of a single role
    isCouponTypeFilterPopupOpen: boolean;
    setIsCouponTypeFilterPopupOpen: (value: boolean) => void;
    isfilterCouponType: string
}


const CouponTypeFilterPopup: React.FC<LogoutPopupProps> = ({
    handleCouponTypefilter,
    isCouponTypeFilterPopupOpen,
    setIsCouponTypeFilterPopupOpen,
    isfilterCouponType
}) => {
    return (
        <Transition.Root show={isCouponTypeFilterPopupOpen} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-50"
                onClose={() => setIsCouponTypeFilterPopupOpen(false)}   >
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
                                    <div
                                        className="w-full hover:bg-blue-100 lg:text-lg text-xl py-2 cursor-pointer border-b-[1px]"
                                        onClick={() => {
                                            handleCouponTypefilter("All");
                                            setIsCouponTypeFilterPopupOpen(false);
                                        }}
                                    >
                                        All
                                    </div>

                                    <ul className="text-sm text-black">
                                        <li
                                            className={`${isfilterCouponType === "Percentage" ? "bg-blue-100" : "bg-white"} w-full hover:bg-blue-100 lg:text-lg text-xl py-2 cursor-pointer border-b-[1px]  `}
                                            onClick={() => handleCouponTypefilter("Percentage")}
                                        >
                                            Percentage
                                        </li>
                                        <li
                                            className={`${isfilterCouponType === "Flat" ? "bg-blue-100" : "bg-white"} w-full hover:bg-blue-100 lg:text-lg text-xl py-2 cursor-pointer border-b-[1px]`}
                                            onClick={() => handleCouponTypefilter("Flat")}
                                        >
                                            Flat
                                        </li>
                                    </ul>
                                </div>
                                <div className="absolute top-0 right-0 cursor-pointer flex justify-center items-center bg-red-600 w-16 h-8 text-white font-semibold" onClick={() => {
                                    setIsCouponTypeFilterPopupOpen(false);
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

export default CouponTypeFilterPopup;
