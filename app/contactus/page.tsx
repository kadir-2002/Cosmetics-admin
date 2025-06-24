
"use client"
import ContactFormComponent from "@/Components/ClientSideComponents/ContactFormComponents/ContactFormComponent";
import React from "react";
import { useSelector } from "react-redux";

const page: React.FC = () => {
  const userDetails = useSelector((state: any) => state?.user?.details?.id);

  return (
    <>
      {userDetails ? <div className="lg:p-4">
        <ContactFormComponent/>
      </div> : null}
    </>
  );
};

export default page;
