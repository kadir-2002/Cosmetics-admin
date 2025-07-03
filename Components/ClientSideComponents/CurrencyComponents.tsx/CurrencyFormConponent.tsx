"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import countries from "world-countries";
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
import { BiSolidImageAdd } from "react-icons/bi";
const formattedCountries = countries.map((country) => ({
  value: country.cca2,
  label: `${country.name.common} (${country.cca2})`,
  currency: country.currencies ? Object.keys(country.currencies)[0] : "",
  currencySymbol: country.currencies
    ? country.currencies[Object.keys(country.currencies)[0]]?.symbol
    : "",
}));
interface PaymentDetails {
  id: number;
  country: string;
  currency: string;
  currency_symbol: string;
  logo: string;
  address: string;
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
}
interface PaymentData {
  currency: string;
  currency_symbol: string;
  details: PaymentDetails;
}
const CurrencyManager = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newRole, setNewRole] = useState({
    id: "",
    country: "India",
    currency: "INR",
    currency_symbol: "₹",
    logo: "",
    address: "",
    phone: "",
    email: "",
    description: "",
    facebook_icon: "",
    facebook_link: "",
    instagram_icon: "",
    instagram_link: "",
    twitter_icon: "",
    twitter_link: "",
    linkedin_icon: "",
    linkedin_link: "",
    product_low_stock_threshold: "",
    minimum_order_quantity: "",
  });
  const [isfile, setfile] = useState("");
  const [fileName, setFileName] = useState("");
  const [facebookfilename, setfacebookFileName] = useState("");
  const [instagramfileName, setinstagramFileName] = useState("");
  const [twitterfileName, settwitterFileName] = useState("");
  const [linkdingfileName, setlinkdingFileName] = useState("");
  const [currencyData, setCurrencyData] = useState<PaymentData | null>(null);
  const token = useSelector((state: any) => state?.user?.token);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleCountryChange = (selectedOption: any) => {
    setNewRole((prev) => ({
      ...prev,
      country: selectedOption.value,
      currency: selectedOption.currency,
      currency_symbol: selectedOption.currencySymbol,
    }));
  };

  const fetchcurrencyData = async () => {
    try {
      const response = await currencyAllDataApi(token);
      if (response?.status === 401) {
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again");
        router.push("/");
        return;
      }
      if (response.body.result && response.body.result.length > 0) {
        const result = response.body.result[0];
        setCurrencyData(result);
        setNewRole({
          id: result.id,
          country: result.country,
          currency: result.currency,
          currency_symbol: result.currency_symbol,
          logo: result.logo,
          address: result.address,
          phone: result.phone,
          email: result.email,
          description: result.text,
          facebook_icon: result.facebook_icon,
          facebook_link: result.facebook_link,
          instagram_icon: result.instagram_icon,
          instagram_link: result.instagram_link,
          twitter_icon: result.twitter_icon,
          twitter_link: result.twitter_link,
          linkedin_icon: result.linkedin_icon,
          linkedin_link: result.linkedin_link,
          product_low_stock_threshold: result.product_low_stock_threshold,
          minimum_order_quantity: result.minimum_order_quantity,
        })
      }
    } catch (error) {
      console.log("Error fetching currency data:", error);
    }
  };

  useEffect(() => {
    fetchcurrencyData();
  }, []);

  const handleUpdate = async () => {
    const {
      id,
      country,
      currency,
      currency_symbol,
      logo,
      address,
      phone,
      email,
      description,
      facebook_icon,
      facebook_link,
      instagram_icon,
      instagram_link,
      twitter_icon,
      twitter_link,
      linkedin_icon,
      linkedin_link,
      product_low_stock_threshold,
      minimum_order_quantity,
    } = newRole;
    // if (!country || !currency || !currency_symbol) {
    //   toast.error("All fields are required");
    //   return;
    // }

    try {
      const response = await coureancyUpdatedApi(
        id,
        country,
        currency,
        currency_symbol,
        logo,
        address,
        phone,
        email,
        description,
        facebook_icon,
        facebook_link,
        instagram_icon,
        instagram_link,
        twitter_icon,
        twitter_link,
        linkedin_icon,
        linkedin_link,
        product_low_stock_threshold,
        minimum_order_quantity,
        token
      );
      if (response?.status === 401) {
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again");
        router.push("/");
        return;
      }
      if (response?.status === 200) {
        toast.success("Company Details updated successfully!");
        fetchcurrencyData();
        setIsFormOpen(false);
      }
    } catch (error) {
      toast.error("Failed to save currency.");
    }
  };
  const handlCreate = async () => {
    const {
      country,
      currency,
      currency_symbol,
      logo,
      address,
      phone,
      email,
      description,
      facebook_icon,
      facebook_link,
      instagram_icon,
      instagram_link,
      twitter_icon,
      twitter_link,
      linkedin_icon,
      linkedin_link,
      product_low_stock_threshold,
      minimum_order_quantity,
    } = newRole;
    // if (!country || !currency || !currency_symbol) {
    //   toast.error("All fields are required. Please fill in all the details.");
    //   return;
    // }
    try {
      const response = await createCoureeancyApi(
        country,
        currency,
        currency_symbol,
        logo,
        address,
        phone,
        email,
        description,
        facebook_icon,
        facebook_link,
        instagram_icon,
        instagram_link,
        twitter_icon,
        twitter_link,
        linkedin_icon,
        linkedin_link,
        product_low_stock_threshold,
        minimum_order_quantity,
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
        toast.success("Company Details created successfully!");
        fetchcurrencyData();
        setIsFormOpen(false);
      }
    } catch (error) {
      toast.error("Failed to save currency.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file: any = e.target.files?.[0];
    setfile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setNewRole((prev) => ({
            ...prev,
            logo: file,
          }));
          setFileName(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlefacebook_iconChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file: any = e.target.files?.[0];
    // setfile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setNewRole((prev) => ({
            ...prev,
            facebook_icon: file,
          }));
          setfacebookFileName(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleinstagram_iconChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file: any = e.target.files?.[0];
    // setfile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setNewRole((prev) => ({
            ...prev,
            instagram_icon: file,
          }));
          setinstagramFileName(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handletwitter_iconChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file: any = e.target.files?.[0];
    // setfile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setNewRole((prev) => ({
            ...prev,
            twitter_icon: file,
          }));
          settwitterFileName(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlelinkedin_iconChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file: any = e.target.files?.[0];
    // setfile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setNewRole((prev) => ({
            ...prev,
            linkedin_icon: file,
          }));
          setlinkdingFileName(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className='bg-white shadow-md rounded-lg w-full flex flex-col justify-center items-center'>
      <div className=' overflow-x-auto w-full'>
        <table className='w-full border-collapse'>
          <thead className='bg-admin-secondary text-admin-text-primary lg:text-lg text-sm'>
            <tr>
              <th className='p-3 text-center'>Company Details</th>
              {/* <th className="p-3 text-center">Info</th> */}
              <th className='p-3 text-center'>Manage</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-purple-100">
              <td className='p-3 text-center'>
                {currencyData === null ? (
                  "Please Add the Currency "
                ) : (
                  <p>
                    {/* {currencyData?.currency}
                    {currencyData?.currency_symbol} */}
                    Company Details
                  </p>
                )}
              </td>
              {/* <td className="p-3 text-center">info</td> */}
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
              <div className='flex gap-3 w-full'>
                <div className='border-primary/30 border-[1px] bg-gray-50 rounded-md  w-full focus:outline-none focus:outline-1 placeholder-black h-12'>
                  <div className='flex bg-admin-secondary justify-center items-center px-4 rounded-md'>
                    <p className='text-white'>Logo</p>
                    <input
                      id='img'
                      name='img'
                      type='file'
                      placeholder='Upload Logo'
                      // value={newUser?.profile_picture}
                      onChange={handleFileChange}
                      accept='.jpeg,.png,'
                      //   {...(isEdit ? {} : { required: true })}
                      className='block w-full text-sm text-admin-secondary file:mr-4 file:py-1 file:h-12 file:px-4  file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-admin-secondary bg-admin-secondary file:text-white hover:file:bg-gray-700'
                    />
                    {fileName ? (
                      <span className='text-white px-2 w-full'>
                        {fileName.length > 10
                          ? `${fileName.slice(0, 20)}...`
                          : fileName}
                      </span>
                    ) : (
                      <BiSolidImageAdd color='white' size={27} />
                    )}
                  </div>
                </div>
                {newRole?.logo ? (
                  <div className='lg:h-16 lg:w-20 h-10 w-10 bg-gray-200 flex items-center justify-center rounded-full p-1'>
                    <img
                      src={`${newRole?.logo}`}
                      alt='Profile'
                      className='lg:h-16 lg:w-16 h-10 w-10 object-contain rounded-full'
                    />
                  </div>
                ) : null}
              </div>

              <div className='flex bg-[#F3F3F3] p-2 relative w-full h-12 rounded-lg shadow-sm'>
                <BsPuzzleFill color='#A5B7C0' size={26} />
                <input
                  type='number'
                  placeholder='Product Low Stock Threshold *'
                  value={newRole.phone}
                  className='peer bg-[#F3F3F3] focus:outline-none w-full px-4  py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
                  onChange={(e) =>
                    setNewRole((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                />
                <label
                  htmlFor='tag'
                  className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                >
                  Phone Number
                </label>
              </div>
              <div className='flex bg-[#F3F3F3] p-2 relative w-full h-12 rounded-lg shadow-sm'>
                <BsPuzzleFill color='#A5B7C0' size={26} />
                <input
                  type='text'
                  placeholder='Product Low Stock Threshold *'
                  value={newRole.email}
                  className='peer bg-[#F3F3F3] focus:outline-none w-full px-4  py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
                  onChange={(e) =>
                    setNewRole((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
                <label
                  htmlFor='tag'
                  className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                >
                  Email
                </label>
              </div>
              <div className='flex bg-[#F3F3F3] p-2 relative w-full h-12 rounded-lg shadow-sm'>
                <BsPuzzleFill color='#A5B7C0' size={26} />
                <input
                  type='text'
                  placeholder='Product Low Stock Threshold *'
                  value={newRole.description}
                  className='peer bg-[#F3F3F3] focus:outline-none w-full px-4  py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
                  onChange={(e) =>
                    setNewRole((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
                <label
                  htmlFor='tag'
                  className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                >
                  Description
                </label>
              </div>
              <div className='flex bg-[#F3F3F3] p-2 relative w-full h-12 rounded-lg shadow-sm lg:col-span-2'>
                <BsPuzzleFill color='#A5B7C0' size={26} />
                <input
                  type='text'
                  placeholder='Product Low Stock Threshold *'
                  value={newRole.address}
                  className='peer bg-[#F3F3F3] focus:outline-none w-full px-4  py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
                  onChange={(e) =>
                    setNewRole((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                />
                <label
                  htmlFor='tag'
                  className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                >
                  Address
                </label>
              </div>

              <div className='lg:flex gap-3 w-full'>
                <div className='border-primary/30 border-[1px] bg-gray-50 rounded-md  w-full focus:outline-none focus:outline-1 placeholder-black h-12'>
                  <div className='flex bg-admin-secondary justify-center items-center px-4 rounded-md'>
                    <input
                      id='img'
                      name='img'
                      type='file'
                      placeholder='Upload Logo'
                      // value={newUser?.profile_picture}
                      onChange={handlefacebook_iconChange}
                      accept='.jpeg,.png,'
                      //   {...(isEdit ? {} : { required: true })}
                      className='block w-full text-sm text-admin-secondary file:mr-4 file:py-1 file:h-12 file:px-4  file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-admin-secondary bg-admin-secondary file:text-white hover:file:bg-gray-700'
                    />
                    {facebookfilename ? (
                      <span className='text-white px-2 w-full'>
                        {fileName.length > 10
                          ? `${facebookfilename.slice(0, 20)}...`
                          : facebookfilename}
                      </span>
                    ) : (
                      <BiSolidImageAdd color='white' size={27} />
                    )}
                  </div>
                </div>
                {newRole?.facebook_icon ? (
                  <div className='lg:h-16 lg:w-20 h-10 w-10 bg-gray-200 flex items-center justify-center rounded-full p-1'>
                    <img
                      src={newRole?.facebook_icon}
                      alt='Profile'
                      className='lg:h-16 lg:w-16 h-10 w-10 object-contain rounded-full'
                    />
                  </div>
                ) : null}
              </div>
              <div className='flex bg-[#F3F3F3] p-2 relative w-full h-12 rounded-lg shadow-sm'>
                <BsPuzzleFill color='#A5B7C0' size={26} />
                <input
                  type='text'
                  placeholder='Product Low Stock Threshold *'
                  value={newRole.facebook_link}
                  className='peer bg-[#F3F3F3] focus:outline-none w-full px-4  py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
                  onChange={(e) =>
                    setNewRole((prev) => ({
                      ...prev,
                      facebook_link: e.target.value,
                    }))
                  }
                />
                <label
                  htmlFor='tag'
                  className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                >
                  Icon Link
                </label>
              </div>

              <div className='lg:flex gap-3 w-full'>
                <div className='border-primary/30 border-[1px] bg-gray-50 rounded-md  w-full focus:outline-none focus:outline-1 placeholder-black h-12'>
                  <div className='flex bg-admin-secondary justify-center items-center px-4 rounded-md'>
                    <input
                      id='img'
                      name='img'
                      type='file'
                      placeholder='Upload Logo'
                      // value={newUser?.profile_picture}
                      onChange={handleinstagram_iconChange}
                      accept='.jpeg,.png,'
                      //   {...(isEdit ? {} : { required: true })}
                      className='block w-full text-sm text-admin-secondary file:mr-4 file:py-1 file:h-12 file:px-4  file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-admin-secondary bg-admin-secondary file:text-white hover:file:bg-gray-700'
                    />
                    {instagramfileName ? (
                      <span className='text-white px-2 w-full'>
                        {instagramfileName.length > 10
                          ? `${instagramfileName.slice(0, 28)}...`
                          : instagramfileName}
                      </span>
                    ) : (
                      <BiSolidImageAdd color='white' size={27} />
                    )}
                  </div>
                </div>
                {newRole?.instagram_icon ? (
                  <div className='lg:h-16 lg:w-20 h-10 w-10 bg-gray-200 flex items-center justify-center rounded-full p-1'>
                    <img
                      src={`${newRole?.instagram_icon}`}
                      alt='Profile'
                      className='lg:h-16 lg:w-16 h-10 w-10 object-contain rounded-full'
                    />
                  </div>
                ) : null}
              </div>
              <div className='flex bg-[#F3F3F3] p-2 relative w-full h-12 rounded-lg shadow-sm'>
                <BsPuzzleFill color='#A5B7C0' size={26} />
                <input
                  type='text'
                  placeholder='Product Low Stock Threshold *'
                  value={newRole.instagram_link}
                  className='peer bg-[#F3F3F3] focus:outline-none w-full px-4  py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
                  onChange={(e) =>
                    setNewRole((prev) => ({
                      ...prev,
                      instagram_link: e.target.value,
                    }))
                  }
                />
                <label
                  htmlFor='tag'
                  className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                >
                  Icon Link
                </label>
              </div>

              <div className='lg:flex gap-3 w-full'>
                <div className='border-primary/30 border-[1px] bg-gray-50 rounded-md  w-full focus:outline-none focus:outline-1 placeholder-black h-12'>
                  <div className='flex bg-admin-secondary justify-center items-center px-4 rounded-md'>
                    <input
                      id='img'
                      name='img'
                      type='file'
                      placeholder='Upload Logo'
                      // value={newUser?.profile_picture}
                      onChange={handletwitter_iconChange}
                      accept='.jpeg,.png,'
                      //   {...(isEdit ? {} : { required: true })}
                      className='block w-full text-sm text-admin-secondary file:mr-4 file:py-1 file:h-12 file:px-4  file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-admin-secondary bg-admin-secondary file:text-white hover:file:bg-gray-700'
                    />
                    {twitterfileName ? (
                      <span className='text-white px-2 w-full'>
                        {twitterfileName.length > 10
                          ? `${twitterfileName.slice(0, 20)}...`
                          : twitterfileName}
                      </span>
                    ) : (
                      <BiSolidImageAdd color='white' size={27} />
                    )}
                  </div>
                </div>
                {newRole?.twitter_icon ? (
                  <div className='lg:h-16 lg:w-20 h-10 w-10 bg-gray-200 flex items-center justify-center rounded-full p-1'>
                    <img
                      src={`${newRole?.twitter_icon}`}
                      alt='Profile'
                      className='lg:h-16 lg:w-16 h-10 w-10 object-contain rounded-full'
                    />
                  </div>
                ) : null}
              </div>
              <div className='flex bg-[#F3F3F3] p-2 relative w-full h-12 rounded-lg shadow-sm'>
                <BsPuzzleFill color='#A5B7C0' size={26} />
                <input
                  type='text'
                  placeholder='Icon link'
                  value={newRole.twitter_link}
                  className='peer bg-[#F3F3F3] focus:outline-none w-full px-4  py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
                  onChange={(e) =>
                    setNewRole((prev) => ({
                      ...prev,
                      twitter_link: e.target.value,
                    }))
                  }
                />
                <label
                  htmlFor='tag'
                  className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                >
                  Icon Link
                </label>
              </div>

              <div className='lg:flex gap-3 w-full'>
                <div className='border-primary/30 border-[1px] bg-gray-50 rounded-md  w-full focus:outline-none focus:outline-1 placeholder-black h-12'>
                  <div className='flex bg-admin-secondary justify-center items-center px-4 rounded-md'>
                    <input
                      id='img'
                      name='img'
                      type='file'
                      placeholder='Upload Logo'
                      // value={newUser?.profile_picture}
                      onChange={handlelinkedin_iconChange}
                      accept='.jpeg,.png,'
                      //   {...(isEdit ? {} : { required: true })}
                      className='block w-full text-sm text-admin-secondary file:mr-4 file:py-1 file:h-12 file:px-4  file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-admin-secondary bg-admin-secondary file:text-white hover:file:bg-gray-700'
                    />
                    <h1> {newRole.country}</h1>
                    {linkdingfileName ? (
                      <span className='text-white px-2 w-full'>
                        {linkdingfileName.length > 10
                          ? `${linkdingfileName.slice(0, 20)}...`
                          : linkdingfileName}
                      </span>
                    ) : (
                      <BiSolidImageAdd color='white' size={27} />
                    )}
                  </div>
                </div>
                {newRole?.linkedin_icon ? (
                  <div className='lg:h-16 lg:w-20 h-10 w-10 bg-gray-200 flex items-center justify-center rounded-full p-1'>
                    <img
                      src={`${newRole?.linkedin_icon}`}
                      alt='Profile'
                      className='lg:h-16 lg:w-16 h-10 w-10 object-contain rounded-full'
                    />
                  </div>
                ) : null}
              </div>
              <div className='flex bg-[#F3F3F3] p-2 relative w-full h-12 rounded-lg shadow-sm'>
                <BsPuzzleFill color='#A5B7C0' size={26} />
                <input
                  type='text'
                  placeholder='Icon link'
                  value={newRole.linkedin_link}
                  className='peer bg-[#F3F3F3] focus:outline-none w-full px-4  py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
                  onChange={(e) =>
                    setNewRole((prev) => ({
                      ...prev,
                      linkedin_link: e.target.value,
                    }))
                  }
                />
                <label
                  htmlFor='tag'
                  className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                >
                  Icon Link
                </label>
              </div>


              <div className='flex bg-[#F3F3F3] p-2 relative w-full h-12 rounded-lg shadow-sm'>
                <BsPuzzleFill color='#A5B7C0' size={26} />
                <input
                  type='number'
                  placeholder=' Minimum Order Quantity'
                  value={newRole.minimum_order_quantity}
                  className='peer bg-[#F3F3F3] focus:outline-none w-full px-4  py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
                  onChange={(e) =>
                    setNewRole((prev) => ({
                      ...prev,
                      minimum_order_quantity: e.target.value,
                    }))
                  }
                />
                <label
                  htmlFor='tag'
                  className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                >
                  Minimum Order Quantity
                </label>
              </div>
              <div className='flex bg-[#F3F3F3] p-2 relative w-full h-12 rounded-lg shadow-sm'>
                <BsPuzzleFill color='#A5B7C0' size={26} />
                <input
                  type='number'
                  placeholder=' Minimum Order Quantity'
                  value={newRole.product_low_stock_threshold}
                  className='peer bg-[#F3F3F3] focus:outline-none w-full px-4  py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
                  onChange={(e) =>
                    setNewRole((prev) => ({
                      ...prev,
                      product_low_stock_threshold: e.target.value,
                    }))
                  }
                />
                <label
                  htmlFor='tag'
                  className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                >
                  Product Low Stock Threshold
                </label>
              </div>

              <fieldset
                disabled
                className='lg:grid lg:grid-cols-2 grid-cols-1 col-span-2 lg:gap-4 gap-3 opacity-60 pointer-events-none hidden'
              >
                <div className='flex bg-[#F3F3F3] p-2 relative w-full h-12 rounded-lg shadow-sm'>
                  <Select
                    options={formattedCountries}
                    onChange={handleCountryChange}
                    value={formattedCountries.find(
                      (option) => option.value === newRole.country
                    )}
                    placeholder='Select Country'
                    className='peer bg-[#F3F3F3] focus:outline-none w-full px-4  bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out'
                  />
                  {/* <label
                                    htmlFor="tag"
                                    className="absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm">
                                  Select Country
                                </label> */}
                </div>
                <div className='flex bg-[#F3F3F3] p-2 relative w-full h-12 rounded-lg shadow-sm'>
                  <BsPuzzleFill color='#A5B7C0' size={26} />
                  <input
                    type='text'
                    //  placeholder="Country*"
                    value={newRole.country}
                    className='peer bg-[#F3F3F3] focus:outline-none w-full px-4  py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
                    disabled
                  />
                  <label
                    htmlFor='tag'
                    className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                  >
                    Country
                  </label>
                </div>
                <div className='flex bg-[#F3F3F3] p-2 relative w-full h-12 rounded-lg shadow-sm'>
                  <BsPuzzleFill color='#A5B7C0' size={26} />
                  <input
                    type='text'
                    // placeholder="Currency *"
                    value={newRole.currency}
                    className='peer bg-[#F3F3F3] focus:outline-none w-full px-4  py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
                    disabled
                  />
                  <label
                    htmlFor='tag'
                    className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                  >
                    Currency
                  </label>
                </div>
                <div className='flex bg-[#F3F3F3] p-2 relative w-full h-12 rounded-lg shadow-sm'>
                  <BsPuzzleFill color='#A5B7C0' size={26} />
                  <input
                    type='text'
                    placeholder='Currency Symbol *'
                    value={newRole.currency_symbol}
                    className='peer bg-[#F3F3F3] focus:outline-none w-full px-4  py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
                    disabled
                  />
                  <label
                    htmlFor='tag'
                    className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                  >
                    Currency Symbol
                  </label>
                </div>
              </fieldset>
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

export default CurrencyManager;
