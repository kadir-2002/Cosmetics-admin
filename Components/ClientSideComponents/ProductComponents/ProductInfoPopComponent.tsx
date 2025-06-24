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

const ProductInfoPopComponent: React.FC<LogoutPopupProps> = ({
  role,
  isOpenInfoPopup,
  setIsInfoPopup,
  setIsOpen,
}) => {
  return (
    <Transition.Root show={isOpenInfoPopup} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-50'
        onClose={() => setIsInfoPopup(false)}
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
              <Dialog.Panel className='relative transform  text-left shadow-xl transition-all sm:my-8 lg:max-w-4xl w-full'>
                <div className='bg-white lg:h-[699px] h-[399px] py-4 overflow-scroll rounded-lg'>
                  <div className='py-2'>
                    <div className='grid grid-cols-1'>
                      {role?.description && (
                        <div className='flex gap-4 border-b-[1px] py-2 px-6'>
                          <div className='text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[20%] flex items-center justify-between'>
                            Description:
                          </div>
                          <div
                            className='text-lg text-gray-900 lg:w-[80%] w-[60%]'
                            dangerouslySetInnerHTML={{
                              __html: role?.description,
                            }}
                          />
                        </div>
                      )}
                      {role?.product_details && (
                        <div className='flex gap-4 border-b-[1px] py-2 px-6'>
                          <div className='text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[20%] flex items-center justify-between'>
                          Product Details:
                          </div>
                          <div
                            className='text-lg text-gray-900 lg:w-[80%] w-[60%]'
                            dangerouslySetInnerHTML={{
                              __html: role?.product_details,
                            }}
                          />
                        </div>
                      )}
                      {role?.care_instruction && (
                        <div className='flex gap-4 border-b-[1px] py-2 px-6'>
                          <div className='text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[20%] flex items-center justify-between'>
                          Product Care Instruction:
                          </div>
                          <div
                            className='text-lg text-gray-900 lg:w-[80%] w-[60%]'
                            dangerouslySetInnerHTML={{
                              __html: role?.care_instruction,
                            }}
                          />
                        </div>
                      )}
                      {role?.warranty && (
                        <div className='flex gap-4 border-b-[1px] py-2 px-6'>
                          <div className='text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[20%] flex items-center justify-between'>
                            Product Warranty:
                          </div>
                          <div
                            className='text-lg text-gray-900 lg:w-[80%] w-[60%]'
                            dangerouslySetInnerHTML={{
                              __html: role?.warranty,
                            }}
                          />
                        </div>
                      )}
                      {role?.delivery_or_installation_tips && (
                        <div className='flex gap-4 border-b-[1px] py-2 px-6'>
                          <div className='text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[20%] flex items-center justify-between'>
                            Product Delivery:
                          </div>
                          <div
                            className='text-lg text-gray-900 lg:w-[80%] w-[60%]'
                            dangerouslySetInnerHTML={{
                              __html: role?.delivery_or_installation_tips,
                            }}
                          />
                        </div>
                      )}
                      <div className='flex flex-col gap-4'>
                        {Object.entries(role?.variant_specifications || {}).map(
                          ([key, values]) => (
                            <div
                              key={key}
                              className='flex gap-2 border-b-[1px] py-2 px-6'
                            >
                              {/* Display the dynamic key name */}
                              <div className='text-lg text-[#577C8E] font-semibold w-[40%] lg:w-[20%] flex items-center justify-between capitalize'>
                                Product {key}:
                              </div>
                              {/* Display the dynamic values */}
                              <div className='text-lg text-gray-900 lg:w-[80%] w-[60%]'>
                                {Array.isArray(values)
                                  ? values.join(", ")
                                  : String(values)}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                      <div className='flex flex-col gap-4'>
                        {Object.entries(role?.specification || {}).map(
                          ([key, values]) => (
                            <div
                              key={key}
                              className='flex gap-2 border-b-[1px] py-2 px-6'
                            >
                              {/* Display the dynamic key name */}
                              <div className='text-lg text-[#577C8E] font-semibold w-[40%] lg:w-[20%] flex items-center justify-between capitalize'>
                                Product {key}:
                              </div>
                              {/* Display the dynamic values */}
                              <div className='text-lg text-gray-900 lg:w-[80%] w-[60%]'>
                                {Array.isArray(values)
                                  ? values.join(", ")
                                  : String(values)}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                      {role?.weight ? (
                        <div className='flex gap-2 border-b-[1px] py-2 px-6'>
                          <div className='text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[20%] flex items-center justify-between'>
                            Product Weight:
                          </div>
                          <div className='text-lg text-gray-900  lg:w-[80%] w-[60%]'>
                            {role?.weight}
                          </div>
                        </div>
                      ) : null}
                      {role?.length ? (
                        <div className='flex gap-2 border-b-[1px] py-2 px-6'>
                          <div className='text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[20%] flex items-center justify-between'>
                            Product Length:
                          </div>
                          <div className='text-lg text-gray-900  lg:w-[80%] w-[60%]'>
                            {role?.length}
                          </div>{" "}
                        </div>
                      ) : null}

                      {role?.width ? (
                        <div className='flex gap-2 border-b-[1px] py-2 px-6'>
                          <div className='text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[20%] flex items-center justify-between'>
                            Product width:
                          </div>
                          <div className='text-lg text-gray-900  lg:w-[80%] w-[60%]'>
                            {role?.width}
                          </div>
                        </div>
                      ) : null}
                      {role?.height ? (
                        <div className='flex gap-2 border-b-[1px] py-2 px-6'>
                          <div className='text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[20%] flex items-center justify-between'>
                            Product Height:
                          </div>
                          <div className='text-lg text-gray-900  lg:w-[80%] w-[60%]'>
                            {role?.height}
                          </div>
                        </div>
                      ) : null}
                      {role?.weight_bearing_number ? (
                        <div className='flex gap-2 border-b-[1px] py-2 px-6'>
                          <div className='text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[20%] flex items-center justify-between'>
                            Product Weight Bearing Number:
                          </div>
                          <div className='text-lg text-gray-900  lg:w-[80%] w-[60%]'>
                            {role?.weight_bearing_number} Kg
                          </div>
                        </div>
                      ) : null}
                      {role?.stackable_pieces_number ? (
                        <div className='flex gap-2 border-b-[1px] py-2 px-6'>
                          <div className='text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[20%] flex items-center justify-between'>
                            Product Stackable Pieces Number:
                          </div>
                          <div className='text-lg text-gray-900  lg:w-[80%] w-[60%]'>
                            {role?.stackable_pieces_number}
                          </div>
                        </div>
                      ) : null}

                      {role?.material ? (
                        <div className='flex gap-2 border-b-[1px] py-2 px-6'>
                          <div className='text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[20%] flex items-center justify-between'>
                            Product Material:
                          </div>
                          <div className='text-lg text-gray-900  lg:w-[80%] w-[60%]'>
                            {role?.material}
                          </div>
                        </div>
                      ) : null}

                      {role?.stock ? (
                        <div className='flex gap-2 border-b-[1px] py-2 px-6'>
                          <div className='text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[20%] flex items-center justify-between'>
                            Product Stock:
                          </div>
                          <div className='text-lg text-gray-900  lg:w-[80%] w-[60%]'>
                            {role?.stock}
                          </div>
                        </div>
                      ) : null}
                      {role?.low_stock_threshold ? (
                        <div className='flex gap-2 border-b-[1px] py-2 px-6'>
                          <div className='text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[20%] flex items-center justify-between'>
                            Low Stock Threshold:
                          </div>
                          <div className='text-lg text-gray-900  lg:w-[80%] w-[60%]'>
                            {role?.low_stock_threshold}
                          </div>
                        </div>
                      ) : null}

                      {role?.tags ? (
                        <div className='flex gap-2 border-b-[1px] py-2 px-6'>
                          <div className='text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[20%] flex items-center justify-between'>
                            Tag:
                          </div>
                          <div className='text-lg text-gray-900 lg:w-[80%] w-[60%] flex flex-wrap gap-2'>
                            {role?.tags?.map((tag: any) => (
                              <span
                                key={tag.id}
                                className='bg-gray-200 px-2 py-2 rounded-full text-sm text-gray-700'
                              >
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div
                  className='absolute top-0 right-0 cursor-pointer flex justify-center items-center bg-red-600 w-16 h-8 text-white font-semibold'
                  onClick={() => {
                    setIsOpen(false);
                    setIsInfoPopup(false);
                  }}
                >
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

export default ProductInfoPopComponent;
