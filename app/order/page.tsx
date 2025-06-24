"use client"
import OrderAllDataComponent from "@/Components/ClientSideComponents/OrderComponents/OrderAllDataComponent";
import AdminForm from "@/Components/ClientSideComponents/RoleFormComponents/RoleForm";
import React from "react";
import { useSelector } from "react-redux";


const page: React.FC = () => {
    const userDetails = useSelector((state: any) => state?.user?.details?.id);

    return (
        <>{userDetails && <div className="lg:p-4">
            <OrderAllDataComponent />
        </div>}</>
    );
};

export default page;