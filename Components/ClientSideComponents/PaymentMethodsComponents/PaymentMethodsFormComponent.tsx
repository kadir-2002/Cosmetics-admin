import {
  cashondeveleryCreateApi,
  paymentAllDataApi,
  paymentCreateApi,
  paymentUpdatedApi,
  toggleUpdatedApi,
} from "@/apis/paymentApi";
import { Switch } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker"; // Import DatePicker component
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker CSS
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import PaymentinfoPopComponent from "./PaymentinfoPopComponent";
import { useRouter } from "next/navigation";
import { clearUserDetails } from "@/redux/userSlice";
import { FaKey, FaLink, FaLock } from "react-icons/fa6";
import { CiCalendar } from "react-icons/ci";

const PaymentMethods = () => {
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

  const paymentMethods = [
    {
      name: "Razorpay",
      disabled: true,
      fields: [
        "url",
        "razorpay_key_id",
        "razorpay_key_secret",
        "start_date",
        "end_date",
      ],
      lable: [
        "Url",
        "Razorpay key id*",
        "Razorpay Key Secret*",
        "Start Date",
        "End Date",
      ],
      requiredFields: ["razorpay_key_id", "razorpay_key_secret"],
      fieldIcons: [
        <FaLink className='text-gray' size={18} />,
        <FaKey className='text-gray ' size={18} />,
        <FaKey className='text-gray ' size={18} />,
        <CiCalendar className='text-gray ' size={18} />,
        <CiCalendar className='text-gray' size={18} />,
      ],
    },
    {
      name: "Stripe",
      disabled: true,
      fields: [
        "url",
        "stripe_api_key",
        "stripe_endpoint_secret",
        "start_date",
        "end_date",
      ],
      lable: [
        "Url",
        "Stripe Api key*",
        "Stripe Endpoint Secret*",
        "Start Date",
        "End Date",
      ],
      requiredFields: ["stripe_api_key", "stripe_endpoint_secret"],
      fieldIcons: [
        <FaLink className='text-gray' size={18} />,
        <FaKey className='text-gray ' size={18} />,
        <FaKey className='text-gray ' size={18} />,
        <CiCalendar className='text-gray ' size={18} />,
        <CiCalendar className='text-gray' size={18} />,
      ],
    },
    {
      name: "Authorize.net",
      disabled: true,
      fields: [
        "url",
        "authorizenet_login_id",
        "authorizenet_transaction_key",
        "start_date",
        "end_date",
      ],
      lable: [
        "Url",
        "Authorizenet Login Id*",
        "Authorizenet Transaction Key*",
        "Start Date",
        "End Date",
      ],
      requiredFields: ["authorizenet_login_id", "authorizenet_transaction_key"],
      fieldIcons: [
        <FaLink className='text-gray' size={18} />,
        <FaKey className='text-gray ' size={18} />,
        <FaKey className='text-gray ' size={18} />,
        <CiCalendar className='text-gray ' size={18} />,
        <CiCalendar className='text-gray' size={18} />,
      ],
    },
    {
      name: "PayPal",
      disabled: true,
      fields: [
        "url",
        "paypal_client_id",
        "paypal_secret",
        "start_date",
        "end_date",
      ],
      lable: [
        "Url",
        "Paypal Client id*",
        "Paypal Secret*",
        "Start Date",
        "End Date",
      ],
      requiredFields: ["paypal_client_id", "paypal_secret"],
      fieldIcons: [
        <FaLink className='text-gray' size={18} />,
        <FaKey className='text-gray ' size={18} />,
        <FaKey className='text-gray ' size={18} />,
        <CiCalendar className='text-gray ' size={18} />,
        <CiCalendar className='text-gray' size={18} />,
      ],
    },
    {
      name: "Cashfree",
      disabled: true,
      fields: [
        "url",
        "cashfree_app_id",
        "cashfree_secret_key",
        "start_date",
        "end_date",
      ],
      lable: [
        "Url",
        "Cashfree App Id*",
        "Cashfree Secret Key*",
        "Start Date",
        "End Date",
      ],
      requiredFields: ["cashfree_app_id", "cashfree_app_id"],
      fieldIcons: [
        <FaLink className='text-gray' size={18} />,
        <FaKey className='text-gray ' size={18} />,
        <FaKey className='text-gray ' size={18} />,
        <CiCalendar className='text-gray ' size={18} />,
        <CiCalendar className='text-gray' size={18} />,
      ],
    },
    {
      name: "HyperPay",
      disabled: true,
      fields: [
        "url",
        "hyperpay_entity_id",
        "hyperpay_authorization_bearer",
        "start_date",
        "end_date",
      ],
      lable: [
        "Url",
        "Hyperpay Entity Id*",
        "Hyperpay Authorization Bearer*",
        "Start Date",
        "End Date",
      ],
      requiredFields: ["hyperpay_entity_id", "hyperpay_authorization_bearer"],
      fieldIcons: [
        <FaLink className='text-gray' size={18} />,
        <FaKey className='text-gray ' size={18} />,
        <FaKey className='text-gray ' size={18} />,
        <CiCalendar className='text-gray ' size={18} />,
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
      const data = await paymentAllDataApi(token);
      if (data?.message === "Invalid or expired token") {
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again");
        router.push("/");
      } else if (data) {
        setPaymentData(data?.payment_services || {});
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
    const currentMethod = paymentMethods.find((method) => method.name === name);
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
        const response = await paymentCreateApi(
          name,
          formData,
          createdBy,
          token
        );
        if (response?.data?.error === "Invalid URL") {
          toast.error("Enter Correct Url");
        } else if (response?.data?.message === "Invalid or expired token") {
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
        } else {
          fetchPaymentData();
          setActiveForm(null);
          setEdit(false);
          toast.success("Payment method created successfully!");
        }
      } catch (error) {
        console.error("Error saving payment data:", error);
        toast.error("Failed to save payment method.");
      }
    }
  };
  const handleUpdate = async () => {
    const currentMethod = paymentMethods.find((method) => method.name === name);
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
          const updatedData = await paymentUpdatedApi(
            name,
            formData,
            createdBy,
            token
          );
          if (updatedData?.data?.error === "Invalid URL") {
            toast.error("Enter Correct url");
          } else if (updatedData?.data?.message === "Invalid or expired token") {
            dispatch(clearUserDetails());
            toast.error("Session Expired, Please Login Again");
            router.push("/");
          } else if (updatedData?.status === 200) {
            console.log("Payment Updated:", updatedData);
            fetchPaymentData();
            setActiveForm(null);
            setEdit(false);
            toast.success("Payment method updated successfully!");
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
      const updatedData = await toggleUpdatedApi(
        methodData?.id,
        methodData,
        isActive,
        createdBy,
        token
      );
      if (updatedData?.status === 200) {
        console.log("Payment Updated:", updatedData);
        await fetchPaymentData();
        setEdit(false);
      } else if (updatedData?.data?.message === "Invalid or expired token") {
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again");
        router.push("/");
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

  const [isActive, setIsActive] = useState<boolean>(false);

  const handleToggle = async (methodData: any, isActive: boolean) => {
    try {
      if (methodData?.id) {
        const updatedData = await toggleUpdatedApi(
          methodData.id,
          methodData,
          isActive,
          createdBy,
          token
        );

        if (updatedData?.status === 200) {
          console.log("Payment Updated:", updatedData);
          await fetchPaymentData();
          setEdit(false);
        } else if (updatedData?.data?.message=== "Invalid or expired token") {
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
        }
      } else {
        const name = "Cash on Delivery";
        const response = await cashondeveleryCreateApi(
          name,
          isActive,
          createdBy,
          token
        );
        if (response?.data?.error === "Invalid URL") {
          toast.error("Enter Correct URL");
        } else if (response?.data?.message === "Invalid or expired token") {
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
        } else {
          fetchPaymentData();
          setActiveForm(null);
          setEdit(false);
          toast.success("Payment method created successfully!");
        }
      }
    } catch (error) {
      console.error("Error updating payment data:", error);
      toast.error("Failed to update the payment method status.");
    }
  };

  return (
    <div className='bg-white shadow-md rounded-lg w-full flex flex-col justify-center items-center'>
      <div className='overflow-x-auto w-full'>
        <table className='w-full border-collapse table-fixed'>
          <thead className='border-b-[2px] border-[#577C8E] text-[#577C8E] lg:text-lg text-sm'>
            <tr>
              <th className='py-3 px-8 text-left'>Payment Method</th>
              <th className='p-3 text-center'>Status</th>
              <th className='p-3 text-center'>Manage</th>
            </tr>
          </thead>
          <tbody>
            {paymentMethods.map((method) => {
              const methodKey = method.name.toLowerCase().replace(/\s+/g, "_");
              const methodData = paymentData[methodKey] || {};
              return (
                <React.Fragment key={method.name}>
                  <tr className='border-b border-gray-300 bg-white'>
                    <td className='py-4  px-8 font-medium text-left'>
                      {method.name}
                    </td>
                    <td className='py-4 lg:px-6 px-8 text-center'>
                      <label className='inline-flex items-center cursor-pointer'>
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
                          <div className='grid lg:grid-cols-2 grid-cols-1 gap-4 mb-4 w-full'>
                            {method.fields.map((field, i) =>
                              field.includes("date") ? (
                                <div
                                  key={i}
                                  className={`relative border-b date border-gray-300 w-full cursor-pointer ${
                                    edit ? "bg-white" : ""
                                  }`}
                                >
                                  <DatePicker
                                    key={`${field}-${i}`}
                                    selected={
                                      formData[field]
                                        ? new Date(formData[field])
                                        : null
                                    }
                                    onChange={(date) =>
                                      handleDateChange(date, field)
                                    }
                                    className='p-2 w-full text-left lg:ml-8 ml-6 focus:outline-none focus:ring-0 cursor-pointer'
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
                                    type='text'
                                    value={formData[field] || ""}
                                    onChange={(e) =>
                                      handleInputChange(e, field)
                                    }
                                    // placeholder={method.lable[i]}
                                    className='col-span-1 p-2 border border-gray-300  pl-10 rounded-md w-full focus:outline-none focus:ring-0'
                                    disabled={!edit}
                                    required
                                    // className="pee focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out "
                                  />
                                  <label
                                    htmlFor='tag'
                                    className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                                  >
                                    {method.lable[i]}
                                  </label>
                                  {method.fieldIcons &&
                                    method.fieldIcons[i] && (
                                      <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'>
                                        {method.fieldIcons[i]}
                                      </div>
                                    )}
                                </div>
                              )
                            )}
                          </div>
                          <div className='flex justify-center items-center space-x-4 '>
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
        <div className='flex justify-between items-center p-4 lg:w-[86%] w-full'>
          <p>Cash on Delivery</p>
          <div>
            <label className='inline-flex items-center cursor-pointer'>
              <Switch
                checked={paymentData?.cash_on_delivery?.is_active}
                onChange={() =>
                  handleToggle(
                    paymentData?.cash_on_delivery,
                    !paymentData?.cash_on_delivery?.is_active
                  )
                }
                className={`${
                  paymentData?.cash_on_delivery?.is_active
                    ? "bg-green-500"
                    : "bg-gray-300"
                } relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-200 ease-in-out`}
              >
                <span
                  className={`${
                    paymentData?.cash_on_delivery?.is_active
                      ? "translate-x-6"
                      : "translate-x-1"
                  } inline-block w-6 h-6 bg-white rounded-full transition-transform duration-200 ease-in-out`}
                />
              </Switch>
            </label>
          </div>
        </div>

        {isOpenInfoPopup && name && paymentData?.payment_services[name] && (
          <PaymentinfoPopComponent
            role={paymentData?.payment_services[name] === isdatapop}
            paymentDetails={paymentData?.payment_services[name]}
            isOpenInfoPopup={isOpenInfoPopup}
            setIsInfoPopup={setIsInfoPopup}
            setIsOpen={setIsInfoPopup}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentMethods;
