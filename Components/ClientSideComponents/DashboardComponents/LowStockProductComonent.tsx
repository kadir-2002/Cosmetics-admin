import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation"


type props = {
    commisionData: any
}

const LowStockProductComonent = ({ commisionData }: props) => {
    const currency = useSelector((state: any) => state?.user?.details?.currency_symbol);
    const router = useRouter();
    return (
        <div className="bg-white shadow-md rounded-lg  h-[426px] w-full overflow-y-auto">
            <table className="w-full min-w-[640px] border-collapse divide-y divide-gray-200 ">
                <thead>
                    <tr className="text-[#577C8E] text-[18px]">
                        <th className="py-2 px-4 text-left">Products</th>
                        <th className="py-2 px-4 text-center w-[130px]">Price</th>
                        <th className="py-2 px-4 text-center">Total Quantity</th>
                        {/* <th className="py-2 text-center">Stock</th> */}
                    </tr>
                </thead>
                <tbody>
                    {commisionData?.low_stock_products?.map((product: any, index: any) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors text-[18px] w-full"
                            onClick={() => router.push(`/product?id=${product?.id}`)}>
                            <td className="py-3 px-4 flex items-center space-x-3">
                                {product.image ? <img
                                    src={`${product.image}`}
                                    alt="img"
                                    className="w-12 h-12 bg-[#F5F5F5] rounded-md p-1 object-cover"
                                /> :
                                    <img
                                        src='/product .png'
                                        alt="Profile"
                                        className="w-12 h-12 bg-[#F5F5F5] rounded-md p-1 object-cover"
                                    />
                                }
                                <div className="p-3">
                                    <p className="font-medium text-gray-800">{product?.name}</p>
                                    <p className="text-gray-500 text-xs">Category: {product?.category}</p>
                                </div>
                            </td>

                            <td className="py-3 px-4 text-center w-[180px]">{currency}{product?.sellingPrice}</td>
                            <td className="py-3 px-4 text-center">{product?.stock}</td>
                            {/* <td className="py-3 text-center text-green-500 font-semibold">
                                {product?.stock}
                            </td> */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LowStockProductComonent;
