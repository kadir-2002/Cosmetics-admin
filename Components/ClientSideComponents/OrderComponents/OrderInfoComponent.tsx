"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { RxCross2 } from "react-icons/rx";

interface LogoutPopupProps {
  role: any; 
  isOpenInfoPopup: boolean;
  setIsInfoPopup: (value: boolean) => void;
  setIsOpen: (value: boolean) => void;
}
// Define this function outside or in a utils file
// export const formatIST = (utcDateStr: string | undefined): string => {
//   if (!utcDateStr) return '';
//   return new Date(utcDateStr).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
// };

export const formatIST = (input?: string): string => {
  if (!input) return '';

  // Check if the string is already in the desired format
  const formattedPattern = /^[A-Za-z]+,\s\d{1,2}\s[A-Za-z]+\s\d{4},\s\d{2}:\d{2}(AM|PM)$/;
  if (formattedPattern.test(input.trim())) {
    return input;
  }

  const date = new Date(input);
  if (isNaN(date.getTime())) return 'Invalid date';

  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).replace(',', '');
};


const OrderInfoComponent: React.FC<LogoutPopupProps> = ({
  role,
  isOpenInfoPopup,
  setIsInfoPopup,
  setIsOpen,
}) => {
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 lg:max-w-4xl w-full">
                <div className="bg-white px-6 py-4">
                  <div className="px-6 py-2">
                    <div className="grid grid-cols-1">
                      <div className="flex gap-2 border-b-[1px] py-2">
                        <div className="text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[20%] flex items-center justify-between">Created At:</div>
                        <div className="text-lg text-gray-900  lg:w-[80%] w-[60%]"> {formatIST(role?.createdAt)}</div>
                      </div>
                      <div className="flex gap-2 border-b-[1px] py-2">
                        <div className="text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[20%] flex items-center justify-between">Updated At:</div>
                        <div className="text-lg text-gray-900  lg:w-[80%] w-[60%]"> {formatIST(role?.updatedAt)}</div>
                      </div> 
                        {/* <div  className="text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[20%] flex items-center justify-between">Updated By:</div> */}
                        {/* <div className="text-lg text-gray-900  lg:w-[80%] w-[60%]">{role?.order_info?.updated_by}</div> */}
                     
                    </div>
                  </div>
                </div>

                <div className="absolute top-0 right-0 cursor-pointer flex justify-center items-center bg-red-600 w-16 h-8 text-white font-semibold"  onClick={() => {
                      setIsOpen(false);
                      setIsInfoPopup(false);
                    }}>
                  <button
                   
                  >
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

export default OrderInfoComponent;
