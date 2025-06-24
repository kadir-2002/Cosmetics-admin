"use client";
import React from "react";
import Image from "next/image";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import { useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import Link from "next/link";

export const TotalUser = ({ graphData, startDate, endDate }: any) => {
  const formatDate = (date: Date | null): string => {
    if (!date) return ""; // Return an empty string instead of null
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Format as "YYYY-MM-DD"
  };
  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);
  return (
    <Link
      href={`/order?start_date=${formattedStartDate}&end_date=${formattedEndDate}`}
    >
      <div className='w-full flex md:flex-row flex-col items-center md:justify-start justify-between md:py-4 md:px-4 py-4 px-2 border-[3px] border-gray-200 md:h-[120px] h-[160px] bg-white rounded-lg gap-2'>
        <div className='md:h-16 h-14 md:w-16 w-14 md:ml-6 ml-2 rounded-full flex justify-center items-center border-[2px] border-[#8155FF] bg-[#8155FF] p-2'>
          <Image
            src='/Bag-Fill--Streamline-Bootstrap.png'
            alt='Total-Referral-Icon'
            width={550}
            height={420}
            className=' object-contain md:h-10 h-8 md:w-10 w-8'
          />
        </div>
        <div className='flex flex-col  justify-center items-center'>
          <span className='text-[#577C8E] font-medium md:text-xl text-base'>
            Products Sold
          </span>
          {/* <Link
          href={`/dashboard/track-referrals?statusQuery=all&selectedService=${selectedService?.service_type}`}
        > */}
          <p className='text-black lg:text-[32px] text-[24px] font-semibold'>
            {graphData?.products_sold}
          </p>
          {/* </Link> */}
        </div>
      </div>
    </Link>
  );
};
export const TotalProduct = ({ graphData,startDate,endDate }: any) => {

  const formatDate = (date: Date | null): string => {
    if (!date) return ""; // Return an empty string instead of null
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Format as "YYYY-MM-DD"
  };
  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);
  return (
    <Link
    href={`/customers?start_date=${formattedStartDate}&end_date=${formattedEndDate}`}
  >
    <div className='w-full flex md:flex-row flex-col items-center md:justify-start justify-between md:py-4 md:px-4 py-4 px-2 border-[3px] border-gray-200 md:h-[120px] h-[160px] bg-white rounded-lg gap-2'>
      <div className='md:h-16 h-14 md:w-16 w-14 md:ml-6 ml-2 rounded-full flex justify-center items-center border-[2px] border-[#18BFFF] bg-[#18BFFF]'>
        <Image
          src='/User-Multiple-Group--Streamline-Core.png'
          alt='Total-Referral-Icon'
          width={550}
          height={420}
          className=' object-contain md:h-10 h-8 md:w-10 w-8'
        />
      </div>
      <div className='flex flex-col  justify-center items-center'>
        <span className='text-[#577C8E] font-medium md:text-xl text-base'>
          New Customers
        </span>
        {/* <Link
          href={`/dashboard/track-referrals?statusQuery=all&selectedService=${selectedService?.service_type}`} */}
        {/* > */}
        <p className='text-black lg:text-[32px] text-[24px] font-semibold'>
          {graphData?.new_customer_count}
        </p>
        {/* </Link> */}
      </div>
    </div>
    </Link>
  );
};
export const TotalOrder = ({ graphData, startDate, endDate }: any) => {
  const formatDate = (date: Date | null): string => {
    if (!date) return ""; // Return an empty string instead of null
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Format as "YYYY-MM-DD"
  };
  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);
  return (
    <Link
      href={`/order?start_date=${formattedStartDate}&end_date=${formattedEndDate}`}
    >
      <div className='w-full flex md:flex-row flex-col items-center md:justify-start justify-between md:py-4 md:px-4 py-4 px-2 border-[3px] border-gray-200 md:h-[120px] h-[160px] bg-white rounded-lg gap-2'>
        <div className='md:h-16 h-14 md:w-16 w-14 md:ml-6 ml-2 rounded-full flex justify-center items-center border-[2px] border-[#3FD97F] bg-[#3FD97F]'>
          <Image
            src='/image_2025_01_20T08_50_47_457Z.png'
            alt='Total-Referral-Icon'
            width={550}
            height={420}
            className=' object-contain md:h-10 h-8 md:w-10 w-8'
          />
        </div>
        <div className='flex flex-col  justify-center items-center'>
          <span className='text-[#577C8E] font-medium md:text-xl text-base'>
            Average Orders
          </span>
          {/* <Link
          href={`/dashboard/track-referrals?statusQuery=all&selectedService=${selectedService?.service_type}`}
        > */}
          <p className='text-black lg:text-[32px] text-[24px] font-semibold'>
            {graphData?.average_order_value}
          </p>
          {/* </Link> */}
        </div>
      </div>
    </Link>
  );
};

