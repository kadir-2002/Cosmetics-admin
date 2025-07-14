"use client";
import React, { useState } from "react";
import { TbEdit } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import { Switch } from "@headlessui/react";
import { productVArientDeleteApi, varientToggleUpdatedApi } from "@/apis/productApi";
import toast from "react-hot-toast";
import ProductDeletecomponent from "./ProductDeletecomponent";
import { useDispatch, useSelector } from "react-redux";
import RoleInfoPopup from "../RoleFormComponents/RoleInfoPopup";
import { FaPlus } from "react-icons/fa";
import ProductInfoPopComponent from "./ProductInfoPopComponent";
import { IoEye } from "react-icons/io5";
import { reviewAllDataApi } from "@/apis/ratingApi";
import ImageVarientUploadPopup from "./ImageVarientUploadPopup";
import { clearUserDetails } from "@/redux/userSlice";
import { useRouter } from "next/navigation";


type Props = {
  products: any[];
  productdata: any;
  handleEdit: any;
  isParentProductId: any;
  isParentProductdata:any;
};

const ChildProductDataComponent: React.FC<Props> = ({ products, productdata, handleEdit, isParentProductId, isParentProductdata }) => {

  console.log(products,"prod========================")
  console.log(productdata,"pdat---------------------------")
  const [isOpenDeletePopup, setOpenDeletePopup] = useState<boolean>(false)
  const [isSelectedProductvarientId, setSelectedProductvarientId] = useState("")
  const updated_by = useSelector((state: any) => state?.user?.details?.id);
  const [isOpenInfoPopup, setIsInfoPopup] = useState<boolean>(false);
  const [info, setinfo] = useState("")
  const [isOPenUploadImg, setOPenUploadImg] = useState<boolean>(false)
  const [isSelectedProductImgId, setSelectedProductImgId] = useState("")
  const [isOpenProductInfo, setIsProductInfo] = useState<boolean>(false);
  const [isReviews, setReviews] = useState<[]>([])
  const [isopenReview, setopenReview] = useState<boolean>(false);
  const token = useSelector((state: any) => state?.user?.token);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleDelete = async (id: string) => {
    setSelectedProductvarientId(id);
    setOpenDeletePopup(true);
  };
  const handleDeleteConform = async (id: string) => {
    try {
      const response = await productVArientDeleteApi(id, isParentProductId, token);
      if (response?.body.success) {
        toast.success("Variant deleted successfully");
        setOpenDeletePopup(false);
        productdata()

      } else if (response?.body.message === "Invalid or expired token ") {
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again")
        router.push("/");
      }
    } catch (error) {
      console.error("Failed to delete role:");
    }
  };
  const handleOpenInfo = (id: string) => {
    setIsInfoPopup(true);

    setinfo(id);
    console.log("info----->>", info)
  }
  const activeHandler = async (product: any, isActive: boolean,is_selected:boolean ) => {
    const response = await varientToggleUpdatedApi(
      isParentProductId,
      product?.id,
      product?.description,
      product?.SKU,
      product?.selling_price,
      product?.base_and_selling_price_difference_in_percent,
      product?.specification,
      product?.stock,
      is_selected,
      isActive,
      product?.is_new_arrival,
      updated_by,
      product?.low_stock_threshold,
      token,
    );
    if (response?.status === 200) {
      productdata();
    } else if (response?.data?.message === "Invalid or expired token") {
      dispatch(clearUserDetails());
      toast.error("Session Expired, Please Login Again")
      router.push("/");
    }
  };

  const handleimgPOpup = async (id: string) => {
    setOPenUploadImg(true)
    setSelectedProductImgId(id)

  }
  const handleProductinfo = async (id: string) => {
    setIsProductInfo(true)
    setinfo(id);
  }
  const handleOpenReview = async (id: string) => {
    setopenReview(true);
    fetchReview(id);
  };

  const fetchReview = async (productId: string) => {
    try {
      const response = await reviewAllDataApi({
        product: productId,
        current_page: 1,
        page_size: 20,
        token: token
      });
      setReviews(response?.reviews);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  };

  return (
    <div className="w-full flex flex-col lg:items-center lg:p-4 overflow-y-auto">
      <div className="bg-white shadow-md rounded-lg w-full flex justify-center items-center">
        <div className="lg:px-4 overflow-x-auto lg:max-w-7xl w-full">
          <table className="w-full border-collapse">
            <thead className="border-b-[2px] border-[#577C8E] text-[#577C8E] lg:text-lg">
              <tr>
                <th className="p-4 text-left">Add Image</th>
                <th className="p-4 text-center">Variant Value</th>
                <th className="p-4 text-center">SKU</th>
                <th className="p-4 text-center">Price</th>
                {/* <th className="p-4 text-center">Rating</th> */}
                <th className="p-4 text-center">Is Active</th>
                <th className="p-4 text-center">Is Selected</th>
                <th className="p-4 text-left">Info</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index} className="border-b hover:bg-purple-100">
                  <td className="p-4 text-center" onClick={() => handleimgPOpup(product?.id)}>
                    <div className="relative ">
                       {product?.images?.[0]?.url ? (
          <div className="lg:h-16 lg:w-16 h-12 w-12 bg-gray-200 flex items-center justify-center rounded-full">
            <img
              src={product.images[0].url}
              alt="Variant"
              className="lg:h-16 lg:w-16 h-12 w-12 object-cover rounded-full"
            />
          </div>
        ) : (
          <div className="lg:h-16 lg:w-16 h-12 w-12 bg-gray-200 flex items-center justify-center rounded-full">
            <img
              src="/product.png"
              alt="No Image"
              className="lg:h-16 lg:w-16 h-12 w-12 object-contain p-2 rounded-full"
            />
          </div>
        )}
                      <div className="absolute -bottom-2 left-8 text-white rounded-full p-1 flex items-center justify-center bg-[#577C8E]">
                        <FaPlus className="h-p-4 w-p-4" />
                      </div>
                    </div>
                  </td>
                  {/* <td className="p-4 capitalize">{product.name} ({product.average_rating.toFixed(1)}/5)</td> */}
                  <td>  <div className="flex gap-4 text-center justify-center items-center">
                    {Object.entries(product?.specification || {}).map(([key, values]) => (
                      <div key={key} className="flex ">
                        <div className="text-lg text-[#577C8E] font-semibold flex items-center justify-between capitalize">
                          {key}:
                        </div>
                        <div className="px-1 text-lg text-gray-900">
                          {Array.isArray(values) ? values.join(", ") : String(values)}
                        </div>
                      </div>
                    ))}
                  </div></td>
                  <td className="p-4 text-center">{product?.SKU}</td>
                  <td className="p-4 text-center">{isParentProductdata?.selling_price}</td>
                  {/* <td className="p-4 capitalize text-center"
                    onClick={() => handleOpenReview(product?.id)}>
                    <div className="p-2 flex gap-2 justify-center items-center bg-[#EFBF04] rounded-md text-white font-semibold">
                      <p className="text-md">{product?.average_rating}/5</p><FaCircleArrowRight />
                    </div>
                  </td> */}
                  
                  <td className="p-4 text-center">
                    <Switch
                      checked={product.is_active}
                      onChange={() => activeHandler(product, !product.is_active,product.is_selected)}
                      className={`${product.is_active ? "bg-green-500" : "bg-gray-300"
                        } relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-200 ease-in-out`}
                    >
                      <span
                        className={`${product.is_active ? "translate-x-6" : "translate-x-1"
                          } inline-block w-6 h-6 bg-white rounded-full transition-transform duration-200 ease-in-out`}
                      />
                    </Switch>
                  </td>
                  <td className="p-4 text-center">
                    <Switch
                      checked={product.is_selected}
                      onChange={() => activeHandler(product, product.is_active, !product.is_selected)}
                      className={`${product.is_selected ? "bg-green-500" : "bg-gray-300"
                        } relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-200 ease-in-out`}
                    >
                      <span
                        className={`${product.is_selected ? "translate-x-6" : "translate-x-1"
                          } inline-block w-6 h-6 bg-white rounded-full transition-transform duration-200 ease-in-out`}
                      />
                    </Switch>
                  </td>
                  <td className="p-4"><img
                    onClick={() => handleOpenInfo(product?.id)}
                    src="/Info.png"
                    alt="Profile"
                    className="h-6 w-6 object-cover rounded-full"
                  /></td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center items-center">
                      <button
                        onClick={() => handleProductinfo(product?.id)}
                        className="text-black mx-1"
                      >
                        <IoEye size={28} />
                      </button>
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-orange-500 mx-1">
                        <TbEdit size={24} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-500 mx-1"
                      >
                        <MdDelete size={24} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="text-center p-4">No products available</div>
          )}
        </div>
        {
          isOpenInfoPopup && (
            <RoleInfoPopup
              role={products.find((role) => role.id === info)}
              isOpenInfoPopup={isOpenInfoPopup}
              setIsInfoPopup={setIsInfoPopup}
              setIsOpen={setIsInfoPopup}
            />
          )
        } {isOpenProductInfo && (
          <ProductInfoPopComponent
            role={products.find((role) => role.id === info)}
            isOpenInfoPopup={isOpenProductInfo}
            setIsInfoPopup={setIsProductInfo}
            setIsOpen={setIsProductInfo}
          />
        )
        }
        {/* {isopenReview && (
          <ProductReviewPopComponent
            review={isReviews}
            isOpenInfoPopup={isopenReview}
            setIsInfoPopup={setopenReview}
            setIsOpen={setopenReview}
            fetchReview={fetchReview}
          />
        )
        } */}
      </div>
      {isOPenUploadImg && <ImageVarientUploadPopup isOPenUploadImg={isOPenUploadImg} setOPenUploadImg={setOPenUploadImg} isSelectedProductImgId={isSelectedProductImgId} productdata={productdata} isSelectedProductvarientId={isSelectedProductvarientId} />}
      {isOpenDeletePopup && (
        <ProductDeletecomponent
          isOpenDeletePopup={isOpenDeletePopup}
          handleDeleteConform={() => handleDeleteConform(isSelectedProductvarientId)}
          setIsLogoutDialogOpen={setOpenDeletePopup}
          setIsOpen={setOpenDeletePopup} />)}
    </div>
  );
};

export default ChildProductDataComponent;
