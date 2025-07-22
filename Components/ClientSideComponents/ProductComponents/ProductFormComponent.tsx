"use client";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaMoneyBill, FaShoppingBag } from "react-icons/fa";
import { GoSearch } from "react-icons/go";
import { AiOutlineClose } from "react-icons/ai";
import { createProductApi, prentProductDataApi, productAllDataApi, productCSVUploadApi, ProductUpdatedApi } from "@/apis/productApi";
import { useDispatch, useSelector } from "react-redux";
import { TbAlignBoxBottomLeftFilled } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import { clearUserDetails } from "@/redux/userSlice";
import { useRouter } from "next/navigation";
import ProductDetailsReatchTextComponent from "./ProductDetailsReatchTextComponent";
import CareInstructionReatchTextComponent from "./CareInstructionReatchTextComponent";
import WarrantyReatchTextFiledComponent from "./WarrantyReatchTextFiledComponent";
import DescriptionReatchTextComponent from "./DescriptionReatchTextComponent";
import DeliveryOrInstallationTipsComponent from "./DeliveryOrInstallationTipsComponent";
import { BsPuzzleFill } from "react-icons/bs";
import { FiMinus, FiPlus, FiUpload } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import CSVActionPopup from "./FileUploadModal";

type props = {
  setSearchText: any;
  productdata: any;
  setNewUser: any;
  newUser: any;
  handleopenform: any;
  openForm: any;
  isEdit: any;
  isProductID: any;
  setIsEdit: any;
  setOpenForm: any;
  searchText: any;
  categories: any;
  setSubCategories: any;
  subCategories: any;
  setCategories: any;
  variantSpecifications: any;
  setVariantSpecifications: any;
  setCurrentPage: any;
  isTagData: any
};
const ProductFormComponent: React.FC<props> = ({
  productdata,
  setNewUser,
  newUser,
  handleopenform,
  openForm,
  isEdit,
  isProductID,
  setIsEdit,
  setOpenForm,
  setSearchText,
  searchText,
  categories,
  setSubCategories,
  subCategories,
  setCategories,
  variantSpecifications,
  setVariantSpecifications,
  setCurrentPage,
  isTagData
}) => {
  const created_by = useSelector((state: any) => state?.user?.details?.id);

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [subcat, setSubcat] = useState<any[]>([])
  const token = useSelector((state: any) => state?.user?.token);
  const [isOpen, setIsOpen] = useState(false);
  const [isCsvPopupOpen, setIsCsvPopupOpen] = useState(false);
  const [selectFiledownload ,setFileDownload]=useState('')
  const [isfile, setfile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  };
  const clearSearch = () => {
    setSearchText("");
  };
  const handleCreateOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {
      name,
      SKU,
      category,
      sub_catogry,
      description,
      base_price,
      selling_price,
      base_and_selling_price_difference_in_percent,
      stock,
      is_active,
      is_new_arrival,
      minimum_order_quantity,
      tag_list,
      low_stock_threshold,
      weight,
      length,
      width,
      height,
      product_details,
      care_instruction,
      seo_title,
      seo_description,
      seo_keyword,
      warranty,
      delivery_or_installation_tips,
      material,
      weight_bearing_number,
      is_stackable,
      stackable_pieces_number,
    } = newUser;
    try {
      if (isEdit) {
        const tags = tag_list;
        console.log("SKU", SKU);
        const response = await ProductUpdatedApi(
          isProductID,
          name,
          SKU,
          description,
          category,
          sub_catogry,
          base_price,
          selling_price,
          base_and_selling_price_difference_in_percent,
          variantSpecifications,
          stock,
          is_active,
          is_new_arrival,
          minimum_order_quantity,
          tag_list,
          created_by,
          token,
          low_stock_threshold,
          weight,
          length,
          width,
          height,
          product_details,
          care_instruction,
          seo_title,
          seo_description,
          seo_keyword,
          warranty,
          delivery_or_installation_tips,
          material,
          weight_bearing_number,
          is_stackable,
          stackable_pieces_number
        );
        if (response?.status === 200) {
          toast.success("Product Updated successfully");
          setIsEdit(false);
          setOpenForm(false);
          productdata();
          setVariantSpecifications({});
          setNewUser({
            id: "",
            name: "",
            description: "",
            SKU: "",
            category: "",
            sub_catogry: "",
            base_price: "",
            selling_price: "",
            base_and_selling_price_difference_in_percent: "",
            stock: "",
            is_active: false,
            is_new_arrival: false,
            minimum_order_quantity: "",
            tag_list: [],
            variants: { attribute: "", value: "" },
            thresholdvalue: "",
            weight: "",
            length: "",
            width: "",
            height: "",
            product_details: "",
            care_instruction: "",
            seo_title: "",
            seo_description: "",
            seo_keyword: "",
            warranty: "",
            delivery_or_installation_tips: "",
            material: "",
            weight_bearing_number: "",
            is_stackable: false,
            stackable_pieces_number: "",
          });
        } else if (response?.body?.message === "Invalid or expired token") {
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
        }
      } else {
        const response = await createProductApi(
          name,
          SKU,
          description,
          Number(category),
          Number(sub_catogry),
          Number(base_price),
          Number(selling_price),
          Number(base_and_selling_price_difference_in_percent),
          variantSpecifications,
          Number(stock),
          is_active,
          is_new_arrival,
          created_by,
          token,
          weight,
          length,
          width,
          height,
          product_details,
          seo_title,
          seo_description,
          seo_keyword,
          tag_list
        );
        if (response?.body?.data?.error === "SKU with this name already exists") {
          toast.error("This SKU is already existed");
        } else if (response?.status === 201) {
          console.log("response", response?.status);
          toast.success("Product Add successfully!");
          productdata();
          setOpenForm(false);
          setVariantSpecifications({});
          setNewUser({
            id: "",
            name: "",
            description: "",
            SKU: "",
            category: "",
            sub_catogry: "",
            base_price: "",
            selling_price: "",
            base_and_selling_price_difference_in_percent: "",
            stock: "",
            is_active: false,
            is_new_arrival: false,
            minimum_order_quantity: "",
            tag_list: [],
            variants: {},
            thresholdvalue: "",
            weight: "",
            length: "",
            width: "",
            height: "",
            product_details: "",
            care_instruction: "",
            seo_title: "",
            seo_description: "",
            seo_keyword: "",
            warranty: "",
            delivery_or_installation_tips: "",
            material: "",
            weight_bearing_number: "",
            is_stackable: false,
            stackable_pieces_number: "",
          });
        } else if (response?.status === 401) {
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
        }
      }
    } catch (error) {
      toast.success("Enter Correct input");
    }
  };

  const handleCancelEdit = () => {
    setOpenForm(false);
    setNewUser({
      id: "",
      name: "",
      description: "",
      SKU: "",
      category: "",
      sub_catogry: "",
      base_price: "",
      selling_price: "",
      base_and_selling_price_difference_in_percent: "",
      stock: "",
      is_active: false,
      is_new_arrival: false,
      minimum_order_quantity: "",
      tag_list: [],
      parentProduct: "",
      variants: { attribute: "", value: "" },
      low_stock_threshold: "",
      weight: "",
      length: "",
      width: "",
      height: "",
      product_details: "",
      care_instruction: "",
      warranty: "",
      delivery_or_installation_tips: "",
      material: "",
      weight_bearing_number: "",
      is_stackable: false,
      stackable_pieces_number: "",
    });
  };
  // const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  // const categoryId = e.target.value;
  //   setNewUser((prev: any) => ({
  //     ...prev,
  //     category: categoryId,
  //     sub_catogry: "",
  //   }))
  //   const selected = categories.find((cat: any) => cat.id === Number.parseInt(categoryId))
  //   setSubCategories(selected?.subcategories || [])
  // }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const categoryId = e.target.value;

  const selectedCategory = categories.find(
    (cat: any) => String(cat.id) === String(categoryId)
  );

  const subs = selectedCategory?.subcategories || [];

  // setSubCategories(subs);  // If you're using this elsewhere
  setSubcat(subs);         // For dropdown

  setNewUser((prev: any) => ({
    ...prev,
    category: categoryId,
    sub_catogry: "", // Reset subcategory
  }));
};
useEffect(() => {
  console.log(subcat, "updated subcat data");
}, [subcat]);

  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subCategoryId = e.target.value;
    setNewUser((prev: any) => ({
      ...prev,
      sub_catogry: subCategoryId,
    }));
  };
  const handleAddVariant = () => {
    if (newUser.variants.attribute && newUser.variants.value) {
      setVariantSpecifications((prev: any) => {
        const updatedSpec = { ...prev };
        if (updatedSpec[newUser.variants.attribute]) {
          if (
            !updatedSpec[newUser.variants.attribute].includes(
              newUser.variants.value
            )
          ) {
            updatedSpec[newUser.variants.attribute].push(
              newUser.variants.value
            );
          }
        } else {
          updatedSpec[newUser.variants.attribute] = [newUser.variants.value];
        }
        setNewUser((prev: any) => ({
          ...prev,
          variants: { attribute: "", value: "" },
        }));

        return updatedSpec;
      });
    } else {
      toast.error("Please Enter Attributes and Value");
    }
  };

  const handleDelete = (attribute: string, value: string) => {
    setVariantSpecifications((prev: any) => {
      const updatedSpec = { ...prev };
      if (updatedSpec[attribute]) {
        updatedSpec[attribute] = updatedSpec[attribute].filter(
          (item: any) => item !== value
        );
        if (updatedSpec[attribute].length === 0) {
          delete updatedSpec[attribute];
        }
      }
      return updatedSpec;
    });
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewUser((prev: any) => ({
      ...prev,
      variants: {
        ...prev.variants,
        attribute: value,
      },
    }));
    if (value) {
      setDropdownVisible(true);
    } else {
      setDropdownVisible(false);
    }
  };

  const handleOptionClick = (attr: string) => {
    setNewUser((prev: any) => ({
      ...prev,
      variants: {
        ...prev.variants,
        attribute: attr,
      },
    }));
    setDropdownVisible(false);
  };

  // const handleFileChange = (e: any) => {
  //   if (e.target.files && e.target.files.length > 0) {
  //     setSelectedFileName(e.target.files[0].name);
  //     console.log("docdc", selectedFileName);
  //   } else {
  //     setSelectedFileName("");
  //   }
  // };

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setfile(file);
    setSelectedFileName(file.name);
    setFileDownload(""); // Reset error file state if new file selected
  }
};

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };


    const handleCsvFileUpload = async () => {
      if (!isfile) {
        toast.error("Please select a file first.");
        return;
      }
      try {
        const response = await productCSVUploadApi(isfile, token);
        if(response?.error){
          toast.error(response?.error)
        } else if (response?.status=== 200 && response?.data?.error_file_path){
          setfile(null);
          setSelectedFileName("");
           setFileDownload(response?.data?.error_file_path)
          toast.success("Please download the error file, resolve the error, and re-upload it.");
             if (fileInputRef.current) {
                      fileInputRef.current.value = ''; 
                  }
        } else if(response?.status=== 200 ){
          toast.success("File Upload successfully");
          productdata()
          setfile(null);
          setSelectedFileName("");
          setIsCsvPopupOpen(false)
          setFileDownload('')
           if (fileInputRef.current) {
                      fileInputRef.current.value = ''; 
                  }
        }
      } catch (error) {
        console.error("Upload failed:", error);
      }
    };



  return (
    <div className='w-full flex flex-col lg:items-center lg:p-4 mb-3'>
      <div className='flex justify-center items-center mx-auto w-full mb-4 lg:gap-8 gap-3'>
        <div className='md:w-[60%] w-[90%] relative'>
          <div className='relative'>
            <span className='absolute top-1/2 transform -translate-y-1/2 bg-admin-buttonprimary h-full w-[50px] rounded-l-lg flex justify-center items-center'>
              <GoSearch size={23} color='white' />
            </span>
            <input
              type='text'
              className='w-full p-2 pl-16 pr-10 border h-12 bg-white border-gray-500 rounded-lg focus:outline-none'
              placeholder='Search By Product Name, Price, Category'
              value={searchText}
              onChange={handleSearchChange}
            />
            {searchText && (
              <button
                className='absolute right-3 top-1/2 transform -translate-y-1/2'
                onClick={clearSearch}
              >
                <AiOutlineClose size={23} />
              </button>
            )}
          </div>
        </div>
        <div onClick={handleopenform}>
          {openForm ? (
            <button type='button' className='button h-12'>
              <span className='button__text'>Close</span>
              <span className='button__icon'>
                <FiMinus size={24} />
              </span>
            </button>
          ) : (
            <button type='button' className='button h-12'>
              <span className='button__text'>Add </span>
              <span className='button__icon'>
                <FiPlus size={24} />
              </span>
            </button>
          )}
        </div>
      </div>
      {/* <div className='flex lg:justify-end justify-center gap-3 w-full px-1'>
        <div className='relative flex justify-center items-center text-white gap-2 h-12 px-3 bg-[#577C8E] rounded-md cursor-pointer'>
          <p className='font-semibold text-lg px-4'>Upload CSV</p>
          <input
            type='file'
            accept='.csv,pdf'
            className='absolute inset-0 opacity-0 cursor-pointer'
            onChange={handleFileChange}
          />
          {selectedFileName && (
            <p className='mt-2 text-sm text-white'>{selectedFileName}</p>
          )}
        </div>
        <div className='relative flex justify-center items-center text-white gap-2 h-12 px-3 bg-[#577C8E] rounded-md cursor-pointer'>
          <button className='font-semibold text-lg' onChange={handleFileChange}>
            Submite
          </button>
        </div>
      </div> */}



{/* <div className="flex justify-end w-full px-1 mb-4">
  <button
    onClick={() => setIsCsvPopupOpen(true)}
    className="bg-[#61BAB0] text-white px-6 py-2.5 rounded-lg font-semibold shadow-md hover:bg-[#88cec6] transition-all flex items-center gap-2"
  >
    <FiUpload />
    CSV Actions
  </button>
</div>
{isCsvPopupOpen && (
  <CSVActionPopup
    onClose={() => setIsCsvPopupOpen(false)}
    selectedFileName={selectedFileName}
    handleFileChange={handleFileChange}
    handleCsvFileUpload={handleCsvFileUpload}
    fileInputRef={fileInputRef}
    selectFiledownload={selectFiledownload}
  />
)} */}



      {openForm && (
        <form
          onSubmit={handleCreateOrUpdate}
          className='bg-white shadow-md rounded-xl p-4 w-full lg:w-[100%] mx-auto'
        >
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <div className='border bg-gray-50 rounded-md w-full focus:outline-none placeholder-black h-12'>
              <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm'>
                <FaShoppingBag color='#A5B7C0' size={26} />
                <input
                  type='text'
                  name='Product Name'
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser((prev: any) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  // placeholder="Enter Product Name *"
                  required
                  className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
                />
                <label
                  htmlFor='tag'
                  className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                >
                  Enter Product Name *
                </label>
              </div>
            </div>
            <div className='border bg-gray-50 rounded-md w-full focus:outline-none placeholder-black h-12'>
              <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm'>
                <FaShoppingBag color='#A5B7C0' size={26} />
                <input
                  type='text'
                  name='Product SKU'
                  value={newUser.SKU}
                  onChange={(e) =>
                    setNewUser((prev: any) => ({
                      ...prev,
                      SKU: e.target.value,
                    }))
                  }
                  // placeholder="Enter Product SKU *"
                  required
                  className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
                />
                <label
                  htmlFor='tag'
                  className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                >
                  Enter Product SKU *
                </label>
              </div>
            </div>
            <div className='lg:col-span-2'>
              <DescriptionReatchTextComponent
                value={newUser.description}
                onChange={(description) =>
                  setNewUser((prev: any) => ({ ...prev, description }))
                }
              />
            </div>

            <div className=''>
              <ProductDetailsReatchTextComponent
                value={newUser.product_details}
                onChange={(product_details) =>
                  setNewUser((prev: any) => ({ ...prev, product_details }))
                }
              />
            </div>
            {/* <div className=''>
              <CareInstructionReatchTextComponent
                value={newUser.care_instruction}
                onChange={(care_instruction) =>
                  setNewUser((prev: any) => ({ ...prev, care_instruction }))
                }
              />
            </div> */}
            <div className=''>
              <WarrantyReatchTextFiledComponent
                value={newUser.warranty}
                onChange={(warranty) =>
                  setNewUser((prev: any) => ({ ...prev, warranty }))
                }
              />
            </div>
            {/* <div className=''>
              <DeliveryOrInstallationTipsComponent
                value={newUser.delivery_or_installation_tips}
                onChange={(delivery_or_installation_tips) =>
                  setNewUser((prev: any) => ({
                    ...prev,
                    delivery_or_installation_tips,
                  }))
                }
              />
            </div> */}
            <div className='flex flex-col'>
              <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm'>
                <FaShoppingBag color='#A5B7C0' size={26} />
                <textarea
                  name='Product weight'
                  value={newUser.weight}
                  onChange={(e) =>
                    setNewUser((prev: any) => ({
                      ...prev,
                      weight: e.target.value,
                    }))
                  }
                  // placeholder="Enter Product Description"
                  className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out'
                  rows={3}
                ></textarea>
                <label
                  htmlFor='tag'
                  className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                >
                  Enter Product weight
                </label>
              </div>
            </div>

            <div className='flex flex-col'>
              <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm'>
                <FaShoppingBag color='#A5B7C0' size={26} />
                <textarea
                  name='Product length'
                  value={newUser.length}
                  onChange={(e) =>
                    setNewUser((prev: any) => ({
                      ...prev,
                      length: e.target.value,
                    }))
                  }
                  // placeholder="Enter Product Description"
                  className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out'
                  rows={3}
                ></textarea>
                <label
                  htmlFor='tag'
                  className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                >
                  Enter Product Length
                </label>
              </div>
            </div>
            <div className='flex flex-col'>
              <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm'>
                <FaShoppingBag color='#A5B7C0' size={26} />
                <textarea
                  name='Product width'
                  value={newUser.width}
                  onChange={(e) =>
                    setNewUser((prev: any) => ({
                      ...prev,
                      width: e.target.value,
                    }))
                  }
                  // placeholder="Enter Product Description"
                  className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out'
                  rows={3}
                ></textarea>
                <label
                  htmlFor='tag'
                  className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                >
                  Enter Product Width
                </label>
              </div>
            </div>
            <div className='flex flex-col'>
              <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm'>
                <FaShoppingBag color='#A5B7C0' size={26} />
                <textarea
                  name='Product Height'
                  value={newUser.height}
                  onChange={(e) =>
                    setNewUser((prev: any) => ({
                      ...prev,
                      height: e.target.value,
                    }))
                  }
                  // placeholder="Enter Product Description"
                  className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out'
                  rows={3}
                ></textarea>
                <label
                  htmlFor='tag'
                  className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                >
                  Enter Product Height
                </label>
              </div>
            </div>


            <div className='flex flex-col'>
              <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm'>
                <FaMoneyBill color='#A5B7C0' size={26} />
                <input
                  type='number'
                  name='Base Price'
                  value={newUser.base_price}
                  onChange={(e) => {
                    const value = e.target.value
                    const parsedValue = Number.parseFloat(value)
                    if (parsedValue >= 0 || value === "") {
                      setNewUser((prev: any) => ({
                        ...prev,
                        base_price: value === "" ? "" : parsedValue,
                        base_and_selling_price_difference_in_percent: "",
                        selling_price: "",
                      }));
                    }
                  }}
                  // placeholder="Enter Base Price *"
                  className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out'
                  required
                />
                <label
                  htmlFor='tag'
                  className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                >
                  Enter Base Price *
                </label>
              </div>
            </div>

            <div className='flex lg:flex-row flex-col gap-5 w-full'>
              {/* Percentage Input */}
              <div className='flex flex-col lg:w-1/2 w-full'>
                <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm'>
                  <FaMoneyBill color='#A5B7C0' size={26} />
                  <input
                    type='number'
                    name='percentage'
                    value={
                      newUser?.base_and_selling_price_difference_in_percent ??
                      ""
                    }
                    onChange={(e) => {
                      const percentage = Number.parseFloat(e.target.value)
                      const basePrice = Number.parseFloat(newUser?.base_price) || 0
                      if (e.target.value === "") {
                        setNewUser((prev: any) => ({
                          ...prev,
                          base_and_selling_price_difference_in_percent: "",
                          selling_price: "",
                        }));
                      } else if (!isNaN(percentage)) {
                        const sellingPrice = basePrice * (1 + percentage / 100);
                        setNewUser((prev: any) => ({
                          ...prev,
                          base_and_selling_price_difference_in_percent:
                            percentage.toFixed(),
                          selling_price: sellingPrice.toFixed(),
                        }));
                      }
                    }}
                    className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
                    required
                  />
                  <label
                    htmlFor='percentage'
                    className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                  >
                    Enter Percentage *
                  </label>
                </div>
              </div>

              {/* Selling Price Input */}
              <div className='flex flex-col lg:w-1/2 w-full'>
                <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm'>
                  <FaMoneyBill color='#A5B7C0' size={26} />
                  <input
                    type='number'
                    name='selling_price'
                    value={newUser?.selling_price ?? ""}
                    onChange={(e) => {
                      const sellingPrice = Number.parseFloat(e.target.value)
                      const basePrice = Number.parseFloat(newUser?.base_price) || 0
                      if (e.target.value === "") {
                        setNewUser((prev: any) => ({
                          ...prev,
                          base_and_selling_price_difference_in_percent: "",
                          selling_price: "",
                        }));
                      } else if (!isNaN(sellingPrice) && basePrice > 0) {
                        const percentage =
                          ((sellingPrice - basePrice) / basePrice) * 100;
                        setNewUser((prev: any) => ({
                          ...prev,
                          base_and_selling_price_difference_in_percent:
                            percentage.toFixed(2),
                          selling_price: sellingPrice,
                        }));
                      }
                    }}
                    className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
                    required
                  />
                  <label
                    htmlFor='selling_price'
                    className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                  >
                    Selling Price *
                  </label>
                </div>
              </div>
            </div>

            <div className='bg-admin-secondary px-2 rounded-md'>
              <select
                name='Category'
                className='p-3 rounded-md bg-admin-secondary w-full text-white font-semibold text-lg h-12 focus:outline-none overflow-y-auto'
                value={newUser.category}
                onChange={handleCategoryChange}
                required
              >
                <option value=''>Select Category</option>
                {categories.map((category: any) => (
                  <option
                    key={category.id}
                    value={category.id}
                    className='bg-white text-black'
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className='bg-admin-secondary px-2 rounded-md'>
              {/* <select
              name='Sub Category'
                className='p-3 rounded-md bg-admin-secondary w-full text-white font-semibold text-lg h-12 focus:outline-none overflow-y-auto'
  value={String(newUser.sub_catogry || '')}
                onChange={handleSubCategoryChange}
                disabled={subCategories.length === 0}
                required={subCategories.length > 0 && newUser.sub_catogry !== "parent-category-only"} // Only required if subcategories exist and "parent-category-only" is not selected
              >
  <option value=''>Select Sub Category</option>

                {subcat.map((subCategory: any) => (
    <option
      key={subCategory.id}
                    value={subCategory.id}
                    className='bg-white text-black'>
                    {subCategory.name}
                  </option>
                ))}
              </select> */}

<select
  name="Sub Category"
  className="p-3 rounded-md bg-admin-secondary w-full text-white font-semibold text-lg h-12 focus:outline-none overflow-y-auto"
  value={newUser.sub_catogry ? String(newUser.sub_catogry) : ''}
  onChange={handleSubCategoryChange}
  disabled={subcat.length === 0}
  required={subcat.length > 0 && newUser.sub_catogry !== "parent-category-only"}
>
  <option value="">Select Sub Category</option>
  {subcat.map((subCategory: any) => (
    <option
      key={subCategory.id}
      value={subCategory.id}
      className="bg-white text-black"
    >
      {subCategory.name}
    </option>
  ))}
</select>

            </div>
            <div className='flex flex-col'>
              <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm'>
                <TbAlignBoxBottomLeftFilled color='#A5B7C0' size={26} />
                <input
                  type='number'
                  name='Product Stock'
                  value={newUser.stock}
                  onChange={(e) => {
                    const value = Number.parseFloat(e.target.value)
                    if (!isNaN(value) && value >= 0) {
                      setNewUser((prev: any) => ({ ...prev, stock: value }));
                    } else if (e.target.value === "") {
                      setNewUser((prev: any) => ({ ...prev, stock: "" }));
                    }
                  }}
                  // placeholder="Enter Product Stock *"
                  className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out'
                  required
                />
                <label
                  htmlFor='tag'
                  className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                >
                  Enter Product Stock *
                </label>
              </div>
            </div>

            {/* <div className='flex bg-[#F3F3F3] p-2 relative w-full h-12 rounded-lg shadow-sm'>
              <BsPuzzleFill color='#A5B7C0' size={26} />
              <input
                type='text'
                placeholder='weight_bearing_number'
                value={newUser.material}
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4  py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
                onChange={(e) =>
                  setNewUser((prev: any) => ({
                    ...prev,
                    material: e.target.value,
                  }))
                }
              />
              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                Material
              </label>
            </div> */}

            {/* <div className='flex bg-[#F3F3F3] p-2 relative w-full h-12 rounded-lg shadow-sm'>
              <BsPuzzleFill color='#A5B7C0' size={26} />
              <input
                type='number'
                placeholder='weight_bearing_number'
                value={newUser.weight_bearing_number}
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4  py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
                onChange={(e) =>
                  setNewUser((prev: any) => ({
                    ...prev,
                    weight_bearing_number: e.target.value,
                  }))
                }
                
              />
              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                Weight Bearing Number In Kg
              </label>
            </div> */}
            {/* 
            <div className='flex bg-[#F3F3F3] p-2 relative w-full h-12 rounded-lg shadow-sm'>
              <BsPuzzleFill color='#A5B7C0' size={26} />
              <input
                type='number'
                placeholder='Stackable Pieces Number'
                value={newUser.stackable_pieces_number}
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4  py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
                onChange={(e) =>
                  setNewUser((prev: any) => ({
                    ...prev,
                    stackable_pieces_number: e.target.value,
                  }))
                }
              />
              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                Stackable Pieces Number
              </label>
            </div>

            <div className='flex bg-[#F3F3F3] p-2 relative w-full h-12 rounded-lg shadow-sm'>
              <BsPuzzleFill color='#A5B7C0' size={26} />
              <input
                type='number'
                placeholder=' Minimum Order Quantity'
                value={newUser.minimum_order_quantity}
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4  py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
                onChange={(e) =>
                  setNewUser((prev: any) => ({
                    ...prev,
                    minimum_order_quantity: e.target.value,
                  }))
                }
                required
              />
              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                Minimum Order Quantity
              </label>
            </div> */}
            <div className='flex bg-[#F3F3F3] p-2 relative w-full h-12 rounded-lg shadow-sm'>
              <BsPuzzleFill color='#A5B7C0' size={26} />
              <input
                type='text'
                placeholder=' Minimum Order Quantity'
                value={newUser.seo_title}
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4  py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
                onChange={(e) =>
                  setNewUser((prev: any) => ({
                    ...prev,
                    seo_title: e.target.value,
                  }))
                }
              />
              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                SEO Title
              </label>
            </div>
            <div className='flex bg-[#F3F3F3] p-2 relative w-full h-12 rounded-lg shadow-sm'>
              <BsPuzzleFill color='#A5B7C0' size={26} />
              <input
                type='text'
                placeholder=' Minimum Order Quantity'
                value={newUser.seo_description}
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4  py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
                onChange={(e) =>
                  setNewUser((prev: any) => ({
                    ...prev,
                    seo_description: e.target.value,
                  }))
                }
              />
              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                SEO Description
              </label>
            </div>
            <div className='flex bg-[#F3F3F3] p-2 relative w-full h-12 rounded-lg shadow-sm'>
              <BsPuzzleFill color='#A5B7C0' size={26} />
              <input
                type='text'
                placeholder=' Minimum Order Quantity'
                value={newUser.seo_keyword}
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4  py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
                onChange={(e) =>
                  setNewUser((prev: any) => ({
                    ...prev,
                    seo_keyword: e.target.value,
                  }))
                }
              />
              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                SEO Keyword
              </label>
            </div>
            {/* <div className='flex flex-col'>
              <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm'>
                <TbAlignBoxBottomLeftFilled color='#A5B7C0' size={26} />
                <input
                  type='number'
                  name=' Product Low Stock Threshold'
                  value={newUser.low_stock_threshold}
                  onChange={(e) => {
                    const value = Number.parseFloat(e.target.value)
                    if (!isNaN(value) && value >= 0) {
                      setNewUser((prev: any) => ({
                        ...prev,
                        low_stock_threshold: value,
                      }))
                    } else if (e.target.value === "") {
                      setNewUser((prev: any) => ({
                        ...prev,
                        low_stock_threshold: "",
                      }))
                    }
                  }}
                  // placeholder="Enter Product Stock *"
                  className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out'
                  required
                />
                <label
                  htmlFor='tag'
                  className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                >
                  Enter Product Low Stock Threshold
                </label>
              </div>
            </div> */}
            {/* <div className='flex  items-center justify-between gap-2 bg-[#F3F3F3] rounded-lg h-12 w-full lg:p-4 p-2'>
              <label className='lg:text-md text-sm text-[#577C8E] lg:px-3 px-1'>
                Is Stackable?
              </label>
              <div className='switch'>
                <label>
                  <input
                    type='checkbox'
                    checked={newUser.is_stackable}
                    onChange={(e) =>
                      setNewUser((prev: any) => ({
                        ...prev,
                        is_stackable: e.target.checked,
                      }))
                    }
                  />
                  <span className='slider'></span>
                </label>
              </div>
            </div> */}
            <div className='flex gap-2 '>
              <div className='flex  items-center justify-between gap-2 bg-[#F3F3F3] rounded-lg h-12 w-full lg:p-4 p-2'>
                <label className='lg:text-md text-sm text-[#577C8E] lg:px-3 px-1'>
                  Is New Arrival?
                </label>
                <div className='switch'>
                  <label>
                    <input
                      type='checkbox'
                      checked={newUser.is_new_arrival}
                      onChange={(e) =>
                        setNewUser((prev: any) => ({
                          ...prev,
                          is_new_arrival: e.target.checked,
                        }))
                      }
                    />
                    <span className='slider'></span>
                  </label>
                </div>
              </div>
            </div>
            <div className='flex  items-center justify-between gap-2 bg-[#F3F3F3] rounded-lg h-12 w-full lg:p-4 p-2'>
              <label className='lg:text-md text-sm text-[#577C8E] lg:px-3 px-1'>
                Is Active?
              </label>
              <div className='switch'>
                <label>
                  <input
                    type='checkbox'
                    checked={newUser.is_active}
                    onChange={(e) =>
                      setNewUser((prev: any) => ({
                        ...prev,
                        is_active: e.target.checked,
                      }))
                    }
                  />
                  <span className='slider'></span>
                </label>
              </div>
            </div>
            
            <div className="-mt-2 lg:col-span-2">
              <p className="p-2">Tag</p>
              <div className="flex flex-wrap gap-2 p-2 bg-[#F3F3F3] rounded-md border border-gray-300 h-20 overflow-auto cursor-pointer">
                {isTagData?.map((data: any) => {
      const tagListSafe = newUser.tag_list || [];
      console.log(tagListSafe,"taglist")
      const isSelected = tagListSafe.includes(data.id);

                  return (
                    <div
                      key={data.id}
                      onClick={() => {
                        const updatedTags = isSelected
                          ? tagListSafe.filter((tagId: any) => tagId !== data.id)
              : [...tagListSafe, data.id];

                        setNewUser((prev: any) => ({
                          ...prev,
                          tag_list: updatedTags,
            }));
                      }}
                      className={`px-4 py-2 rounded-md cursor-pointer h-12 flex items-center justify-center transition-all duration-300 ${
            isSelected
              ? "bg-admin-buttonprimary text-white"
              : "bg-gray-200 text-black"
                      }`}
                    >
                      {data.name}
                    </div>
      );
                })}
              </div>
            </div>


            <div
              className='bg-admin-buttonprimary flex justify-between items-center text-white p-1 lg:col-span-2 rounded-md'
              onClick={handleToggle}
            >
              <h2 className='text-lg font-semibold w-full px-2'>Attributes</h2>
              <FaPlus
                size={26}
                className={`cursor-pointer transform transition-transform duration-300 ${isOpen ? "rotate-45" : "rotate-0"
                }`}
              />
            </div>
            <div
              className={`flex flex-col lg:flex-row  w-full lg:col-span-2 overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[170px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className='grid lg:grid-cols-2 px-4 grid-cols-1 gap-4 w-full'>
                <div className='p-3 flex items-center rounded-md bg-[#F3F3F3] h-12'>
                  <FaShoppingBag color='#A5B7C0' size={26} />
                  <div className='relative w-full'>
                    <input
                      type='text'
                      value={newUser?.variants?.attribute}
                      placeholder='Enter or Select Attribute'
                      onChange={handleInputChange}
                      onFocus={() => setDropdownVisible(true)} // Show dropdown on focus
                      onBlur={() =>
                        setTimeout(() => setDropdownVisible(false), 200)
                      } // Delay dropdown hide to allow option click
                      className='px-3 rounded-md bg-[#F3F3F3] focus:outline-none w-full text-sm '
                    />

                    {dropdownVisible && (
                      <ul className='absolute left-0  w-full mt-2 bg-white rounded-sm  max-h-40 overflow-y-auto z-10'>
                        {Object.keys(variantSpecifications || {}).map((attr) => (
                          <li
                            key={attr}
                            onClick={() => handleOptionClick(attr)} // Set selected attribute on click
                            className='px-3 py-2 cursor-pointer hover:bg-gray-200 text-sm w-full'
                          >
                            {attr.charAt(0).toUpperCase() + attr.slice(1)}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div>
                  <div className='p-3 flex items-center rounded-md bg-[#F3F3F3]'>
                    <FaMoneyBill color='#A5B7C0' size={26} />
                    <input
                      type='text'
                      value={newUser?.variants?.value}
                      placeholder='Enter Value'
                      onChange={(e) =>
                        setNewUser((prev: any) => ({
                          ...prev,
                          variants: {
                            ...prev.variants,
                            value: e.target.value,
                          },
                        }))
                      }
                      className='px-3 rounded-md bg-[#F3F3F3] focus:outline-none w-full'
                    />
                  </div>
                </div>

                <div
                  onClick={handleAddVariant}
                  className='bg-admin-buttonprimary  text-white  px-4 py-2 rounded-md lg:w-[200px] w-full h-12 text-center font-semibold cursor-pointer'
                >
                  Add Variant
                </div>
              </div>
              <div
                className={`w-full  ${variantSpecifications &&
                    Object.keys(variantSpecifications || {}).length > 0
                    ? "h-60"
                    : "h-20"
                } transition-height duration-300 overflow-y-auto`}
              >
                {Object.keys(variantSpecifications || {}).length > 0 ? (
                  <div className='overflow-y-scroll bg-[#F3F3F3] rounded-md border-[1px]'>
                    {Object.entries(variantSpecifications || {}).map(
                      ([attribute, values]) => (
                        <div
                          key={attribute}
                          className='flex  items-center text-md space-y-2'
                        >
                          <h3 className='font-semibold px-3'>
                            {attribute.charAt(0).toUpperCase() +
                              attribute.slice(1)}
                            :
                        </h3>
                          <ul className='pl-3 flex gap-4'>
                          {(values as string[]).map((value, index) => (
                            <div
                              key={index}
                                className='mb-1 flex items-center justify-between bg-white w-28 p-2 rounded-md'
                            >
                                <p className='text-sm'>{value}</p>
                              <div
                                onClick={() => handleDelete(attribute, value)}
                                  className='ml-2 text-red-500 hover:text-red-700 cursor-pointer'
                              >
                                <MdDelete size={26} />
                              </div>
                            </div>
                          ))}
                        </ul>
                      </div>
                      )
                    )}
                  </div>
                ) : (
                  <p>No variants added yet.</p>
                )}
              </div>
            </div>
          </div>
          <div className='mt-6 flex gap-3 justify-center items-center'>
            <button
              type='submit'
              className={`text-lg lg:w-[200px] mt-3  ${isEdit ? "bg-green-500" : "bg-admin-buttonprimary"
              } text-white px-6 lg:py-3 py-2 rounded-md`}
            >
              {isEdit ? "Update" : "Create"}
            </button>
            {isEdit ? (
              <>
                {" "}
                <button
                  onClick={handleCancelEdit}
                  className='text-lg lg:w-[200px] mt-3 bg-admin-buttonprimary text-white px-6 lg:py-3 py-2 rounded-md'
                >
                  Cancel
                </button>
              </>
            ) : null}
          </div>
        </form>
      )}
      {/* {isOPenUploadImg && <ImageUploadPopup onClose={undefined} />}  */}
    </div>
  );
};

export default ProductFormComponent;
