"use client"
import WhyChooseUsFormComponent from "@/Components/ClientSideComponents/WhyChooseUsComponents/WhyChooseUsFormComponent";
import React from "react";
import { useSelector } from "react-redux";


const page: React.FC = () => {
  const userDetails = useSelector((state: any) => state?.user?.details?.id);

  return (
    <>
      {userDetails ? <div className="lg:p-4">
        <WhyChooseUsFormComponent/>
      </div> : null}
    </>
  );
};

export default page;
