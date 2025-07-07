"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { RxCross2 } from "react-icons/rx";
import { formatIST } from "../OrderComponents/OrderInfoComponent";

interface LogoutPopupProps {
  user: any;
  isUserInfo: boolean;
  setIsuserInfo: any;
  setIsOpen: any;
}

const UserInfoPopupComponent: React.FC<LogoutPopupProps> = ({
  user,
  isUserInfo,
  setIsuserInfo,
  setIsOpen,
}) => {
  return (
    <Transition.Root show={isUserInfo} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-50'
        onClose={() => setIsuserInfo(false)}
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
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 lg:max-w-4xl w-full'>
              <div className='bg-white h-full py-4 overflow-scroll rounded-lg'>
                  <div className='px-6 py-2'>
                    <div className='grid grid-cols-1'>
                      {user?.address ? (
                        <div className='flex border-b-[1px] py-2'>
                          <div className='text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[16%] flex items-center justify-between'>
                            Address:
                          </div>
                          <div className='text-lg text-gray-900  lg:w-[83%] w-[60%]'>
                            {user?.address}
                          </div>
                        </div>
                      ) : null}
                      {user?.locality ? (
                        <div className='flex border-b-[1px] py-2'>
                          <div className='text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[16%] flex items-center justify-between'>
                            Locality:
                          </div>
                          <div className='text-lg text-gray-900  lg:w-[83%] w-[60%]'>
                            {user?.locality}
                          </div>
                        </div>
                      ) : null}
                      {user?.seo_title ? (
                        <div className='flex border-b-[1px] py-2'>
                          <div className='text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[16%] flex items-center justify-between'>
                            Seo Title:
                          </div>
                          <div className='text-lg text-gray-900  lg:w-[83%] w-[60%]'>
                            {user?.seo_title}
                          </div>
                        </div>
                      ) : null}
                      {user?.seo_metadata  ? (
                        <div className='flex border-b-[1px] py-2'>
                          <div className='text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[16%] flex items-center justify-between'>
                          Seo Metadata:
                          </div>
                          <div className='text-lg text-gray-900  lg:w-[83%] w-[60%]'>
                            {user?.seo_metadata}
                          </div>
                        </div>
                      ) : null}
                      {user?.content ? (
                        <div className='flex border-b-[1px] py-2'>
                          <div className='text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[16%] flex items-center justify-between'>
                            Content:
                          </div>
                          <div
                            className='text-lg text-gray-900  lg:w-[83%] w-[60%]'
                            dangerouslySetInnerHTML={{
                              __html: user?.content,
                            }}
                          />
                        </div>
                      ) : null}

                      {user?.description ? (
                        <div className='flex  border-b-[1px] py-2'>
                          <div className='text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[16%] flex items-center justify-between'>
                            Description:
                          </div>
                          <div className='text-lg text-gray-900  lg:w-[83%] w-[60%]'>
                            {user?.description}
                          </div>
                        </div>
                      ) : null}
                      {user?.button_text ? (
                        <div className='flex  border-b-[1px] py-2'>
                          <div className='text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[16%] flex items-center justify-between'>
                            Button Text:
                          </div>
                          <div className='text-lg text-gray-900  lg:w-[83%] w-[60%]'>
                            {user?.button_text}
                          </div>
                        </div>
                      ) : null}
                      {user?.button_link ? (
                        <div className='flex  border-b-[1px] py-2'>
                          <div className='text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[16%] flex items-center justify-between'>
                            Button Link:
                          </div>
                          <div className='text-lg text-gray-900  lg:w-[83%] w-[60%]'>
                            {user?.button_link}
                          </div>
                        </div>
                      ) : null}
                      {
                        user?.created_by?(
                             <div className='flex border-b-[1px] py-2'>
                        <div className='text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[16%] flex items-center justify-between'>
                          Created By:
                        </div>
                        <div className='text-lg text-gray-900  lg:w-[83%] w-[60%]'>
                          {user?.created_by}
                        </div>
                      </div>
                        ):null
                      }
                     
                      {user?.date_joined ? (
                        <div className='flex gap-2 border-b-[1px] py-2'>
                          <div className='text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[16%] flex items-center justify-between'>
                            Date of join:
                          </div>
                          <div className='text-lg text-gray-900  lg:w-[83%] w-[60%]'>
                            {user?.date_joined}
                          </div>
                        </div>
                      ) : null}
                      {user?.last_login ? (
                        <div className='flex gap-2 border-b-[1px] py-2'>
                          <div className='text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[16%] flex items-center justify-between'>
                            Last Login :
                          </div>
                          <div className='text-lg text-gray-900  lg:w-[83%] w-[60%]'>
                            {user?.last_login}
                          </div>
                        </div>
                      ) : null}
                      {user?.createdAt ? (
                        <div className='flex border-b-[1px] py-2'>
                          <div className='text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[16%] flex items-center justify-between'>
                            Created At:
                          </div>
                          <div className='text-lg text-gray-900  lg:w-[83%] w-[60%]'>
                            {formatIST(user?.createdAt)}
                          </div>
                        </div>
                      ) : null}
                      {/* <div className='flex border-b-[1px] py-2'>
                        <div className='text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[16%] flex items-center justify-between'>
                          Updated By:
                        </div>
                        <div className='text-lg text-gray-900  lg:w-[83%] w-[60%]'>
                          {user?.updated_by}
                        </div>
                      </div> */}
                      <div className='flex  border-b-[1px] py-2'>
                        <div className='text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[16%] flex items-center justify-between'>
                          Updated At:
                        </div>
                        <div className='text-lg text-gray-900  lg:w-[83%] w-[60%]'>
                          {formatIST(user?.updatedAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className='absolute top-0 right-0 cursor-pointer flex justify-center items-center bg-red-600 w-16 h-8 text-white font-semibold'
                  onClick={() => setIsOpen(false)}
                >
                  <div className='p-2'>
                    <RxCross2 size={16} />
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

export default UserInfoPopupComponent;
