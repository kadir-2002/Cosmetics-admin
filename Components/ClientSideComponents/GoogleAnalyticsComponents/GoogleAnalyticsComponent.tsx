"use client";
import React, { useEffect, useState } from "react";
import {
  coureancyUpdatedApi,
  createCoureeancyApi,
  currencyAllDataApi,
} from "@/apis/coureancyApi";
import toast from "react-hot-toast";
import { BsPuzzleFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { clearUserDetails } from "@/redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  creategoogleanalyticsApi,
  googleanalyticsApiAllDataApi,
  updategoogleanalyticsApi,
} from "@/apis/googleanalyticsApi";

interface PaymentData {
  id: string;
  email: string;
  measurement_id: string;
  tag: string;
  is_active: boolean;
}
const GoogleAnalyticsComponent = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newRole, setNewRole] = useState({
    id: "",
    email: "",
    measurement_id: "",
    tag: "",
    is_active: false,
  });
  const [currencyData, setCurrencyData] = useState<PaymentData | null>(null);
  const token = useSelector((state: any) => state?.user?.token);
  const dispatch = useDispatch();
  const router = useRouter();
  const [emailError, setEmailError] = useState("");

  const handleEmailChange = (e:any) => {
    const email = e.target.value;
    setNewRole((prev) => ({
      ...prev,
      email,
    }));

    // Basic email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const fetchcurrencyData = async () => {
    try {
      const response = await googleanalyticsApiAllDataApi(token);

      if (response?.detail === "Invalid token") {
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again");
        router.push("/");
        return;
      }

      if (response.results && response.results.length > 0) {
        const data = response.results[0];
        setCurrencyData(data);
        setNewRole({
          id: data.id.toString(),
          email: data.google_email,
          measurement_id: data.measurement_id,
          tag: data.tag,
          is_active: data.is_active,
        });
      }
    } catch (error) {
      console.log("Error fetching currency data:", error);
    }
  };

  useEffect(() => {
    fetchcurrencyData();
  }, []);

  const handleUpdate = async () => {
    const { id, email, measurement_id, tag, is_active } = newRole;

    if (!email || !measurement_id || !tag) {
      toast.error("All data is mandatory to fill");
      return;
    }

    try {
      const response = await updategoogleanalyticsApi(
        id,
        email,
        measurement_id,
        tag,
        is_active,
        token
      );
      if (response?.status === 401) {
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again");
        router.push("/");
        return;
      }
      if (response?.status === 200) {
        toast.success("Google Analytics Details updated successfully!");
        fetchcurrencyData();
        setIsFormOpen(false);
      }
    } catch (error) {
      toast.error("Failed to save currency.");
    }
  };
  const handlCreate = async () => {
    const { email, measurement_id, tag, is_active } = newRole;
    if (!email || !measurement_id || !tag) {
      toast.error("All data is mandatory to fill");
      return;
    }

    try {
      const response = await creategoogleanalyticsApi(
        email,
        measurement_id,
        tag,
        is_active,
        token
      );
      console.log(response, "Response->>");
      if (response?.status === 401) {
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again");
        router.push("/");
        return;
      }
      if (response) {
        toast.success("Google Analytics Details created successfully!");
        fetchcurrencyData();
        setIsFormOpen(false);
      }
    } catch (error) {
      toast.error("Failed to save currency.");
    }
  };

  return (
    <div className='bg-white shadow-md rounded-lg w-full flex flex-col justify-center items-center'>
      <div className=' overflow-x-auto w-full'>
        <table className='w-full border-collapse'>
          <thead className='bg-admin-secondary text-admin-text-primary lg:text-lg text-sm'>
            <tr>
              <th className='p-3 text-center'>Google Analytics</th>
              <th className='p-3 text-center'>Manage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='p-3 text-center'>
                {currencyData === null ? (
                  "  Google Analytics"
                ) : (
                  <p>
                    {/* {currencyData?.currency}
                    {currencyData?.currency_symbol} */}
                    Google Analytics
                  </p>
                )}
              </td>
              <td className='p-3 text-center'>
                <button
                  onClick={() => setIsFormOpen(!isFormOpen)}
                  className='bg-admin-buttonprimary text-white px-4 py-2 rounded-md'
                >
                  Manage
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <div className='mt-2 flex shadow-lg rounded-md justify-center items-center lg:p-4 p-4 w-full bg-[#F9FAFB]'>
          <div className='lg:ml-12 justify-center items-center gap-6 w-full  rounded-md'>
            <div className='gap-5 w-full grid lg:grid-cols-2 grid-cols-1'>
              <div className=''>
                <div className='flex bg-[#F3F3F3] p-2 relative w-full h-12 rounded-lg shadow-sm'>
                  <BsPuzzleFill color='#A5B7C0' size={26} />
                  <input
                    type='email'
                    placeholder='email'
                    value={newRole.email}
                    className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out'
                    onChange={handleEmailChange}
                    required
                  />
                  <label
                    htmlFor='tag'
                    className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'>
                    Google Analytics Email
                  </label>
                </div>
                {emailError && (
                  <p className='text-red-500 text-sm mt-1 ml-2'>{emailError}</p>
                )}
              </div>
              <div className='flex bg-[#F3F3F3] p-2 relative w-full h-12 rounded-lg shadow-sm'>
                <BsPuzzleFill color='#A5B7C0' size={26} />
                <input
                  type='text'
                  placeholder=' Google Analytics Id'
                  value={newRole.measurement_id}
                  className='peer bg-[#F3F3F3] focus:outline-none w-full px-4  py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
                  onChange={(e) =>
                    setNewRole((prev) => ({
                      ...prev,
                      measurement_id: e.target.value,
                    }))
                  }
                  required
                />
                <label
                  htmlFor='tag'
                  className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                >
                  Google Analytics Id
                </label>
              </div>
              <div className='flex bg-[#F3F3F3] p-2 relative w-full h-12 rounded-lg shadow-sm'>
                <BsPuzzleFill color='#A5B7C0' size={26} />
                <input
                  type='text'
                  placeholder='Google Analytics Tag'
                  value={newRole.tag}
                  className='peer bg-[#F3F3F3] focus:outline-none w-full px-4  py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
                  onChange={(e) =>
                    setNewRole((prev) => ({
                      ...prev,
                      tag: e.target.value,
                    }))
                  }
                  required
                />
                <label
                  htmlFor='tag'
                  className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                >
                  Google Analytics Tag
                </label>
              </div>
            </div>
            <div className='flex justify-center items-center gap-4 w-full mt-6'>
              {currencyData ? (
                <button
                  type='button'
                  onClick={handleUpdate}
                  className='bg-admin-buttonprimary text-white px-4 py-2 rounded-md hover:bg-gray-700'
                >
                  Save
                </button>
              ) : (
                <button
                  type='button'
                  onClick={handlCreate}
                  className='bg-admin-buttonprimary text-white px-4 py-2 rounded-md hover:bg-gray-700'
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleAnalyticsComponent;
