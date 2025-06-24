"use client"
import GallerytypeComponent from "@/Components/ClientSideComponents/GalleryComponents/GallerytypeComponent";
import TagFormComonent from "@/Components/ClientSideComponents/TagComponents/TagFormComonent";
import React from "react";
import { useSelector } from "react-redux";


const page: React.FC = () => {
    const userDetails = useSelector((state: any) => state?.user?.details?.id);
    return (
        <>
            {userDetails && <div className="lg:p-4">
                <GallerytypeComponent />
            </div>}
        </>
    );
};

export default page;
