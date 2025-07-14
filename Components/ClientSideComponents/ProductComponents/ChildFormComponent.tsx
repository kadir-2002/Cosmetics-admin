"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaMoneyBill, FaShoppingBag } from "react-icons/fa";
import { RiSubtractFill } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";
import {
  createProductVarientApi,
  ProductUpdatedVarientApi,
  VarientTabApi,
} from "@/apis/productApi";
import { useDispatch, useSelector } from "react-redux";
import { TbAlignBoxBottomLeftFilled } from "react-icons/tb";
import { clearUserDetails } from "@/redux/userSlice";
import { useRouter } from "next/navigation";

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
  isParentProductId: any;
  setOpenAddProduct: any;
  isParentProductdata: any;
  setSpecification: any;
  specification: any;
};
interface SubCategory {
  id: number;
  name: string;
}
interface Category {
  id: number;
  name: string;
  child_categories: SubCategory[];
}

const ChildFormComponent: React.FC<props> = ({
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
  specification,
  setSpecification,
  isParentProductId,
  setOpenAddProduct,
  isParentProductdata,
}) => {
  const created_by = useSelector((state: any) => state?.user?.details?.id);
  const [isVarientdata, setVarientdata] = useState<{ [key: string]: any }>({});
  const token = useSelector((state: any) => state?.user?.token);
  const dispatch = useDispatch();
  const router = useRouter();
  
  // console.log(isParentProductdata,"parent prod")
useEffect(() => {
  if (isParentProductdata) {
    setNewUser((prev:any) => ({
      ...prev,
      selling_price: isParentProductdata.sellingPrice,
      base_and_selling_price_difference_in_percent: isParentProductdata.priceDifferencePercent,
    }));
  }
}, [isParentProductdata]);

  const handleCreateOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {
      id,
      SKU,
      description,
      selling_price,
      base_and_selling_price_difference_in_percent,
      stock,
      colorcode,
      is_selected,
      is_active,
      is_new_arrival,
      low_stock_threshold,
    } = newUser;
    try {
      if (isEdit) {
        const response = await ProductUpdatedVarientApi(
          id,
          isParentProductId,
          SKU,
          description,
          selling_price,
          base_and_selling_price_difference_in_percent,
          specification,
          stock,
          colorcode,
          is_selected,
          is_active,
          is_new_arrival,
          created_by,
          low_stock_threshold,
          
          token
        );
        if (response?.status === 200) {
          toast.success("Varient Updated successfully");
          setIsEdit(false);
          setOpenForm(false);
          productdata();
          setSpecification({});
        } else if (response?.data?.message === "Invalid or expired token ") {
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
        }
      } else {
        const response = await createProductVarientApi(
         isParentProductId,
  isParentProductdata?.description || "",
  newUser.SKU,
  newUser.selling_price,
  newUser.base_and_selling_price_difference_in_percent,
  specification,
  newUser.stock,
  newUser.colorcode,
  newUser.is_selected,
  newUser.is_active,
  newUser.is_new_arrival,
  created_by,
  newUser.low_stock_threshold,
  token
        );
        if (response?.body?.error === "SKU with this name already exists") {
          toast.error("This SKU is already existed");
        } else if (response?.status === 201) {
          console.log("response", response?.status === 201);
          toast.success("Varient Add successfully!");
          setSpecification({});
          productdata();
          setOpenForm(false);
        } else if (response?.body?.detail === "Invalid token") {
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
        }
        setNewUser({
          id: "",
          name: "",
          description: "",
          SKU: "",
          selling_price: "",
          base_and_selling_price_difference_in_percent: "",
          setSpecification: "",
          is_active: false,
          is_new_arrival: false,
          low_stock_threshold: "",
        });
      }
    } catch (error) {
      toast.success("Enter Correct input");
    }
  };

 useEffect(() => {
  const fetchvarient = async () => {
    try {
      const response = await VarientTabApi(isParentProductId, token);
      console.log(response);

      if (response?.body.specifications) {
        // Transform array to object with arrays as values
        const groupedSpecs: Record<string, string[]> = {};

        response.body.specifications.forEach((spec: any) => {
          const key = spec.name;
          const value = spec.value;

          if (groupedSpecs[key]) {
            // Avoid duplicates
            if (!groupedSpecs[key].includes(value)) {
              groupedSpecs[key].push(value);
            }
          } else {
            groupedSpecs[key] = [value];
          }
        });

        setVarientdata(groupedSpecs); // ✅ Now isVarientdata is an object with array values
      } else if (response?.body.message === "Invalid or expired token") {
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again");
        router.push("/");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchvarient();
}, []);

  const handleCancelEdit = () => {
    setOpenForm(false);
    setNewUser({
      id: "",
      name: "",
      description: "",
      SKU: "",
      selling_price: "",
      base_and_selling_price_difference_in_percent: "",
      stock: "",
      is_active: false,
      is_new_arrival: false,
      parentProduct: "",
    });
  };

  const ColorInput = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: string;
    onChange: (val: string) => void;
  }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    };

    return (
      <div className='flex items-center justify-between'>
        <label className='w-[20%] text-sm '>{label}</label>
        <div className='flex w-[80%] items-center space-x-2'>
          <div className='rounded-md border border-gray-300 p-2 shadow-sm'>
            <input
              type='color'
              value={value}
              onChange={handleChange}
              className='w-15 h-6 rounded-md'
            />
          </div>
          <input
            type='text'
            value={value}
            onChange={handleChange}
            className='w-full rounded-md border bg-gray-100 p-3 text-sm font-medium text-black shadow-sm focus:outline-none'
          />
        </div>
      </div>
    );
  };
  return (
    <div className='lg:max-w-6xl lg:w-full rounded-md'>
      <div className='flex'>
        <div className='flex justify-center items-center mx-auto w-full mb-4 lg:gap-8 gap-3'>
          <div className='md:w-[60%] w-[90%] relative'></div>
          <button
            onClick={handleopenform}
            className='text-white font-semibold text-xl bg-admin-buttonprimary border-[1px] rounded-xl lg:w-[200px] w-[130px] h-12'
          >
            {openForm ? (
              <div className='flex justify-center items-center text-white gap-2'>
                <p>Close</p> <RiSubtractFill size={23} color='white' />
              </div>
            ) : (
              <div className='flex justify-center items-center text-white gap-2'>
                Add <IoMdAdd size={26} color='white' />
              </div>
            )}
          </button>
        </div>
      </div>
    {openForm && (
  <form
    onSubmit={handleCreateOrUpdate}
    className="lg:rounded-xl w-full border-[1px] overflow-y-auto px-2"
  >
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:w-full justify-center items-center lg:max-w-6xl w-full mt-4">
      {/* Product Name (read-only) */}
      <div className="flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm">
        <FaShoppingBag color="#A5B7C0" size={26} />
        <input
          type="text"
          name="Product Name"
          value={isParentProductdata?.name || ""}
          disabled
          className="peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out"
        />
        <label className="absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 bg-[#F3F3F3] peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm">
          Product Name *
        </label>
      </div>

      {/* SKU */}
      <div className="flex flex-col">
        <div className="flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm">
          <FaShoppingBag color="#A5B7C0" size={26} />
          <input
            type="text"
            name="SKU"
            value={newUser.SKU}
            onChange={(e) =>
              setNewUser((prev:any) => ({ ...prev, SKU: e.target.value }))
            }
            className="peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out"
            required
          />
          <label className="absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 bg-[#F3F3F3] peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm">
            Enter Variant SKU *
          </label>
        </div>
      </div>

      {/* Base Price (read-only) */}
      <div className="flex flex-col">
        <div className="flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm">
          <FaMoneyBill color="#A5B7C0" size={26} />
          <input
            type="number"
            value={isParentProductdata?.basePrice || ""}
            readOnly
            className="peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out"
          />
          <label className="absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 bg-[#F3F3F3] peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm">
            Base Price *
          </label>
        </div>
      </div>

      {/* Percentage & Selling Price */}
      <div className="flex lg:flex-row flex-col gap-5 w-full">
        {/* Percentage */}
        <div className="flex flex-col lg:w-1/2 w-full">
          <div className="flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm">
            <FaMoneyBill color="#A5B7C0" size={26} />
            <input
              type="number"
              name="percentage"
              value={newUser.base_and_selling_price_difference_in_percent || ""}
              onChange={(e) => {
                const percentage = parseFloat(e.target.value);
                const basePrice = parseFloat(isParentProductdata?.basePrice) || 0;
                if (e.target.value === "") {
                  setNewUser((prev:any) => ({
                    ...prev,
                    base_and_selling_price_difference_in_percent: "",
                    selling_price: "",
                  }));
                } else if (!isNaN(percentage)) {
                  const sellingPrice = basePrice * (1 + percentage / 100);
                  setNewUser((prev:any) => ({
                    ...prev,
                    base_and_selling_price_difference_in_percent: percentage,
                    selling_price: sellingPrice.toFixed(2),
                  }));
                }
              }}
              className="peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out"
              required
            />
            <label className="absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 bg-[#F3F3F3] peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm">
              Enter Percentage *
            </label>
          </div>
        </div>

        {/* Selling Price */}
        <div className="flex flex-col lg:w-1/2 w-full">
          <div className="flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm">
            <FaMoneyBill color="#A5B7C0" size={26} />
            <input
              type="number"
              name="selling_price"
              value={newUser.selling_price || ""}
              onChange={(e) => {
                const sellingPrice = parseFloat(e.target.value);
                const basePrice = parseFloat(isParentProductdata?.basePrice) || 0;
                if (e.target.value === "") {
                  setNewUser((prev:any) => ({
                    ...prev,
                    base_and_selling_price_difference_in_percent: "",
                    selling_price: "",
                  }));
                } else if (!isNaN(sellingPrice) && basePrice > 0) {
                  const percentage = ((sellingPrice - basePrice) / basePrice) * 100;
                  setNewUser((prev:any) => ({
                    ...prev,
                    base_and_selling_price_difference_in_percent: percentage.toFixed(2),
                    selling_price: sellingPrice.toFixed(2),
                  }));
                }
              }}
              className="peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out"
              required
            />
            <label className="absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 bg-[#F3F3F3] peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm">
              Selling Price *
            </label>
          </div>
        </div>
      </div>
      {isVarientdata && (
        <div className={`lg:col-span-2 grid grid-cols-1 ${Object.keys(isVarientdata).length % 2 === 0 ? "lg:grid-cols-2" : "lg:grid-cols-2"} gap-4`}>
          {Object.entries(isVarientdata).map(([key, values], index, array) => (
            <div key={index} className={`flex rounded-md bg-admin-secondary h-12 ${array.length % 2 !== 0 && index === array.length - 1 ? "lg:col-span-2" : ""}`}>
              <div className='p-2 rounded-md bg-admin-secondary w-full text-white font-semibold text-lg h-12 focus:outline-none'>
                <select
                  name={key}
                  value={specification[key] || ""}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    setSpecification((prev: any) => ({
                      ...prev,
                      [name]: value,
                    }));
                  }}
                  required
                  className='px-1 rounded-md bg-admin-secondary focus:outline-none w-full'
                >
                  <option value='' className='bg-white text-black w-full mt-2'>Select {key.charAt(0).toUpperCase() + key.slice(1)}</option>
                  {values.map((value: any, valueIndex: any) => (
                    <option key={valueIndex} value={value} className='bg-white text-black'>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ColorInput */}
      <ColorInput
        label="Color Code"
        value={newUser.colorcode}
        onChange={(value) =>
          setNewUser((prev:any) => ({ ...prev, colorcode: value }))
        }
      />

      {/* Stock */}
      <div className="flex flex-col">
        <div className="flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm">
          <TbAlignBoxBottomLeftFilled color="#A5B7C0" size={26} />
          <input
            type="number"
            name="Product Stock"
            value={newUser.stock || ""}
            onChange={(e) =>
              setNewUser((prev:any) => ({ ...prev, stock: e.target.value }))
            }
            className="peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out"
            required
          />
          <label className="absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 bg-[#F3F3F3] peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm">
            Enter Variant Stock *
          </label>
        </div>
      </div>

      {/* Low Stock Threshold */}
      <div className="flex flex-col">
        <div className="flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm">
          <TbAlignBoxBottomLeftFilled color="#A5B7C0" size={26} />
          <input
            type="number"
            name="Product Low Stock Threshold"
            value={newUser.low_stock_threshold || ""}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setNewUser((prev:any) => ({
                ...prev,
                low_stock_threshold: isNaN(value) ? "" : value,
              }));
            }}
            className="peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out"
            required
          />
          <label className="absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 bg-[#F3F3F3] peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm">
            Enter Product Low Stock Threshold
          </label>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="flex items-center justify-between gap-2 bg-[#F3F3F3] rounded-lg h-12 w-full lg:p-4 p-2">
        <label className="text-sm text-[#577C8E] px-3">Is Selected?</label>
        <div className="switch">
          <label>
            <input
              type="checkbox"
              checked={newUser.is_selected}
              onChange={(e) =>
                setNewUser((prev:any) => ({
                  ...prev,
                  is_selected: e.target.checked,
                }))
              }
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 bg-[#F3F3F3] rounded-lg h-12 w-full lg:p-4 p-2">
        <label className="text-sm text-[#577C8E] px-3">Is Active?</label>
        <div className="switch">
          <label>
            <input
              type="checkbox"
              checked={newUser.is_active}
              onChange={(e) =>
                setNewUser((prev:any) => ({
                  ...prev,
                  is_active: e.target.checked,
                }))
              }
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>

    {/* Buttons */}
    <div className="m-6 flex gap-3 justify-center items-center">
      <button
        type="submit"
        className={`text-lg lg:w-[200px] mt-3 ${
          isEdit ? "bg-green-500" : "bg-admin-buttonprimary"
        } text-white px-6 lg:py-3 py-2 rounded-md`}
      >
        {isEdit ? "Update" : "Create"}
      </button>
      {isEdit && (
        <button
          onClick={handleCancelEdit}
          className="text-lg lg:w-[200px] mt-3 bg-admin-buttonprimary text-white px-6 lg:py-3 py-2 rounded-md"
        >
          Cancel
        </button>
      )}
    </div>
  </form>
)}

    </div>
  );
};

export default ChildFormComponent;
