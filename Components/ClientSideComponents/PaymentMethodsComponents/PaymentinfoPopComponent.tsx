"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { RxCross2 } from "react-icons/rx";

interface LogoutPopupProps {
  role: any; // Expected to be an object containing details of a single role
  isOpenInfoPopup: boolean;
  setIsInfoPopup: (value: boolean) => void;
  setIsOpen: (value: boolean) => void;
  paymentDetails:any
}

const PaymentinfoPopComponent: React.FC<LogoutPopupProps> = ({
  role,
  isOpenInfoPopup,
  setIsInfoPopup,
  setIsOpen,
  paymentDetails

}) => {


    console.log("role",role,paymentDetails)
  return (
    <Transition.Root show={isOpenInfoPopup} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setIsInfoPopup(false)}   >
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 lg:max-w-4xl w-full">
                <div className="bg-white py-4">
                  <div className="py-2">
                    <div className="grid grid-cols-1">
                      <div className="flex gap-2 border-b-[1px] py-2 px-6">
                        <div className="text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[20%] flex items-center justify-between">Created By:</div>
                        <div className="text-lg text-gray-900  lg:w-[80%] w-[60%]">{role?.created_by}</div>
                      </div>
                      <div className="flex gap-2 border-b-[1px] py-2 px-6">
                        <div className="text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[20%] flex items-center justify-between">Created At:</div>
                        <div className="text-lg text-gray-900  lg:w-[80%] w-[60%]">{role?.created_at}</div>
                      </div>
                      <div className="flex gap-2 border-b-[1px] py-2 px-6">
                        <div className="text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[20%] flex items-center justify-between">Updated By:</div>
                        <div className="text-lg text-gray-900  lg:w-[80%] w-[60%]">{role?.updated_by}</div>
                      </div>
                      <div className="flex gap-2 border-b-[1px] py-2 px-6">
                        <div className="text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[20%] flex items-center justify-between">Updated At:</div>
                        <div className="text-lg text-gray-900  lg:w-[80%] w-[60%]">{role?.updated_at}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute top-0 right-0 cursor-pointer flex justify-center items-center bg-red-600 w-16 h-8 text-white font-semibold">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setIsInfoPopup(false);
                    }}
                  >
                    <RxCross2 size={20}  />
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

export default PaymentinfoPopComponent;
