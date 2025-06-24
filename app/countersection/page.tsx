"use client"
import CounterComponent from "@/Components/ClientSideComponents/CounterComponents/CounterComponent";
import React from "react";
import { useSelector } from "react-redux";


const page: React.FC = () => {
    const userDetails = useSelector((state: any) => state?.user?.details?.id);
    return (
        <>
            {userDetails && <div className="lg:p-4">
                <CounterComponent />
            </div>}
        </>
    );
};

export default page;
