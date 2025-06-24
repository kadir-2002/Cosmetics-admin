"use client"
import BannerFormComponent from "@/Components/ClientSideComponents/BannerComponents/BannerFormComponent";
import BlogFormComponent from "@/Components/ClientSideComponents/BlogComponents/BlogFromComponent";
import PaymentMethods from "@/Components/ClientSideComponents/PaymentMethodsComponents/PaymentMethodsFormComponent";
import React from "react";
import { useSelector } from "react-redux";


const page: React.FC = () => {
    const userDetails = useSelector((state: any) => state?.user?.details?.id);

    return (
        <>
            {userDetails ? <div className="lg:p-4">
                <PaymentMethods />
            </div> : null}
        </>
    );
};

export default page;
