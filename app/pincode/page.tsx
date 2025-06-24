"use client"
import PinCodeFormComponent from "@/Components/ClientSideComponents/PinCodeComponents/PinCodeFormComponent";
import React from "react";
import { useSelector } from "react-redux";


const page: React.FC = () => {
  const userDetails = useSelector((state: any) => state?.user?.details?.id);

  return (
    <>
      {userDetails && < div className="lg:p-4" >
        <PinCodeFormComponent />
      </div >}
    </>
  );
};

export default page;
