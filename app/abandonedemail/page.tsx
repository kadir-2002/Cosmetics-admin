"use client"
import AbandonedFormComponent from "@/Components/ClientSideComponents/AbandonedEmailFormComponents/AbandonedFormComponent";
import HeaderFormComponent from "@/Components/ClientSideComponents/HeaderFormComponents/HeaderFormComponent";
import React from "react";
import { useSelector } from "react-redux";


const page: React.FC = () => {
  const userDetails = useSelector((state: any) => state?.user?.details?.id);

  return (
    <>
      {userDetails ? <div className="lg:p-4">
        <AbandonedFormComponent/>
      </div> : null}
    </>
  );
};
  
export default page;
