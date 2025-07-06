"use client";
import Link from "next/link";
import React, { useState } from "react";

type Props = {
  commisionData: any;
};

const UserComponent = ({ commisionData }: Props) => {
  const userSummary = commisionData?.user_summary;
  // const [isActiveTab, setIsActiveTab] = useState(true);

  // const handleNavigation = () => {
  //   //   navigate("/user");
  // };
  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full h-[426px]">
      <div className="space-y-6 text-md ">
        <Link className="flex justify-between pb-2" href="/user">
          <div className="font-semibold text-lg text-[#577C8E]">Total Users:</div>
          <div  className="font-semibold text-xl text-[#577C8E]">{userSummary?.total_staff_users}</div>
        </Link>
        <Link className="flex justify-between pb-2" href="/user?is_active=true">
          <div className="font-semibold text-lg text-[#5AB9E6]">Active Users:</div>
          <div className="font-semibold text-xl text-[#5AB9E6]" >{userSummary?.active_staff_users}</div>
        </Link>
        <Link className="flex justify-between pb-2" href="/user?is_active=false">
          <span className="font-semibold text-lg text-[#E1C01F]">Inactive Users:</span>
          <span>{userSummary?.inactive_staff_users}</span>
        </Link>
        <Link className="flex justify-between  pb-2" href="/customers">
          <span className="font-semibold text-lg text-[#577C8E]">Total Customers:</span>
          <span className="font-semibold text-xl text-[#577C8E]">{userSummary?.total_customers}</span>
        </Link>
        <Link className="flex justify-between pb-2" href="/customers?is_active=true">
          <span className="font-semibold text-lg text-[#5AB9E6]">Active Customers:</span>
          <span className="font-semibold text-xl text-[#5AB9E6]">{userSummary?.active_customers}</span>
        </Link>
        <Link className="flex justify-between pb-2" href="/customers?is_active=false">
          <span className="font-semibold text-lg text-[#E1C01F]">Inactive Customers:</span>
          <span className="font-semibold text-xl text-[#E1C01F]">{0}</span>
        </Link>
      </div>
    </div >
  );
};

export default UserComponent;
