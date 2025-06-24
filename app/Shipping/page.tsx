"use client"
import ShipinfFormComponent from "@/Components/ClientSideComponents/ShipingComponents/ShipinfFormComponent";
import React from "react";
import { useSelector } from "react-redux";


const page: React.FC = () => {
    const userDetails = useSelector((state: any) => state?.user?.details?.id);

    return (
        <>
            {userDetails ? <div className="lg:p-4">
                <ShipinfFormComponent />
            </div> : null}
        </>
    );
};

export default page;
