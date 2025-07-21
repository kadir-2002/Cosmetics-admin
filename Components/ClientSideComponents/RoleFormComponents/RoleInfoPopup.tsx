"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { RxCross2 } from "react-icons/rx";
import { formatIST } from "../OrderComponents/OrderInfoComponent";

interface LogoutPopupProps {
  role: any; // Expected to be an object containing details of a single role
  isOpenInfoPopup: boolean;
  setIsInfoPopup: (value: boolean) => void;
  setIsOpen: (value: boolean) => void;
}

const RoleInfoPopup: React.FC<LogoutPopupProps> = ({
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
                <div  className='bg-white lg:h-[699px] h-[399px] py-4 overflow-scroll rounded-lg'>
                  <div className="py-2">
                    <div className="grid grid-cols-1">
                    {role?.title ? <div className="flex gap-2 border-b-[1px] py-2 px-6">
                        <div className="text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[20%] flex items-center justify-between">Title:</div>
                        <div className="text-lg text-gray-900  lg:w-[80%] w-[60%]">{role?.title}</div>
                      </div> : null}
                      {role?.heading ? <div className="flex gap-2 border-b-[1px] py-2 px-6">
                        <div className="text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[20%] flex items-center justify-between">Sub Heading:</div>
                        <div className="text-lg text-gray-900  lg:w-[80%] w-[60%]">{role?.heading}</div>
                      </div> : null}
                      {/* {role?.description ? <div className="flex gap-2 border-b-[1px] py-2 px-6">
                        <div className="text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[20%] flex items-center justify-between">Description:</div>
                        <div className="text-lg text-gray-900  lg:w-[80%] w-[60%]">{role?.description}</div>
                      </div> : null} */}
                      {role?.seo_description ? <div className="flex gap-2 border-b-[1px] py-2 px-6">
                        <div className="text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[20%] flex items-center justify-between">Seo Description:</div>
                        <div className="text-lg text-gray-900  lg:w-[80%] w-[60%]"   dangerouslySetInnerHTML={{
                              __html: role?.seo_description,
                            }}/>
                      </div> : null}
                      {role?.testimonial ? <div className="flex gap-2 border-b-[1px] py-2 px-6">
                        <div className="text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[20%] flex items-center justify-between">Testimonial:</div>
                        <div className="text-lg text-gray-900  lg:w-[80%] w-[60%]">{role?.testimonial}</div>
                      </div> : null}
                      {role?.created_by && <div className="flex gap-2 border-b-[1px] py-2 px-6">
                        <div className="text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[20%] flex items-center justify-between">Created By:</div>
                        <div className="text-lg text-gray-900  lg:w-[80%] w-[60%]">{role?.created_by}</div>
                      </div>}
                      {role?.created_at && <div className="flex gap-2 border-b-[1px] py-2 px-6">
                        <div className="text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[20%] flex items-center justify-between">Created At:</div>
                        <div className="text-lg text-gray-900  lg:w-[80%] w-[60%]">{formatIST(role?.created_at)}</div>
                      </div> }
                      {role?.updated_by && <div className="flex gap-2 border-b-[1px] py-2 px-6">
                        <div className="text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[20%] flex items-center justify-between">Updated By:</div>
                        <div className="text-lg text-gray-900  lg:w-[80%] w-[60%]">{role?.updated_by}</div>
                      </div> }
                      {
                        role?.updated_at &&
                      
                      <div className="flex gap-2 border-b-[1px] py-2 px-6">
                        <div className="text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[20%] flex items-center justify-between">Updated At:</div>
                        <div className="text-lg text-gray-900  lg:w-[80%] w-[60%]">{formatIST(role?.updated_at)}</div>
                      </div>
                      }
                      {
                        role?.createdAt &&
                      <div className="flex gap-2 border-b-[1px] py-2 px-6">
                        <div className="text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[20%] flex items-center justify-between">Created At:</div>
                        <div className="text-lg text-gray-900  lg:w-[80%] w-[60%]">{formatIST(role?.createdAt)}</div>
                      </div>
                      }
                      {
                        role?.expiresAt?
                      <div className="flex gap-2 border-b-[1px] py-2 px-6">
                        <div className="text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[20%] flex items-center justify-between">Expires At:</div>
                        <div className="text-lg text-gray-900  lg:w-[80%] w-[60%]">{formatIST(role?.expiresAt)}</div>
                      </div>
                      :null}
                      { role?.updatedAt &&
                      <div className="flex gap-2 border-b-[1px] py-2 px-6">
                        <div className="text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[20%] flex items-center justify-between">Updated At:</div>
                        <div className="text-lg text-gray-900  lg:w-[80%] w-[60%]">{formatIST(role?.updatedAt)}</div>
                      </div> }
                      { role?.createdBy &&
                      <div className="flex gap-2 border-b-[1px] py-2 px-6">
                        <div className="text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[20%] flex items-center justify-between">Created By At:</div>
                        <div className="text-lg text-gray-900  lg:w-[80%] w-[60%]">{role?.createdBy}</div>
                      </div> }
                      { role?.updatedBy &&
                      <div className="flex gap-2 border-b-[1px] py-2 px-6">
                        <div className="text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[20%] flex items-center justify-between">Updated By:</div>
                        <div className="text-lg text-gray-900  lg:w-[80%] w-[60%]">{role?.updatedBy}</div>
                      </div> }
                      { role?.slug &&
                      <div className="flex gap-2 border-b-[1px] py-2 px-6">
                        <div className="text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[20%] flex items-center justify-between">Slug:</div>
                        <div className="text-lg text-gray-900  lg:w-[80%] w-[60%]">{role?.slug}</div>
                      </div> }
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 cursor-pointer flex justify-center items-center bg-red-600 w-16 h-8 text-white font-semibold" onClick={() => {
                  setIsOpen(false);
                  setIsInfoPopup(false);}}>
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

export default RoleInfoPopup;
