"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { TbEdit } from "react-icons/tb";
import { MdArrowDropUp, MdDelete } from "react-icons/md";
import { Switch } from "@headlessui/react";
import {
  productDeleteApi,
  productsequenceDataApi,
  ProductToggleUpdatedApi,
} from "@/apis/productApi";
import toast from "react-hot-toast";
import ProductDeletecomponent from "./ProductDeletecomponent";
import { useDispatch, useSelector } from "react-redux";
import RoleInfoPopup from "../RoleFormComponents/RoleInfoPopup";
import ImageUploadPopup from "./ProductImgComponent";
import { FaPlus } from "react-icons/fa";
import ChildProductMainComponent from "./ChildProductMainComponent";
import { FaAngleDown, FaCircleArrowRight } from "react-icons/fa6";
import { IoEye } from "react-icons/io5";
import ProductInfoPopComponent from "./ProductInfoPopComponent";
import ProductReviewPopComponent from "./ProductReviewPopComponent";
import { clearUserDetails } from "@/redux/userSlice";
import { useRouter } from "next/navigation";
import { IoMdArrowDropdown } from "react-icons/io";
import ActiveInactiveFilterPopup from "../RoleFormComponents/ActiveInactiveFilterPopup";
import CategoryFilterpopupComponent from "./CategoryFilterpopupComponent";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { LuGrip } from "react-icons/lu";

type Props = {
  products: any[];
  productdata: any;
  handleEdit: any;
  variantSpecifications: any;
  setOrdering: any;
  ordering: any;
  setIsActiveInactiveFilterPopup: any;
  isActiveInactiveFitlerPopup: any;
  isfiltervalue: any;
  setfiltervalue: any;
  setcategoryvalue: any;
  iscaegoryvalue: any;
  handleActiveFilter: any;
  setCurrentPage: any;
  // handleSequenceUpdate: (sequenceData: any[]) => Promise<void>;
};

