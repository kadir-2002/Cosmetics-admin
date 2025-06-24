"use client"
import DistanceAvoideComponent from "@/Components/ClientSideComponents/DistanceAvoideComponents/DistanceAvoideFormComponent";
import React from "react";
import { useSelector } from "react-redux";
const page: React.FC = () => {
    const userDetails = useSelector((state: any) => state?.user?.details?.id);

    return (
        <>
            {userDetails && <div className="lg:p-4">
                <DistanceAvoideComponent />
            </div >}
        </>
    );
};

export default page;
