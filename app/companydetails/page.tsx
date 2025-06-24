"use client"
import CurrencyFormConponent from "@/Components/ClientSideComponents/CurrencyComponents.tsx/CurrencyFormConponent";
import React from "react";
import { useSelector } from "react-redux";


const page: React.FC = () => {
  const userDetails = useSelector((state: any) => state?.user?.details?.id);

  return (
    <>
      {userDetails ? < div className=" lg:p-4">
        <CurrencyFormConponent />
      </div > : null}
    </>
  );
};

export default page;
