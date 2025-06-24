 "use client"
 import CouponsFormComponent from "@/Components/ClientSideComponents/CouponsComponents/CouponsFormComponent";
import DiscountFormComponent from "@/Components/ClientSideComponents/CouponsComponents/DiscountFormComponent";
// import AdminForm from "@/Components/ClientSideComponents/RoleFormComponents/RoleForm";
// import React, { useState } from "react";
// import { useSelector } from "react-redux";

import { useState } from "react";
import { useSelector } from "react-redux";


// const page: React.FC = () => {
//     const userDetails = useSelector((state: any) => state?.user?.details?.id);
//   const [openTab,setOpenTab]= useState<boolean>(false)
//     return (
//         <> {userDetails && <div className="lg:p-4">
//             <div className="flex">
//                 <p>Couponse</p>
//                 <p>Discount</p>
//             </div>
//             <CouponsFormComponent />
//             <DiscountFormComponent />
//         </div>}</>

//     );
// };

// export default page;



const page = ({  }) => {
    const userDetails = useSelector((state: any) => state?.user?.details?.id);
  const [openTab, setOpenTab] = useState<"coupons" | "discount">("coupons");

  return (
    <>
      {userDetails && (
        <div className="lg:p-4">
          {/* Tabs */}
          <div className="flex space-x-4 mb-4">
            <button
              className={`px-6 py-2 rounded ${
                openTab === "coupons" ? "bg-admin-buttonprimary text-white" : "bg-gray-200"
              }`}
              onClick={() => setOpenTab("coupons")}
            >
              Coupons
            </button>
            <button
              className={`px-6 py-2 rounded ${
                openTab === "discount" ? "bg-admin-buttonprimary text-white" : "bg-gray-200"
              }`}
              onClick={() => setOpenTab("discount")}
            >
              Discount
            </button>
          </div>

         
          {openTab === "coupons" && <CouponsFormComponent />}
          {openTab === "discount" && <DiscountFormComponent />}
        </div>
      )}
    </>
  );
};

export default page;

