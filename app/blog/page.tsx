"use client"
import BlogFormComponent from "@/Components/ClientSideComponents/BlogComponents/BlogFromComponent";
import BlogTagandPostMainComponent from "@/Components/ClientSideComponents/BlogComponents/BlogTagandPostMainComponent";
import React from "react";
import { useSelector } from "react-redux";


const page: React.FC = () => {
  const userDetails = useSelector((state: any) => state?.user?.details?.id);

  return (
    <>
      {userDetails ? <div className="lg:p-4">
        <BlogTagandPostMainComponent/>
      </div> : null}
    </>
  );
};

export default page;
