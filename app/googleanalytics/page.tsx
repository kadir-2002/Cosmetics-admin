"use client"
import GoogleAnalyticsComponent from "@/Components/ClientSideComponents/GoogleAnalyticsComponents/GoogleAnalyticsComponent";
import React from "react";
import { useSelector } from "react-redux";


const page: React.FC = () => {
  const userDetails = useSelector((state: any) => state?.user?.details?.id);

  return (
    <>
      {userDetails ? < div className="lg:p-4">
        <GoogleAnalyticsComponent />
      </div > : null}
    </>
  );
};

export default page;
