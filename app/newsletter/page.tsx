"use client"
import NewslattergetComponent from "@/Components/ClientSideComponents/NewsLatterComponents/NewslattergetComponent";
import React from "react";
import { useSelector } from "react-redux";

const page: React.FC = () => {
  const userDetails = useSelector((state: any) => state?.user?.details?.id);

  return (
    <>
      {userDetails ? <div className="lg:p-4">
        <NewslattergetComponent/>
      </div> : null}
    </>
  );
};

export default page;