export const TotalRevenue = ({ graphData, startDate, endDate }: any) => {
  const currency = useSelector(
    (state: any) => state?.user?.details?.currency_symbol
  );
  const formatDate = (date: Date | null): string => {
    if (!date) return ""; // Return an empty string instead of null
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Format as "YYYY-MM-DD"
  };
  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);
  const formatNumber = (value: number): string => {
    if (value >= 1_000_000) {
      return Math.floor(value / 1_000_000) + "m";
    } else if (value >= 1_000) {
      return Math.floor(value / 1_000) + "k";
    } else {
      return Math.floor(value).toString();
    }
  };
  return (
    <Link
      href={`/order?start_date=${formattedStartDate}&end_date=${formattedEndDate}`}
    >
      <div className='w-full flex md:flex-row flex-col items-center md:justify-start justify-between md:py-4 md:px-4 py-4 px-2 border-[3px] border-gray-200 md:h-[120px] h-[160px] bg-white rounded-lg gap-2'>
        <div className='md:h-16 h-14 md:w-16 w-14 md:ml-6 ml-2 rounded-full flex justify-center items-center border-[2px] border-[#FF9C55] bg-[#FF9C55]'>
          <Image
            src='/Funds-Fill--Streamline-Remix-Fill.png'
            alt='Total-Referral-Icon'
            width={550}
            height={420}
            className=' object-contain md:h-10 h-8 md:w-10 w-8'
          />
        </div>
        <div className='flex flex-col  justify-center items-center'>
          <span className='text-[#577C8E] font-medium md:text-xl text-base'>
            Total Revenue
          </span>
          {/* <Link
          href={`/dashboard/track-referrals?statusQuery=all&selectedService=${selectedService?.service_type}`}
        > */}
          <p className='text-black lg:text-[32px] text-[24px] font-semibold'>
            {currency}
            {formatNumber(graphData?.revenue_summary?.total_revenue || 0)}
           {}
          </p>
          {/* </Link> */}
        </div>
      </div>
    </Link>
  );
};

const SummaryDataComponent = ({
  graphData,
  TabshandleDragEnd,
  tabSelectedComponents,
  TabshandleSelectComponent,
  TabshandleRemoveComponent,
  startDate,
  endDate,
}: any) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const componentMap = {
    products_sold: {
      component: TotalUser,
      props: { graphData: graphData, startDate: startDate, endDate: endDate },
    },
    new_customer_count: {
      component: TotalProduct,
      props: { graphData: graphData },
    },
    average_order_value: {
      component: TotalOrder,
      props: { graphData: graphData },
    },
    revenue_data: {
      component: TotalRevenue,
      props: { graphData: graphData },
    },
  };
  return (
    <div className='container mx-auto py-2'>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={TabshandleDragEnd}
      >
        <SortableContext
          items={tabSelectedComponents}
          strategy={rectSortingStrategy}
        >
          <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 py-6'>
            {tabSelectedComponents?.map?.((componentId: any) => {
              const { component: Component } =
                componentMap[componentId as keyof typeof componentMap];
              return (
                <SortableItem key={componentId} id={componentId}>
                  <div className='bg-white rounded-lg relative'>
                    <div className='absolute top-2 right-2'>
                      <button
                        onClick={() => TabshandleRemoveComponent?.(componentId)}
                        className='text-gray-700 text-sm hover:text-red-500 transition-colors duration-200 p-1'
                      >
                        <RxCross2
                          className='text-base text-gray-700'
                          size={20}
                        />
                      </button>
                    </div>
                    <Component
                      graphData={graphData}
                      startDate={startDate}
                      endDate={endDate}
                    />
                  </div>
                </SortableItem>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default SummaryDataComponent;
