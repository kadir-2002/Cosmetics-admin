"use client"
import GalleryFormComponent from "@/Components/ClientSideComponents/GalleryComponents/GalleryFormComponent";
import React from "react";
import { useSelector } from "react-redux";


const page: React.FC = () => {
  const userDetails = useSelector((state: any) => state?.user?.details?.id);

  return (
    <>
      {userDetails ? <div className="lg:p-4">
        <GalleryFormComponent/>
      </div> : null}
    </>
  );
};
  
export default page;
