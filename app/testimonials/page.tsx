"use client"
import TestimonialFormComponent from "@/Components/ClientSideComponents/TestimonialsComponents/TestimonialFormComponent";
import React from "react";
import { useSelector } from "react-redux";
const page: React.FC = () => {
    const userDetails = useSelector((state: any) => state?.user?.details?.id);
    return (
        <>{userDetails && <div className="lg:p-4">
            <TestimonialFormComponent />
        </div>}</>
    );
};

export default page;
