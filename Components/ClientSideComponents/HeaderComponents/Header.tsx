"use Client"
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { CiSearch } from 'react-icons/ci';
import LoginProfilButton from './LoginProfilButton';
import Link from 'next/link';
import { IoCloseOutline, IoMenuOutline } from 'react-icons/io5';
import { FaCircleUser } from 'react-icons/fa6';

type props = {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
  userDetails:any
}
const Header = ({ sidebarOpen, setSidebarOpen ,userDetails}: props) => {
  const [currentDateTime, setCurrentDateTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [currentDay, setCurrentDay] = useState<string>("");


  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString();
      const date = now.toLocaleDateString();
      const day = now.toLocaleDateString(undefined, { weekday: "long" });
      setCurrentDateTime(time);
      setCurrentDate(date);
      setCurrentDay(day);
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed h-[76px] z-50  w-full bg-admin-primary text-white font-semibold px-4 py-2  gap-7 lg:gap-0 flex justify-between items-center" >

      <button
        aria-controls="sidebar"
        aria-expanded={sidebarOpen}
        onClick={() => setSidebarOpen(!sidebarOpen)} // Toggle sidebar state
        className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
      >
        {sidebarOpen ? (
          <IoCloseOutline size={30} color="black" /> 
        ) : (
          <IoMenuOutline size={30} color="black" /> 
        )}
      </button>
      <div className="flex items-center justify-between  lg:w-[70%]">
        <Link href="/">
        <div className="flex h-28 w-[130px] lg:w-[170px] relative bg-transparent">
            <Image
              width={100}
              height={20}
              src="/SuperbBlackWhiteLogo.png"
              alt="Logo"
              priority
              className="h-full w-full  absolute object-contain"
            />
          </div>
        </Link>
        {/* <div className="relative w-[80%]">
          <span className="absolute flex justify-center items-center h-12 w-12 bg-[#7C57CE] rounded-l-xl">
            <CiSearch size={30} color="#FFFFFF" />
          </span>
          <input
            type="text"
            className="pl-16 h-12 rounded-xl w-full border-[1px]  focus:outline-none"
            placeholder="Search here..."
          />
        </div> */}
      </div>
      <div className="flex items-center space-x-4 lg:w-[30%] ">
        <div className='px-5'>
          <LoginProfilButton currentDateTime={currentDateTime} />
        </div>
        <div className="border-l-[2px] border-black px-4 hidden sm:block">
          <p>{currentDay}</p>
          <p>{currentDate}</p>
        </div>
        <div className="border-l-[2px] border-black px-4 hidden sm:block">
          <div className="">
            {/* <Image
              width={100}
              height={60}
              src="/settingicon.png"
              alt="Logo"
              priority
              className='h-full w-full'
            /> */}
             {/* <FaCircleUser size={26} /> */}
             {userDetails?.currency_symbol}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
