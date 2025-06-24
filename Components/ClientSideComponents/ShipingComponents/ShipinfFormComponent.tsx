import {
  shipingTogggleUpdatedApi,
  shipingUpdatedApi,
  shippingAllDataApi,
  shippingCreateApi,
} from "@/apis/shipingFormApi";
import { Switch } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker"; // Import DatePicker component
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker CSS
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { clearUserDetails } from "@/redux/userSlice";
import { useRouter } from "next/navigation";
import { FaKey, FaLink, FaUser } from "react-icons/fa6";
import { CiCalendar } from "react-icons/ci";
import { RiLockPasswordFill } from "react-icons/ri";

const ShipinfFormComponent = () => {
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [edit, setEdit] = useState<boolean>(false);
  const [paymentData, setPaymentData] = useState<any>({});
  const [name, setName] = useState("");
  const [isOpenInfoPopup, setIsInfoPopup] = useState<boolean>(false);
  const createdBy = useSelector((state: any) => state?.user?.details?.id);
  const [isFormDatasss, setFormDatasss] = useState("");
  const [isdatapop, setdatapop] = useState("");
  const token = useSelector((state: any) => state?.user?.token);
  const dispatch = useDispatch();
  const router = useRouter();

  const shipingMethod = [
    {
      name: "Aramex",
      disabled: true,
      fields: [
        "url",
        "aramex_username",
        "aramex_password",
        "aramex_account_number",
        "aramex_account_pin",
        "start_date",
        "end_date",
      ],
      lable: [
        "Url",
        "Aramex User Name*",
        "Aramex Password*",
        "Aramex Account number*",
        "Aramex Account Pin*",
        "Start Date",
        "End Date",
      ],
      requiredFields: [
        "aramex_username",
        "aramex_password",
        "aramex_account_number",
        "aramex_account_pin",
      ],
      fieldIcons: [
        <FaLink className='text-gray' size={18} />,
        <FaKey className='text-gray' size={18} />,
        <RiLockPasswordFill className='text-gray' size={18} />,
        <FaUser className='text-gray' size={18} />,
        <FaKey className='text-gray' size={18} />,
        <CiCalendar className='text-gray' size={18} />,
        <CiCalendar className='text-gray' size={18} />,
      ],
    },
    {
      name: "Shiprocket",
      disabled: true,
      fields: [
        "url",
        "shiprocket_username",
        "shiprocket_password",
        "shiprocket_token",
        "start_date",
        "end_date",
      ],
      lable: [
        "Url",
        "Shiprocket User Name*",
        "Shiprocket Password*",
        "Shiprocket Token*",
        "Start Date",
        "End Date",
      ],
      requiredFields: [
        "shiprocket_username",
        "shiprocket_password",
        "shiprocket_token",
      ],
      fieldIcons: [
        <FaLink className='text-gray' size={18} />,
        <FaKey className='text-gray' size={18} />,
        <RiLockPasswordFill className='text-gray' size={18} />,
        <FaUser className='text-gray' size={18} />,
        <FaKey className='text-gray' size={18} />,
        <CiCalendar className='text-gray' size={18} />,
        <CiCalendar className='text-gray' size={18} />,
      ],
    },
    {
      name: "USPS",
      disabled: true,
      fields: [
        "url",
        "usps_client_id",
        "usps_client_secret",
        "start_date",
        "end_date",
      ],
      lable: [
        "Url",
        "Ausps Client Id*",
        "Usps Client Secret*",
        "Start Date",
        "End Date",
      ],
      requiredFields: ["usps_client_id", "usps_client_secret"],
      fieldIcons: [
        <FaLink className='text-gray' size={18} />,
        <FaKey className='text-gray' size={18} />,
        <RiLockPasswordFill className='text-gray' size={18} />,
        <FaUser className='text-gray' size={18} />,
        <FaKey className='text-gray' size={18} />,
        <CiCalendar className='text-gray' size={18} />,
        <CiCalendar className='text-gray' size={18} />,
      ],
    },
  ];

  const toggleForm = (methodName: string) => {
    setEdit(false);
    setActiveForm(activeForm === methodName ? null : methodName);
    setFormData(paymentData[methodName.toLowerCase()] || {});
    setName(methodName);
  };

  const fetchPaymentData = async () => {
    try {
      const data = await shippingAllDataApi(token);
      if (data?.detail === "Invalid token") {
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again");
        router.push("/");
      } else if (data) {
        setPaymentData(data?.shipping_services || {});
      }
    } catch (error) {
      console.error("Error fetching payment data:", error);
    }
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };

  const handleDateChange = (date: Date | null, field: string) => {
    if (date) {
      const formattedDate = date.toISOString().split("T")[0];
      setFormData((prevFormData: any) => ({
        ...prevFormData,
        [field]: formattedDate,
      }));
      console.log("formattedDate", formattedDate);
    } else {
      setFormData((prevFormData: any) => ({
        ...prevFormData,
        [field]: "",
      }));
    }
  };
  const handleedit = () => {
    setEdit(true);
  };

  const handleSave = async () => {
    const currentMethod = shipingMethod.find((method) => method.name === name);
    if (currentMethod) {
      const newErrors: any = {};
      const requiredLabels = currentMethod.requiredFields
        .map((field) => {
          const fieldIndex = currentMethod.fields.indexOf(field);
          return fieldIndex !== -1 ? currentMethod.lable[fieldIndex] : null;
        })
        .filter((label) => label !== null);

      currentMethod.requiredFields.forEach((field) => {
        if (!formData[field]) {
          newErrors[field] = true;
        }
      });
      if (Object.keys(newErrors).length > 0) {
        toast.error("Please fill all required fields");
        return;
      }
      try {
        const response = await shippingCreateApi(
          name,
          formData,
          createdBy,
          token
        );
        if (response?.data?.error === "Invalid URL") {
          toast.error("Enter Correct Url");
        } else if (response?.detail === "Invalid token") {
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
        } else if (response?.status === 200) {
          fetchPaymentData();
          setActiveForm(null);
          setEdit(false);
          toast.success("Shipping method created successfully!");
        }
      } catch (error) {
        toast.error("Failed to save Shipping method.");
      }
    }
  };
  const handleUpdate = async () => {
    const currentMethod = shipingMethod.find((method) => method.name === name);
    if (currentMethod) {
      const newErrors: any = {};
      const requiredLabels = currentMethod.requiredFields
        .map((field) => {
          const fieldIndex = currentMethod.fields.indexOf(field);
          return fieldIndex !== -1 ? currentMethod.lable[fieldIndex] : null;
        })
        .filter((label) => label !== null);

      currentMethod.requiredFields.forEach((field) => {
        if (!formData[field]) {
          newErrors[field] = true;
        }
      });
      if (Object.keys(newErrors).length > 0) {
        toast.error("Please fill all required fields");
        return;
      }
      try {
        if (edit) {
          const updatedData = await shipingUpdatedApi(
            name,
            formData,
            createdBy,
            token
          );
          if (updatedData?.status === 200) {
            console.log("Payment Updated:", updatedData);
            fetchPaymentData();
            setActiveForm(null);
            setEdit(false);
            toast.success("Shipping method updated successfully!");
          } else if (updatedData?.data?.detail === "Invalid token") {
            dispatch(clearUserDetails());
            toast.error("Session Expired, Please Login Again");
            router.push("/");
          }
        }
      } catch (error) {
        console.error("Error saving payment data:", error);
        toast.error("Failed to save payment method.");
      }
    }
  };
  useEffect(() => {
    fetchPaymentData();
  }, []);
  const togleeApiUpdate = async (methodData: any, isActive: boolean) => {
    try {
      const updatedData = await shipingTogggleUpdatedApi(
        methodData?.id,
        methodData,
        isActive,
        createdBy,
        token
      );
      if (updatedData?.data?.detail === "Invalid token") {
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again");
        router.push("/");
      } else {
        await fetchPaymentData();
        setEdit(false);
      }
    } catch (error) {
      console.error("Error toggling payment data:", error);
      toast.error("Failed to update the payment method status.");
    }
  };
  const handleOpenInfo = (name: string) => {
    setIsInfoPopup(true);
    setdatapop(name);
  };
  const paymentServices = isFormDatasss;
  const areAllObjectsEmpty = Object.values(paymentServices).every(
    (service) => service && Object.keys(service).length === 0
  );
  return (
    <div className='bg-white shadow-md rounded-lg w-full flex flex-col justify-center items-center'>
      <div className='overflow-x-auto w-full border-[1px]'>
        <table className='w-full border-collapse table-fixed'>
          <thead className='bg-admin-secondary text-admin-text-primary lg:text-lg text-sm'>
            <tr>
              <th className='p-3 text-left'>Shipping Method</th>
              <th className='p-3 text-center'>Status</th>
              <th className='p-3 text-center'>Manage</th>
            </tr>
          </thead>
          <tbody>
            {shipingMethod.map((method) => {
              const methodKey = method.name.toLowerCase().replace(/\s+/g, "_");
              const methodData = paymentData[methodKey] || {};
              return (
                <React.Fragment key={method.name}>
                  <tr className='border-b border-gray-300 bg-white'>
                    <td className='py-4 px-4 font-medium text-left'>
                      {method.name}
                    </td>
                    <td className='py-4 px-4 text-center'>
                      <label className='inline-flex items-center  cursor-pointer'>
                        <Switch
                          checked={methodData?.is_active}
                          onChange={() =>
                            togleeApiUpdate(methodData, !methodData?.is_active)
                          }
                          className={`${
                            methodData?.is_active
                              ? "bg-green-500"
                              : "bg-gray-300"
                          } relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-200 ease-in-out`}
                        >
                          <span
                            className={`${
                              methodData?.is_active
                                ? "translate-x-6"
                                : "translate-x-1"
                            } inline-block w-6 h-6 bg-white rounded-full transition-transform duration-200 ease-in-out`}
                          />
                        </Switch>
                      </label>
                    </td>

                    {/* <td className='py-4 px-4 text-center'>
                      <button
                        onClick={() => {
                          toggleForm(method.name), setFormDatasss(methodData);
                        }}
                        className='bg-admin-buttonprimary text-white px-4 py-2 rounded-md'
                      >
                        Manage
                      </button>
                    </td> */}
                    <td className='py-4 px-4 text-center'>
                      <button
                        onClick={() => {
                          if (method.disabled) {
                            toggleForm(method.name);
                            setFormDatasss(methodData);
                          }
                        }}
                        disabled={!method.disabled} // <-- flipped the logic here
                        className={`px-4 py-2 rounded-md ${
                          method.disabled
                            ? "bg-admin-buttonprimary text-white"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                  {activeForm === method.name && (
                    <tr>
                      <td colSpan={4} className='py-4 px-4'>
                        <div className='p-4 bg-gray-100 rounded-md'>
                          <div className='grid lg:grid-cols-2 grid-cols-1 gap-4 mb-4'>
                            {method.fields.map((field, i) =>
                              field.includes("date") ? (
                                <div
                                  key={i}
                                  className={`relative border-b date border-gray-300 ${
                                    edit ? "bg-white" : ""
                                  }`}
                                >
                                  <DatePicker
                                    key={i}
                                    selected={
                                      formData[field]
                                        ? new Date(formData[field])
                                        : null
                                    }
                                    onChange={(date) =>
                                      handleDateChange(date, field)
                                    }
                                    className='p-2 w-full pl-10 '
                                    // placeholderText={method.lable[i]}
                                    dateFormat='yyyy-MM-dd'
                                    disabled={!edit}
                                    popperClassName='custom-popper'
                                    popperPlacement='bottom-start'
                                  />
                                  <label
                                    htmlFor='tag'
                                    className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                                  >
                                    {method.lable[i]}
                                  </label>
                                  {method.fieldIcons &&
                                    method.fieldIcons[i] && (
                                      <div className='absolute lg:left-3 left-2 top-1/2 transform -translate-y-1/2 text-gray-500'>
                                        {method.fieldIcons[i]}
                                      </div>
                                    )}
                                </div>
                              ) : (
                                <div
                                  key={`${field}-${i}`}
                                  className='relative w-full'
                                >
                                  <input
                                    key={i}
                                    type='text'
                                    value={formData[field] || ""}
                                    onChange={(e) =>
                                      handleInputChange(e, field)
                                    }
                                    // placeholder={method.lable[i]}
                                    className='col-span-1 p-2 pl-10 border border-gray-300 rounded-md w-full'
                                    disabled={!edit}
                                    required
                                  />
                                  <label
                                    htmlFor='tag'
                                    className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                                  >
                                    {method.lable[i]}
                                  </label>
                                  {method.fieldIcons &&
                                    method.fieldIcons[i] && (
                                      <div className='absolute lg:left-3 left-2 top-1/2 transform -translate-y-1/2 text-gray-500'>
                                        {method.fieldIcons[i]}
                                      </div>
                                    )}
                                </div>
                              )
                            )}
                          </div>
                          <div className='flex justify-center items-center space-x-4'>
                            {areAllObjectsEmpty ? (
                              <button
                                onClick={edit ? handleSave : handleedit}
                                className='bg-admin-buttonprimary text-white px-6 py-3 rounded-md w-28'
                              >
                                {edit ? "Save" : "Add"}
                              </button>
                            ) : (
                              <button
                                onClick={edit ? handleUpdate : handleedit}
                                className='bg-[#696AA2] text-white px-6 py-3 rounded-md w-28'
                              >
                                {edit ? "Save" : "Edit"}
                              </button>
                            )}
                            <button
                              onClick={() => toggleForm("")}
                              className='bg-[#D64242] text-white px-6 py-3 rounded-md w-28'
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShipinfFormComponent;