const SortableRow = ({ id, children }: { id: any; children: any }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });
  const style = {
    transform: `translate3d(${transform?.x || 0}px, ${transform?.y || 0}px,0)`,
    transition,
  };
  return (
    <tr
      ref={setNodeRef}
      style={style}
      {...attributes}
      className='p-4 hover:bg-slate-2 00 relative'>
      <tr className='text-center mt-5 absolute top-2 left-1 md:top-4 md:left-2 cursor-move z-10 touch-none'{...listeners}>
        <LuGrip size={24} className='text-black mt'/>
      </tr>
      {children}
    </tr>
  );
};
const ProductAllDataComponent: React.FC<Props> = ({
  products,
  productdata,
  handleEdit,
  variantSpecifications,
  setOrdering,
  ordering,
  setIsActiveInactiveFilterPopup,
  isActiveInactiveFitlerPopup,
  isfiltervalue,
  setfiltervalue,
  setcategoryvalue,
  iscaegoryvalue,
  handleActiveFilter,
  setCurrentPage,
}) => {
  const [isOpenDeletePopup, setOpenDeletePopup] = useState<boolean>(false);
  const [isSelectedProductId, setSelectedProductId] = useState("");
  const updated_by = useSelector((state: any) => state?.user?.details?.id);
  const [isOpenInfoPopup, setIsInfoPopup] = useState<boolean>(false);
  const [isOpenProductInfo, setIsProductInfo] = useState<boolean>(false);
  const [info, setinfo] = useState("");
  const [isOPenUploadImg, setOPenUploadImg] = useState<boolean>(false);
  const [isSelectedProductImgId, setSelectedProductImgId] = useState("");
  const [isOpenAddProduct, setOpenAddProduct] = useState<boolean>(false);
  const [isParentProductId, setParentProductId] = useState("");
  const [isopenReview, setopenReview] = useState<boolean>(false);
  const [isParentProductdata, setParentProductdata] = useState("");
  const token = useSelector((state: any) => state?.user?.token);
  const [isCategoryFilterPopup, setCategoryFilterPopup] =
    useState<boolean>(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const handleDelete = async (id: string) => {
    setSelectedProductId(id);
    setOpenDeletePopup(true);
  };
  const handleDeleteConform = async (id: string) => {
    try {
      const response = await productDeleteApi(id, token);
      if (response?.body.success) {
        toast.success("Product deleted successfully");
        setOpenDeletePopup(false);
        productdata();
      } else if (response?.body.detail === "Invalid token") {
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again");
        router.push("/");
      }
    } catch (error) {
      console.error("Failed to delete role:");
    }
  };
  const handleOpenInfo = (id: string) => {
    setIsInfoPopup(true);
    setinfo(id);
    console.log("info----->>", info);
  };

  const handleOpenAddProduct = (product: any) => {
    setOpenAddProduct(true);
    setParentProductId(product?.id);
    setParentProductdata(product);
  };

  const activeHandler = async (
    product: any,
    isActive: boolean,
    isNewArrival: boolean
  ) => {
    const response = await ProductToggleUpdatedApi(
      product?.id,
      isNewArrival,
       token,
      isActive
    
    );
    if (response?.status === 200) {
      productdata();
    } else if (response?.body?.detail === "Invalid token") {
      dispatch(clearUserDetails());
      toast.error("Session Expired, Please Login Again");
      router.push("/");
    }
  };
  const handleimgPOpup = (id: string) => {
    setOPenUploadImg(true);
    setSelectedProductImgId(id);
  };
  const handleProductinfo = async (id: string) => {
    setIsProductInfo(true);
    setinfo(id);
  };

  const handleOpenReview = async (id: string) => {
    setParentProductId(id);
    setopenReview(true);
  };

  const handleOrdering = (field: string) => {
    setOrdering((prev: any) => (prev === field ? `-${field}` : field));
  };
  const handlefilter = (value: any) => {
    setfiltervalue(value);
    setIsActiveInactiveFilterPopup(false);
    setCurrentPage(1);
  };
  const handleCategoryValue = (value: any) => {
    setcategoryvalue(value);
    setCurrentPage(1);
    setCategoryFilterPopup(false);
  };

  //////////
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      // Update the local state for immediate UI update
      setSelectedComponents((prevItems) => {
        const oldIndex = prevItems.indexOf(active.id);
        const newIndex = prevItems.indexOf(over.id);
        return arrayMove(prevItems, oldIndex, newIndex);
      });

      // Create a new array with the updated order
      const updatedProducts = arrayMove(
        [...products],
        products.findIndex((product) => product.id === active.id),
        products.findIndex((product) => product.id === over.id)
      );

      // Create the payload for the API with updated sequence numbers
      const sequencePayload = updatedProducts.map((product, index) => ({
        id: product.id,
        sequence_number: index + 1,
      }));
      const response = await productsequenceDataApi(sequencePayload, token);
      if (response?.status === 200) {
        productdata();
      }
    }
  };
  useEffect(() => {
    if (products.length > 0) {
      setSelectedComponents(products.map((product) => product.id));
    }
  }, [products]);
  return (
    <div className='w-full lg:ml-6  flex flex-col lg:items-center '>
      <div className='bg-white shadow-md rounded-lg w-full flex justify-center items-center border-[1px]'>
        {products?.length > 0 && (
          <div className='overflow-x-auto  w-full'>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={products} strategy={rectSortingStrategy}>
                <table className='w-full border-collapse text-sm lg:text-base'>
                  <thead className='bg-admin-secondary text-white'>
                    <tr>
                      <th className='text-right'></th>
                      <th className='text-right'>Sequence Number</th>
                      <th className='p-4 text-left'>Product</th>{" "}
                      {/* Combined Image and Name */}
                      <th className='p-4 text-left'>SKU</th>
                      <th
                        className='p-4 text-left cursor-pointer'
                        onClick={() => handleOrdering("selling_price")}
                      >
                        <div className='flex items-center gap-1 justify-end'>
                          <span>Selling Price</span>
                          <span className='flex flex-col'>
                            <MdArrowDropUp
                              className={`w-5 h-5 ${
                                ordering === "selling_price"
                                  ? "text-white"
                                  : "text-white"
                              }`}
                            />
                            <IoMdArrowDropdown
                              className={`w-5 h-5 -mt-1 ${
                                ordering === "-selling_price"
                                  ? "text-white"
                                  : "text-white"
                              }`}
                            />
                          </span>
                        </div>
                      </th>
                      <th
                        className='p-4 text-left cursor-pointer'
                        // onClick={() => setCategoryFilterPopup(true)}
                      >
                        {iscaegoryvalue === ""
                          ? "Category"
                          : iscaegoryvalue?.name}
                        {/* <FaAngleDown className='inline ml-1' /> */}
                      </th>
                      <th className='p-4 text-right'>Stock</th>
                      <th className='p-4 text-center'>Rating</th>
                      <th
                        className='p-4 text-center cursor-pointer'
                        onClick={() => handleActiveFilter("all")}
                      >
                        {isfiltervalue === "" ? "Status" : isfiltervalue}
                        <FaAngleDown className='inline ml-1' />
                      </th>
                      <th className='p-4 text-center'>Is NewArrival</th>
                      <th className='p-4 text-center'>Variant</th>{" "}
                      {/* Shortened "Add Variant" */}
                      <th className='p-4 text-center'>Actions</th>
                      <th className='p-4 text-left'>Info</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <SortableRow key={product.id} id={product.id}>
                        {/* <td className="p-3 text-center"> <LuGrip size={24} className="text-black" /></td> */}
                        <td className='p-4 text-center'>
                          <p>{product?.sequenceNumber}</p>
                        </td>
                        <td className='p-4'>
                          <div className='flex items-center gap-2'>
                            <div
                              onClick={() => handleimgPOpup(product?.id)}
                              className='relative cursor-pointer'
                            >
                              <div className='h-12 w-12 lg:h-16 lg:w-16 bg-gray-200 rounded-full flex justify-center items-center overflow-hidden'>
                                <img
                                  src={
                                    product?.images[0]
                                      ? `${product?.images[0].image}`:""
                                
                                  }
                                  alt='Product'
                                  className='object-cover w-full h-full'
                                />
                              </div>
                              <div className='absolute -bottom-2 -right-2 bg-[#577C8E] text-white rounded-full p-1'>
                                <FaPlus className='w-3 h-3' />
                              </div>
                            </div>
                            <div className='flex flex-col items-start'>
                              <span className='capitalize'>
                                {product?.name}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className='p-4 text-left'>{product?.SKU}</td>
                        <td className='p-4 text-right'>
                          {product?.sellingPrice}
                        </td>
                        <td className='p-4 text-left capitalize'>
                          {product?.category
                            ? `${product?.category?.name}`
                            : product?.category?.name}
                        </td>
                        <td className='p-4 text-right'>{product?.stock}</td>
                        <td
                          className='p-4 text-center cursor-pointer'
                          onClick={() => handleOpenReview(product?.id)}
                        >
                          <div className='bg-[#EFBF04] px-2 py-1 rounded text-white font-semibold flex items-center justify-center gap-1'>
                            <span>{product?.average_rating}/5</span>
                            <FaCircleArrowRight />
                          </div>
                        </td>
                        <td className='text-center'>
                          <Switch
                            checked={product.isActive}
                            onChange={() =>
                              activeHandler(
                                product,
                                !product.isActive,
                                product.isNewArrival
                              )
                            }
                            className={`${
                              product.isActive ? "bg-green-500" : "bg-gray-300"
                            } relative inline-flex h-6 w-12 items-center rounded-full transition-colors`}
                          >
                            <span
                              className={`${
                                product.isActive
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              } inline-block h-5 w-5 transform bg-white rounded-full transition`}
                            />
                          </Switch>
                        </td>
                        <td className='text-center'>
                          <Switch
                            checked={product.isNewArrival}
                            onChange={() =>
                              activeHandler(
                                product,
                                product.isActive,
                                !product.isNewArrival
                              )
                            }
                            className={`${
                              product.isNewArrival
                                ? "bg-green-500"
                                : "bg-gray-300"
                            } relative inline-flex h-6 w-12 items-center rounded-full transition-colors`}
                          >
                            <span
                              className={`${
                                product.isNewArrival
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              } inline-block h-5 w-5 transform bg-white rounded-full transition`}
                            />
                          </Switch>
                        </td>
                        <td className='p-4 text-center'>
                          <div className='flex justify-center items-center'>
                            <img
                              src='/addressicon.png'
                              alt='Add Variant'
                              onClick={() => handleOpenAddProduct(product)}
                              className='h-6 w-6 cursor-pointer'
                            />
                          </div>
                        </td>
                        <td className='p-4 text-center'>
                          <div className='flex justify-center gap-2'>
                            <button
                              onClick={() => handleProductinfo(product.id)}
                              className='text-black'
                            >
                              <IoEye size={20} />
                            </button>
                            <button
                              onClick={() => handleEdit(product)}
                              className='text-orange-500'
                            >
                              <TbEdit size={20} />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className='text-red-500'
                            >
                              <MdDelete size={20} />
                            </button>
                          </div>
                        </td>
                        <td className='p-4'>
                          <img
                            src='/Info.png'
                            alt='Info'
                            onClick={() => handleOpenInfo(product?.id)}
                            className='h-5 w-5 cursor-pointer'
                          />
                        </td>
                      </SortableRow>
                    ))}
                  </tbody>
                </table>
              </SortableContext>
            </DndContext>
            {products.length === 0 && (
              <div className='text-center p-4'>No products available</div>
            )}
          </div>
        )}
        {isOpenProductInfo && (
          <ProductInfoPopComponent
            role={products.find((role) => role.id === info)}
            isOpenInfoPopup={isOpenProductInfo}
            setIsInfoPopup={setIsProductInfo}
            setIsOpen={setIsProductInfo}
          />
        )}
        {isopenReview && (
          <ProductReviewPopComponent
            isOpenInfoPopup={isopenReview}
            setIsInfoPopup={setopenReview}
            setIsOpen={setopenReview}
            isParentProductId={isParentProductId}
          />
        )}
        {isOpenInfoPopup && (
          <RoleInfoPopup
            role={products.find((role) => role.id === info)}
            isOpenInfoPopup={isOpenInfoPopup}
            setIsInfoPopup={setIsInfoPopup}
            setIsOpen={setIsInfoPopup}
          />
        )}
      </div>
      {isOPenUploadImg && (
        <ImageUploadPopup
          isOPenUploadImg={isOPenUploadImg}
          setOPenUploadImg={setOPenUploadImg}
          isSelectedProductImgId={isSelectedProductImgId}
          productdata={productdata}
          isParentProductId={isParentProductId}
        />
      )}
      {isOpenDeletePopup && (
        <ProductDeletecomponent
          isOpenDeletePopup={isOpenDeletePopup}
          handleDeleteConform={() => handleDeleteConform(isSelectedProductId)}
          setIsLogoutDialogOpen={setOpenDeletePopup}
          setIsOpen={setOpenDeletePopup}
        />
      )}
      {isOpenAddProduct && (
        <ChildProductMainComponent
          isParentProductId={isParentProductId}
          isOpenAddProduct={isOpenAddProduct}
          setOpenAddProduct={setOpenAddProduct}
          setIsOpen={setOpenAddProduct}
          isParentProductdata={isParentProductdata}
        />
      )}
      {isActiveInactiveFitlerPopup && (
        <ActiveInactiveFilterPopup
          isOpenActiveInactivePopup={isActiveInactiveFitlerPopup}
          setIsActiveInactiveFilterPopup={setIsActiveInactiveFilterPopup}
          handlefilter={handlefilter}
          isActiveInactiveValue={isfiltervalue}
        />
      )}{" "}
      {isCategoryFilterPopup && (
        <CategoryFilterpopupComponent
          isCategoryFilterPopup={isCategoryFilterPopup}
          setCategoryFilterPopup={setCategoryFilterPopup}
          handlefilter={handleCategoryValue}
          iscaegoryvalue={iscaegoryvalue}
        />
      )}
    </div>
  );
};
export default ProductAllDataComponent;
