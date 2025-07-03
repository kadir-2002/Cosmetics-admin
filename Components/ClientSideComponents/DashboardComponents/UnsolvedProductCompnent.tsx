import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";


type props = {
    commisionData: any
}

const UnsolvedProductCompnent = ({ commisionData }: props) => {
    const currency = useSelector((state: any) => state?.user?.details?.currency_symbol);
    const router = useRouter();

    return (
        <div className="bg-white shadow-md rounded-lg  h-[426px] w-full overflow-y-auto">
            <table className="w-full min-w-[640px] border-collapse divide-y divide-gray-200 ">
                <thead>
                    <tr className="text-[#577C8E] text-[18px]">
                        <th className="py-3 px-4 text-left  text-lg sm:text-lg">
                            Products</th>
                        <th className="py-3 px-4 text-center text-lg sm:text-lg">
                            Price

                        </th>
                        <th className="py-3 px-4 text-center text-lg sm:text-lg">
                            Total Stock</th>
                        {/* <th className="py-2 text-center">Category</th> */}
                        {/* <th className="py-2 text-center">Total Profite</th> */}
                    </tr>
                </thead>
                <tbody>
                    {commisionData?.unsold_products?.map((product: any, index: any) => (
                        <tr key={index} className="hover:bg-purple-100 transition-colors text-[18px]"
                            onClick={() => router.push(`/product?id=${product?.id}`)}
                        >

                            <td className="py-2 flex gap-3 sm:py-3 px-4">
                                {product.image ? <img
                                    src={`${process.env.NEXT_PUBLIC_BASE_URL}${product.image}`}
                                    alt="img"
                                    className="w-12 h-12 bg-[#F5F5F5] rounded-md p-1 object-cover"
                                /> :
                                    <img
                                        src='/product .png'
                                        alt="Profile"
                                        className="w-12 h-12 bg-[#F5F5F5] rounded-md p-1 object-cover"
                                    />
                                }
                                <div>
                                    <p className="font-medium text-gray-800">{product?.name}</p>
                                    <p className="text-gray-500 text-xs">Category: {product?.category}</p>
                                </div>
                            </td>
                            <td className="py-3 text-center">{currency}{product?.selling_price}</td>
                            <td className="py-3 text-center">{product?.stock}</td>
                            {/* <td className="py-3 text-center text-green-500 font-semibold">
                                {product?.category}
                            </td> */}
                            {/* <td className="py-3 text-center text-green-500 font-semibold">
                                {product?.revenue_generated}
                            </td> */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UnsolvedProductCompnent;
