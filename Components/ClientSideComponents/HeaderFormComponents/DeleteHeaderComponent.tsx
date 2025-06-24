"use client";

import { useRouter } from "next/navigation";
import { Fragment } from "react";
import { useDispatch } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";
import { MdLogout } from "react-icons/md";
import toast from "react-hot-toast";
import { clearUserDetails } from "@/redux/userSlice";

interface LogoutPopupProps {
    isOpenDeletePopup: boolean;
    setIsLogoutDialogOpen: any;
    setIsOpen: any;
    handleDeleteConform: () => void;
}

const DeleteHeaderComponent: React.FC<LogoutPopupProps> = ({
    isOpenDeletePopup,
    setIsLogoutDialogOpen,
    setIsOpen,
    handleDeleteConform
}) => {
    return (
        <Transition.Root show={isOpenDeletePopup} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-50"
                onClose={() => setIsLogoutDialogOpen(false)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0">
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
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0">
                                            <MdLogout className="h-6 w-6 text-red-600" aria-hidden="true" />
                                        </div>
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900 cursor-pointer">
                                                Delete Confirmation
                                            </Dialog.Title>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">
                                                Are you sure you want to delete this header?
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 flex sm:flex-row-reverse justify-between gap-3 cursor-pointer">
                                    <div onClick={handleDeleteConform}>
                                        <div>Delete</div>
                                    </div>
                                    <div onClick={() => setIsOpen(false)}>
                                        <div><p className="text-black">Cancel</p></div>
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

export default DeleteHeaderComponent;
