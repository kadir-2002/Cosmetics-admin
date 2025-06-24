"use client"
import TaxFormComponent from "@/Components/ClientSideComponents/TaxFormComponents/TaxFormComponent";
import React from "react";
import { useSelector } from "react-redux";


const page: React.FC = () => {
    const userDetails = useSelector((state: any) => state?.user?.details?.id);

    return (
        <>{userDetails ? <div className="lg:p-4">
            <TaxFormComponent />
        </div> : null}</>

    );
};

export default page;