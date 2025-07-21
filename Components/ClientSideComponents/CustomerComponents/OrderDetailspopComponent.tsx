import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";


type OrderItem = {
  quantity: number;
  name?: string;
  SKU?: string;
  selling_price?: number;
  specification?: string;
   price:number;
  variant?: {
    name?: string;
    SKU?: string;
    selling_price?: number;
   
  };
};

type OrderInfo = {
  id: string;
  purchased_item_count: number;
  order_info: {
    discount: string;
    discount_speding_title: string;
    discount_coupon_type: string;
    discount_coupon_code: string;
    discount_coupon_value: string;
    discount_speding_discount_percentage: string;
    discount_speding_discount_price: string;
    sub_total: number;
    tax: number;
    delivery_charge: number;
    final_total: number;
    created_at: string;
    updated_at: string;
  };
  totalAmount: number;
  taxType:number;
  appliedTaxRate:number;
  shippingRate:number;
  taxAmount:number;
  discountAmount:number;
  abandentDiscountAmount:number;
  payment_info: {
    payment_type: string;
  };
  items: OrderItem[];
};

type Props = {
  selectedOrder: OrderInfo | null;
  setPopupVisible: (visible: boolean) => void;
  isPopupVisible: boolean;
  singleCustomerOrder: any;
};
const OrderDetailsPopup = ({
  isPopupVisible,
  setPopupVisible,
  selectedOrder,
  singleCustomerOrder,
}: Props) => {
  const currency = useSelector(
    (state: any) => state?.user?.details?.currency_symbol
  );

  return (
    <Transition.Root show={isPopupVisible} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-50'
        onClose={() => setPopupVisible(false)}
      >
        {/* Overlay with fade animation */}
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
            <Dialog.Panel className='bg-white rounded-2xl shadow-xl max-w-2xl h-[500px] w-full relative  overflow-scroll hidescroll'>
              <div className="bg-admin-primary  w-full py-2">
                <h2 className='text-xl mx-4 font-semibold p-2 text-white'>
                  Order Items
                </h2>
                </div>
              <div className='w-full text-lg mt-4 mb-2 border border-gray-200 rounded-lg'>
                
                <div className=''>
                  {selectedOrder?.items?.map((data: any, index: number) => (
                    <div key={index} className="border-b-[1px] p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                        <p>Product:</p>
                        <h3 className="text-lg">
                          {data?.variant?.name || data?.product?.name || "Unnamed Product"}
                        </h3>
                        </div>
                        <div className="flex gap-2">
                          <p>Quantity:</p>
                          <p>{data.quantity}</p>
                        </div>
                      </div>

                      <div className="lg:flex justify-between items-center mt-1">
                        <div className="flex gap-2">
                          <p>SKU:</p>
                          <p>{data?.variant?.SKU || data?.product?.SKU || "N/A"}</p>
                        </div>
                        <div className="flex gap-2 font-semibold">
                          <p>Price {currency}</p>
                          <p>{Number(data?.product?.sellingPrice).toFixed(2)|| Number(data?.variant?.sellingPrice).toFixed(2) || "NA"}</p>
                        </div>
                      </div>

                      <ul className="text-md grid lg:grid-cols-3 grid-cols-2 justify-center items-center gap-2">
                        {data.specification &&
                          Object.entries(
                            JSON.parse(data.specification.replace(/'/g, '"'))
                          ).map(([key, value]: [string, any]) => (
                            <li key={key} className="flex gap-2">
                              <p className="font-semibold">
                                {key.charAt(0).toUpperCase() + key.slice(1)}:
                              </p>
                              <p>{value}</p>
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              <div className='px-3 text-lg'>
                {/* <div className='flex justify-between items-center'>
                  <p>Total Items:</p>
                  <p>{selectedOrder?.items[0]?.quantity || "N/A"}</p>
                </div> */}
                {/* <div className='flex justify-between items-center'>
                  <p>Sub Total:</p>{" "}
                  <p>
                    {currency}
                    {(Number(selectedOrder?.items[0]?.price) * Number(selectedOrder?.items[0]?.quantity)).toFixed(2) ||"0.00"}
                  </p>
                </div> */}
                {selectedOrder?.appliedTaxRate ? (
                  <div className='flex justify-between items-center'>
                    <p>Tax:</p>{" "}
                    <p>
                      {currency}
                     {selectedOrder?.taxType} : {selectedOrder?.appliedTaxRate??  "0.00%"}
                    </p>
                  </div>
                ) : null}
                 {selectedOrder?.taxAmount ? (
                  <div className='flex justify-between items-center'>
                    <p>Tax Amount:</p>{" "}
                    <p>
                      {currency}
                   {selectedOrder?.taxAmount?.toFixed(2) ||"0.00"}
                    </p>
                  </div>
                ) : null}
                {selectedOrder?.shippingRate === 0 ? null :(
                  <div className='flex justify-between items-center'>
                    <p>Delivery Charge:</p>{" "}
                    <p>
                      {currency}
                      {selectedOrder?.shippingRate.toFixed(2) ?? "0.00"}
                    </p>
                  </div>
                ) }
                {selectedOrder?.order_info?.discount_speding_title ? (
                  <div className='flex justify-between  border-b-[1px]'>
                    <p>Total Discount:</p>
                    {selectedOrder?.order_info?.discount_speding_title ? (
                      <p>
                        {selectedOrder?.order_info?.discount_speding_title} (
                        {selectedOrder?.order_info?.discount_speding_discount_percentage
                          ? `${selectedOrder.order_info.discount_speding_discount_percentage}%`
                          : `${selectedOrder?.order_info?.discount_speding_discount_price}₹`}
                        )
                      </p>
                    ) : null}

                    <p>{selectedOrder?.order_info?.discount}</p>
                  </div>
                ) : null}
                {selectedOrder?.order_info?.discount ? (
                  <div className='flex justify-between  border-b-[1px]'>
                    <p>Total Discount:</p>
                    {selectedOrder?.order_info?.discount_coupon_type ? (
                      <p>
                        {selectedOrder?.order_info?.discount_coupon_type} (
                        {selectedOrder?.order_info
                          ?.discount_coupon_value
                          ? `${selectedOrder.order_info.discount_coupon_value}₹`
                          : `${selectedOrder?.order_info?.discount_coupon_value}₹`}
                        )
                      </p>
                    ) : null}

                    <p>{Number(selectedOrder?.discountAmount || 0).toFixed(2)}</p>
                  </div>
                ) : null}

                <div className='flex justify-between items-center font-semibold text-[#577C8E]'>
                  <p className=''>Final Total:</p>{" "}
                  <p>
                    {currency}
                    {selectedOrder?.totalAmount != null
                      ? Number(selectedOrder.totalAmount).toFixed(2)
                      : "0"}
                  </p>
                </div>
              </div>

              <div
                className='absolute top-0 right-0 cursor-pointer flex justify-center items-center bg-red-600 w-16 h-8 text-white font-semibold'
                onClick={() => setPopupVisible(false)}
              >
                <div className='p-2 '>
                  <RxCross2 size={26} />
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default OrderDetailsPopup;
