"use client";
import { ChildproductAllDataApi } from "@/apis/productApi";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";
import ChildFormComponent from "./ChildFormComponent";
import ChildProductDataComponent from "./ChildProductDataComponent";
import { RxCross2 } from "react-icons/rx";
import { clearUserDetails } from "@/redux/userSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Props = {
  isOpenAddProduct: boolean;
  setOpenAddProduct: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isParentProductId: string;
  isParentProductdata: string;
};

const ChildProductMainComponent: React.FC<Props> = ({
  isOpenAddProduct,
  setOpenAddProduct,
  setIsOpen,
  isParentProductId,
  isParentProductdata
}) => {
  const userDetails = useSelector((state: any) => state?.user?.details?.id);
  const [searchText, setSearchText] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize] = useState<number>(4);
  const [products, setProducts] = useState<any[]>([]);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isProductID, setProductID] = useState(false);
  const [specification, setSpecification] = useState<{ [key: string]: string }>({});
  const token = useSelector((state: any) => state?.user?.token);
  const dispatch = useDispatch();
  const router = useRouter();
  const [newUser, setNewUser] = useState({
    id: "",
    SKU: "",
    description: "",
    selling_price: "",
    base_and_selling_price_difference_in_percent: "",
    variants: { attribute: "", value: "" },
    stock: "",
    colorcode:"",
    is_selected:false,
    is_active: false,
    is_new_arrival: false,
    low_stock_threshold:5,
  });

  const fetchProducts = async () => {
    try {
      const response = await ChildproductAllDataApi(
        isParentProductId,
        currentPage,
        pageSize,
        token
      );
      if (response?.detail === "Invalid token") {
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again")
        router.push("/");

      } else if (response?.results) {
        setProducts(response?.results);
        setTotalPages(response?.total_pages);
      }

    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchText, currentPage]);

  const handleOpenForm = () => {
    setOpenForm(!openForm);
    setIsEdit(false);
    setSpecification({})
    setNewUser({
      id: "",
      description: "",
      SKU: "",
      selling_price: "",
      base_and_selling_price_difference_in_percent: "",
      variants: { attribute: "", value: "" },
      stock: "",
      colorcode:"",
      is_selected:false,
      is_active: false,
      is_new_arrival: false,
      low_stock_threshold:5,
    });
  };

  const handleEdit = (product: any) => {
    setOpenForm(true);
    setProductID(product?.id);
    setSpecification(product?.specification)
    setNewUser({
      id: product?.id,
      SKU: product?.SKU,
      description: product?.description,
      selling_price: product?.selling_price,
      base_and_selling_price_difference_in_percent: product?.base_and_selling_price_difference_in_percent,
      variants: product?.specification,
      stock: product?.stock,
      colorcode:product?.colour_code,
      is_selected:product?.is_selected,
      is_active: product?.is_active,
      is_new_arrival: product?.is_new_arrival,
      low_stock_threshold:product?.low_stock_threshold
    });
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setIsEdit(true);
  };
  return (
    <>
      {userDetails ? (
        <Transition.Root show={isOpenAddProduct} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50"
            onClose={() => setOpenAddProduct(false)}>
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
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 w-full">
              <Dialog.Panel className="hidescroll bg-white max-w-6xl w-full rounded-md max-h-[90%] overflow-y-scroll m-3 flex flex-col lg:mt-0 mt-14">
                <div className="flex justify-end tems-end">
                  <div className="cursor-pointer flex justify-center items-center bg-red-600 w-16 h-8 text-white font-semibold" onClick={() => setOpenAddProduct(false)}><RxCross2 size={20} /></div></div>
                <div className="flex-shrink-0 px-4 border-b">
                  <ChildFormComponent
                    setSearchText={setSearchText}
                    searchText={searchText}
                    productdata={fetchProducts}
                    setNewUser={setNewUser}
                    newUser={newUser}
                    handleopenform={handleOpenForm}
                    openForm={openForm}
                    isEdit={isEdit}
                    isProductID={isProductID}
                    setIsEdit={setIsEdit}
                    setOpenForm={setOpenForm}
                    isParentProductId={isParentProductId}
                    setOpenAddProduct={setOpenAddProduct}
                    isParentProductdata={isParentProductdata}
                    specification={specification}
                    setSpecification={setSpecification}
                  />
                </div>
                <div className="flex-grow">
                  <ChildProductDataComponent
                    products={products}
                    productdata={fetchProducts}
                    handleEdit={handleEdit}
                    isParentProductdata={isParentProductdata}
                    isParentProductId={isParentProductId}
                  />
                </div>
                <div className="flex justify-center p-4 border-t">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-admin-buttonprimary text-white rounded-md mx-1"
                  >
                    Prev
                  </button>
                  <span className="px-4 py-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-admin-buttonprimary text-white rounded-md mx-1"
                  >
                    Next
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>
        </Transition.Root>

      ) : null}
    </>
  );
};

export default ChildProductMainComponent;
