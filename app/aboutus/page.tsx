"use client"
import AboutUsComponent from "@/Components/ClientSideComponents/AboutUsPageComponents/AboutUsComponent";
import React from "react";
import { useSelector } from "react-redux";
const page: React.FC = () => {
    const userDetails = useSelector((state: any) => state?.user?.details?.id);
    return (
        <>{userDetails && <div className="lg:p-4">
            <AboutUsComponent />
        </div>}</>
    );
};
export default page;
