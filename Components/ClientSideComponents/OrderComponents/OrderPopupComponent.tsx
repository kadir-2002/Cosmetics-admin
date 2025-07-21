"use client";
import React, { Fragment, useState } from "react";
import { Transition } from "@headlessui/react";
import { FaCircleArrowDown, FaCircleUser } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import { Dialog } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

type ProductImage = {
  id: number;
  image: string;
  sequence?: number;
  productId?: number;
};

type OrderItem = {
  id: number | null;
  orderId: number | null;
  productId: number | null;
  variantId: number | null;
  quantity: number;
  price: number;
  totalAmount:number;
  product: {
    id: number | null;
    name: string | null;
    SKU: string | null;
    image?: string | null;
    // category?: string | null;
    specification?: string | null;
    variant: any | null;
    images: ProductImage[];
    category: {
      name: string;
    };
  };
};

const OrderPopup = ({
  isVisible,
  onClose,
  role,
  setPopupVisible,
  isPopupVisible,
}: any) => {
  const router = useRouter();
  const [activeDrawer, setActiveDrawer] = useState<string | null>(
    "Customer Details"
  );
  const currency = useSelector(
    (state: any) => state?.user?.details?.currency_symbol
  );

  const getStatusClass = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-[#34A864]";
      case "SHIPPED":
        return "bg-[#3485A8]";
      case "PENDING":
        return "bg-[#A8A434]";
      case "CANCELLED":
        return "bg-[#A83434]";
      default:
        return "bg-[#ff7800]";
    }
  };
  const getPayStatusClass = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-[#34A864]";
      case "SHIPPED":
        return "bg-[#3485A8]";
      case "PENDING":
        return "bg-[#A8A434]";
      case "CANCELLED":
        return "bg-[#A83434]";
      default:
        return "bg-[#ff7800]";
    }
  };
  const [selectedOption, setSelectedOption] = useState("Customer Details");

  const handleSelection = (event: any) => {
    setSelectedOption(event.target.value);
    toggleDrawer(event.target.value);
  };
  const toggleDrawer = (drawer: string) => {
    setActiveDrawer(activeDrawer === drawer ? null : drawer);
  };

  return (
    <Transition.Root show={isPopupVisible} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-50'
        onClose={() => setPopupVisible(false)}
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

        <div className='fixed inset-0 flex items-center justify-center p-4'>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            enterTo='opacity-100 translate-y-0 sm:scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 translate-y-0 sm:scale-100'
            leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
          >
            <Dialog.Panel className='relative bg-white w-[96%]  lg:max-w-5xl rounded-lg shadow-lg overflow-auto max-h-[90%] hidescroll'>
              <div className='p-4 border-b-[1px] bg-admin-primary  flex lg:flex-row flex-col justify-between lg:items-center'>
                <div className='flex gap-3 text-lg font-semibold mt-5'>
                  <p className='text-white'>Order ID:</p>
                  <p className='text-white'>{role?.id}</p>
                </div>
                <div className='flex gap-3 text-lg font-semibold mt-5'>
                  <p className='text-white'>Payment Method:</p>
                  <p className='text-white'>
                    {role?.payment.method === 'RAZORPAY' ? 'ONLINE' : role?.payment.method}
                  </p>
                </div>
                <div className='flex gap-3 text-lg font-semibold mt-5'>
                  <p className='text-white'>Payment Status:</p>
                  <p
                    className={`text-white py-1 px-3 rounded-md ${getPayStatusClass(
                      role?.payment.status
                    )}`}
                  >
                    {role?.payment.status}
                  </p>
                </div>
                <div className='flex gap-3 text-lg font-semibold mt-5'>
                  <p className='text-white'>Order Status:</p>
                  <p
                    className={`text-white py-1 px-3 rounded-md ${getStatusClass(
                      role?.status
                    )}`}
                  >
                    {role?.status}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className='absolute top-0 right-0 cursor-pointer flex justify-center items-center bg-red-600 w-16 h-8 text-white font-semibold'
                >
                  <RxCross1 size={20} />
                </button>
              </div>
              <div className='lg:px-6 m-2 px-3'>
                <div className='lg:flex justify-between w-full border-[2px] lg:px-6 px-2 rounded-lg hidden '>
                  {["Customer Details", "Order", "Order Summary"].map(
                    (item) => (
                      <div
                        key={item}
                      className={`flex items-center gap-3 cursor-pointer py-3 px-4 rounded-md transition-all
      ${activeDrawer === item ? "bg-gray-100 border-b-4 border-admin-buttonprimary" : ""}
    `}
                        onClick={() => toggleDrawer(item)}
                      >
                        <h3
                          className={`lg:text-xl text-lg font-semibold py-2 transition-colors ${activeDrawer === item
                              ? "text-gray-500"
                              : "text-[#696AA2]"
                            }`}
                        >
                          {item}
                        </h3>
                        <FaCircleArrowDown
                          size={25}
                          className={`transition-transform ${activeDrawer === item ? "rotate-180" : "rotate-0"
                            }`}
                        />
                      </div>
                    )
                  )}
                </div>

                <div className='w-full border-2 px-2 mt-2 rounded-lg lg:hidden'>
                  <div className='flex items-center gap-3 cursor-pointer py-3 '>
                    <select
                      className='w-full bg-transparent text-lg font-semibold  underline py-2 border-none outline-none cursor-pointe'
                      value={selectedOption}
                      onChange={handleSelection}
                    >
                      {/* <option value="" disabled>Select an option</option> */}
                      <option value='Customer Details'>Customer Details</option>
                      <option value='Order'>Order</option>
                      <option value='Order Summary'>Order Summary</option>
                    </select>
                    {/* <FaCircleArrowDown size={25} className={`transition-transform ${selectedOption ? "rotate-180" : "rotate-0"}`} /> */}
                  </div>
                </div>

                {activeDrawer === "Customer Details" && (
                  <div className='lg:text-lg text-sm border-b-[1px] p-3'>
                    <p className=' border-b-[1px] py-2'>
                      <strong>Customer Name:</strong>{" "}
                      {role?.address?.fullName}
                    </p>
                    <p className=' border-b-[1px] py-2'>
                      <strong>Phone No:</strong>{" "}
                      {role?.address?.phone}
                    </p>
                    <p className=' border-b-[1px] py-2'>
                      <strong>Email:</strong>{" "}
                      <span className='w-full break-words'>
                        {role?.user?.email}
                      </span>
                    </p>
                    <p className=' border-b-[1px] py-2'>
                      <strong>Billing Address:</strong>{" "}
                      {role?.billingAddress} 
                      {/* {role?.address?.city},{role?.address?.state},{role?.address?.pincode} */}
                    </p>
                    <p className=' border-b-[1px] py-2'>
                      <strong>Delivery Address:</strong>{" "}
                      {role?.shippingAddress} 
                      {/* {role?.address?.city},{role?.address?.state},{role?.address?.pincode} */}
                    </p>
                  </div>
                )}
                {activeDrawer === "Order" && (
                  <div className='overflow-x-auto p-4'>
                    <table className='min-w-full border border-gray-300 text-sm lg:text-lg shadow-md rounded-lg'>
                      <thead className='bg-indigo-100 text-gray-700'>
                        <tr className='text-left'>
                          <th className='border p-3'>S/N</th>
                          <th className='border p-3'>Image</th>
                          <th className='border p-3'>SKU</th>
                          <th className='border p-3'>Product Name</th>
                          <th className='border p-3'>Category</th>
                          <th className='border p-3'>Price</th>
                          <th className='border p-3'>Qty</th>
                          <th className='border p-3'>Total</th>
                        </tr>
                      </thead>
                      <tbody className='bg-white'>
                        {role?.items?.map((item: OrderItem, index: number) => (
                          <tr
                            key={index}
                            className='border cursor-pointer hover:bg-purple-100 text-gray-700'
                            onClick={() =>
                              router.push(`/product?id=${item.product?.id}`)
                            }
                          >
                            <td className='border p-3 text-center'>{index + 1}</td>

                            <td className='border p-3'>
                              {item?.product?.images?.[0]?.image ? (
                                <img
                                  src={item.product.images[0].image}
                                  alt='Product'
                                  className='w-16 h-16 object-cover rounded'
                                />
                              ) : (
                                <div className='h-12 w-12 bg-gray-200 flex items-center justify-center rounded-full'>
                                  <img
                                    src='/product.png'
                                    alt='Default'
                                    className='lg:h-16 lg:w-16 h-12 w-12 object-contain p-2 rounded-full'
                                  />
                                </div>
                              )}
                            </td>

                            <td className='border p-3 text-center'>
                              {item.product?.SKU || 'N/A'}
                            </td>

                            <td className='border p-3'>
                              <span className='text-blue-600 font-semibold'>
                                {item.product?.name || 'N/A'}
                              </span>
                            </td>

                            <td className='border p-3 text-center'>
                              {item.product?.category?.name || 'N/A'}
                            </td>

                            <td className='border p-3 text-center'>
                              {currency}
                              {item?.price.toFixed(2) || 'N/A'}
                            </td>

                            <td className='border p-3 text-center'>
                              {item?.quantity || 'N/A'}
                            </td>

                            <td className='border p-3 text-center'>
                              {currency}
                            {((item?.price || 0) * (item?.quantity || 0)).toFixed(2)}
                            </td>
                          </tr>
                        ))}

                      </tbody>
                    </table>
                  </div>
                )}
                {activeDrawer === "Order Summary" && (
                  <div className='gap-2 py-2 lg:text-lg text-sm'>
                    <div className='flex justify-between p-2 border-b-[1px] font-semibold'>
                      <p>Total Product:</p>
                      <p>{role?.items?.length}</p>
                    </div>
                    <div className='flex justify-between p-2 border-b-[1px] font-semibold'>
                      <p>SubTotal Price:</p>
                      <p>{role?.subtotal.toFixed(2) || "N/A"}</p>
                    </div>

                    {role?.shippingRate=== 0 ? null : (
                      <div className='flex justify-between p-2 border-b-[1px] font-semibold'>
                        <p>Shipping Charge:</p>
                        <p>{role?.shippingRate.toFixed(2)|| "N/A"}</p>
                      </div>
                    )}
                    {role?.appliedTaxRate === 0 ? null : (
                      <div className='flex justify-between p-2 border-b-[1px] font-semibold'>
                        <p> Total Rate:</p>
                        <p>{role?.taxType} : {role?.appliedTaxRate || "N/A"}%</p>
                      </div>
                    )}
                     {role?.taxAmount === 0 ? null : (
                      <div className='flex justify-between p-2 border-b-[1px] font-semibold'>
                        <p> Total TaxAmount:</p>
                        <p> {role?.taxAmount || "N/A"}</p>
                      </div>
                    )}

                    {role?.discountCode ? (
                      <div className='flex justify-between p-2 border-b-[1px] font-semibold'>
                        <p>Coupon Code:</p>
                        <p className="">{role?.discountCode || "N/A"}</p>
                      </div>
                    ) : null}
                    {role?.discountAmount === 0 ? null : (
                      <div className='flex justify-between p-2 border-b-[1px] font-semibold'>
                        <p>Coupon Discount:</p>
                        <p>
                          &#8377;{role?.discountAmount || "N/A"}
                        </p>
                      </div>
                    )}
                    {role?.abandentDiscountAmount === 0 ? null : (
                      <div className='flex justify-between p-2 border-b-[1px] font-semibold'>
                        <p>Abandoned Discount:</p>
                        <p>{(role?.abandentDiscountAmount)}</p>
                      </div>
                    ) }

                    {role?.order_info?.discount ? (
                      <div className='flex justify-between p-2 border-b-[1px] font-semibold'>
                        <p>Total Discount:</p>
                        {role?.order_info?.discount_speding_title ? (
                          <p>
                            {role?.order_info?.discount_speding_title} (
                            {role?.order_info
                              ?.discount_speding_discount_percentage
                              ? `${role?.order_info?.discount_speding_discount_percentage}%`
                              : `${role?.order_info?.discount_speding_discount_price}₹`}
                            )
                          </p>
                        ) : null}

                        <p>{(role?.order_info?.discount).toFixed(2)}</p>
                      </div>
                    ) : null}

                    <div className='flex justify-between p-2 border-b-[1px] text-[#696AA2]'>
                      <p className='lg:text-xl text-lg font-semibold'>
                        Final Total:
                      </p>
                      <p className='lg:text-xl text-lg font-semibold'>
                        {currency}
                        {(role?.totalAmount.toFixed(2))}
                      </p>
                    </div>
                    {role?.payment_info?.payment_transaction_id ? (
                      <div className='flex text-lg text-[#696AA2] justify-between'>
                        <p className='text-md font-semibold '>
                          Transaction ID:
                        </p>
                        <p className='text-black'>
                          {role?.payment?.transactionId || "N/A"}
                        </p>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default OrderPopup;
