"use client"
import CustomerFormComponent from "@/Components/ClientSideComponents/CustomerComponents/CustomerFormComponent";
import React from "react";
import { useSelector } from "react-redux";


const page: React.FC = () => {
  const userDetails = useSelector((state: any) => state?.user?.details?.id);

  return (
    <>
      {userDetails && < div className="lg:p-4" >
        <CustomerFormComponent />
      </div >}
    </>
  );
};

export default page;
