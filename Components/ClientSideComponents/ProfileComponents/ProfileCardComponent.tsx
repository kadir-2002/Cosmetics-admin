"use client";
import { profileUpdatedApi } from "@/apis/profileformApi";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaCircleUser } from "react-icons/fa6";
import { useSelector } from "react-redux";


const ProfileCard = () => {
    const [isEditing, setIsEditing] = useState(false);
    const createdBy = useSelector((state: any) => state?.user?.details)
    const id = useSelector((state: any) => state?.user?.details?.id);
        const token = useSelector((state: any) => state?.user?.token);

    const [profile, setProfile] = useState({
        firstName: createdBy?.first_name,
        lastName: createdBy?.last_name,
        email: createdBy?.email,
        phone: createdBy?.phone_number,
        category: createdBy?.category,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };
 console.log("createdBy",createdBy)
    const handleSave = async () => {
        try {
            const response = await profileUpdatedApi(
                id,
                profile.firstName,
                profile.lastName,
                profile.phone,
                profile.email,
                "+91",
                "",
                true, 
               "",
                token
            );

            if (response?.status === 200) {
                setIsEditing(false);
                toast.success("Profile Edit SucessFully")
            } else {
                alert("Failed to update profile. Please try again.");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.success("An error occurred while updating the profile.");
        }
    };

    return (
        <>
            {createdBy ? (
                <div className="relative flex justify-center items-center mx-auto w-full">
                    <div className="flex flex-col justify-center w-full items-center">
                        <div
                            className="absolute top-0 left-0 w-full h-44 bg-[url('/Wave21.png')] bg-cover bg-center">
                        </div>
                        <div className="w-full flex flex-col justify-center mt-12 items-center">
                            {createdBy?.profile_picture ? (
                                <div className="relative flex justify-center bg-slate-200 p-2 rounded-full">
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_BASE_URL}${createdBy?.profile_picture}`}
                                        alt="Profile"
                                        className="lg:h-36 lg:w-36 h-28 w-28 rounded-full border-4 border-white shadow-md"
                                    />
                                </div>
                            ) : (
                                <div className="relative flex justify-center lg:h-36 lg:w-36 h-28 w-28 bg-slate-200 p-2 mt-6 rounded-full">
                                    <FaCircleUser className="w-full h-full" />
                                </div>
                            )}
                            <div className="max-w-7xl w-full bg-white -mt-6 p-12 rounded-lg shadow-xl">
                                <div className="flex justify-center items-center text-center mt-8 gap-2">
                                    <h2 className="lg:text-4xl text-xl font-semibold text-gray-800">
                                        {profile.firstName} {profile.lastName}
                                    </h2>
                                    <p className="font-semibold text-md">( {profile.category} )</p>
                                </div>
                                <div className="max-w-6xl justify-center w-full items-center">
                                    <form className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="py-2">
                                            <label className="block text-md font-medium">First Name</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={profile.firstName}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className={`mt-1 w-full rounded-lg h-12 px-4 border-[1px] py-2 text-lg ${isEditing ? "border-gray-300 bg-white" : "border-gray-200 bg-gray-100"
                                                    } focus:outline-none`}
                                            />
                                        </div>
                                        <div className="py-2">
                                            <label className="block text-md font-medium">Last Name</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={profile.lastName}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className={`mt-1 w-full rounded-lg h-12 px-4 py-2 text-lg ${isEditing ? "border-gray-300 bg-white" : "border-gray-200 bg-gray-100"
                                                    } focus:outline-none border-[1px]`}
                                            />
                                        </div>
                                        <div className="py-2">
                                            <label className="block text-md font-medium">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={profile.email}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className={`mt-1 w-full rounded-lg h-12 px-4 py-2 text-lg ${isEditing ? "border-gray-300 bg-white" : "border-gray-200 bg-gray-100"
                                                    } focus:outline-none border-[1px]`}
                                            />
                                        </div>
                                        <div className="py-2">
                                            <label className="block text-md font-medium">Phone</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={profile.phone}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className={`mt-1 w-full rounded-lg h-12 px-4 py-2 text-lg ${isEditing ? "border-gray-300 bg-white" : "border-gray-200 bg-gray-100"
                                                    } focus:outline-none border-[1px]`}
                                            />
                                        </div>
                                    </form>
                                    {/* <div className="flex justify-center mt-8 gap-4">
                                        {isEditing ? (
                                            <>
                                                <button
                                                    type="button"
                                                    className="bg-[#587D8E] text-white font-bold py-3 px-6 w-[200px] rounded-lg h-12"
                                                    onClick={handleSave}
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    type="button"
                                                    className="w-[200px] bg-[#E5F1F6] border-[1px] font-bold py-2 px-6 rounded-lg"
                                                    onClick={() => setIsEditing(false)}
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                type="button"
                                                className="bg-[#587D8E] text-white py-3 px-6 w-[200px] font-bold rounded-lg"
                                                onClick={() => setIsEditing(true)}
                                            >
                                                Edit Profile
                                            </button>
                                        )}
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default ProfileCard;
