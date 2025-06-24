"use client"
import CategryFormComponent from "@/Components/ClientSideComponents/CategoriesComponents/CategryFormComponent";
import React from "react";
import { useSelector } from "react-redux";
const page: React.FC = () => {
    const userDetails = useSelector((state: any) => state?.user?.details?.id);
    return (
        <>{userDetails && <div className="lg:p-4">
            <CategryFormComponent />
        </div>}</>
    );
};

export default page;
