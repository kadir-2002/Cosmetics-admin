"use client"
import MainDashboardComponent from "@/Components/ClientSideComponents/DashboardComponents/DashboardMainComponent";
import { useSelector } from "react-redux";

export default function Home() {
  const userDetails = useSelector((state: any) => state?.user?.details?.id);

  return (
    <>{userDetails ? <div className="flex flex-col justify-start items-center">
      {/* <MainDashboardComponent /> */}
    </div> : null}
    </>

  );
}
