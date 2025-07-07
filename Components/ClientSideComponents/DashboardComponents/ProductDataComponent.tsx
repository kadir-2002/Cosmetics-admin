import React from "react";
import { FaBox, FaTimesCircle, FaHourglassHalf, FaUndo } from "react-icons/fa";
import { AiOutlineDownload, AiOutlineStock } from "react-icons/ai";
import Link from "next/link";

type props = {
  commisionData: any
}

const ProductDataComponent = ({ commisionData }: props) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6  mx-auto h-[426px] space-y-6 overflow-auto hidescroll">
      <Link className="flex justify-between mb-6" href="/product">
        <h3 className="text-[#577C8E] text-[23px]">Total Product</h3>
        <p className="text-4xl font-bold text-gray-800">{commisionData?.product_summary?.total_products}</p>
      </Link>
      <div className="space-y-4">
        <Link className="flex items-center justify-between" href="/product?is_active=true">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg"><FaBox className="text-blue-500 text-xl" /></div>
            <span className="text-gray-700 text-[18px]">Active Products</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-800 font-semiboald text-[18px]">{commisionData?.product_summary?.active_products}</span>
          </div>
        </Link>
      </div>
      <div className="space-y-4">
        <Link className="flex items-center justify-between" href="/product?is_active=false">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg"><FaHourglassHalf className="text-yellow-500 text-xl" /></div>
            <span className="text-gray-700 text-[18px]">Inactive Products</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semiboald text-[18px]">{commisionData?.product_summary?.inactive_products}</span>
          </div>
        </Link>
      </div>
      <div className="space-y-4">
        <Link className="flex items-center justify-between" href="/product?is_in_stock=true">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg"><AiOutlineStock className="text-red-500 text-xl" /></div>
            <span className="text-gray-700 text-[18px]">Products In Stock</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semiboald text-[18px]">{commisionData?.product_summary?.products_in_stock}</span>
          </div>
        </Link>
      </div>
      <div className="space-y-4">
        <Link className="flex items-center justify-between" href="/product?is_in_stock=false">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg"><FaHourglassHalf className="text-yellow-500 text-xl" /></div>
            <span className="text-gray-700 text-[18px]">Products Out Of Stock</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semiboald text-[18px]">{commisionData?.product_summary?.products_out_of_stock}</span>
          </div>
        </Link>
      </div>
      {/* <div className="space-y-4">
        <Link className="flex items-center justify-between" href="/product?threshold=true">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg"><FaHourglassHalf className="text-yellow-500 text-xl" /></div>
            <span className="text-gray-700 text-[18px]">Products About To Go Out Of Stock</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semiboald text-[18px]">{commisionData?.product_summary?.products_about_to_go_out_of_stock}</span>
          </div>
        </Link>
      </div> */}
    </div>
  );
};

export default ProductDataComponent;
