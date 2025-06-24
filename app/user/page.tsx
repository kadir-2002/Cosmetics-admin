"use client"
import UserFormComponent from "@/Components/ClientSideComponents/UserComponents/UserformComponent";
import React from "react";
import { useSelector } from "react-redux";


const page: React.FC = () => {
  const userDetails = useSelector((state: any) => state?.user?.details?.id);

  return (
    <>
      {userDetails ? <div className="w-full lg:p-4">
        <UserFormComponent />
      </div> : null}
    </>
  );
};

export default page;
