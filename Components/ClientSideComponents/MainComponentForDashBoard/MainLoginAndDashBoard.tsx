"use client";
import Header from "@/Components/ClientSideComponents/HeaderComponents/Header";
import LoginFormComponent from "@/Components/ClientSideComponents/LoginComponents/loginformComponent";
import Sidebar from "@/Components/ClientSideComponents/SideBarComponents/Sidebar";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function MainLoginAndDashBoard({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const userDetails = useSelector((state: any) => state?.user?.details?.id);

    return (
        <div className="flex h-screen w-full">
            {userDetails && (
                <div className="lg:w-64 w-0">
                    <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                </div>
            )}
            {userDetails && (
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} userDetails={userDetails} />
            )}
            <div className="w-full flex-1 flex flex-col">
                {userDetails ? (
                    <main className="flex-1 overflow-auto p-4 w-full mt-20">{children}</main>
                ) : (
                    <div className="flex justify-center items-center flex-1">
                        <LoginFormComponent />
                    </div>
                )}
            </div>
        </div>
    );
}
