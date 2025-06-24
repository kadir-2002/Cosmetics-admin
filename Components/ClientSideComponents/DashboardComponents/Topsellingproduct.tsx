import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";


type props = {
    commisionData: any
}

const TopSellingProducts = ({ commisionData }: props) => {
    const currency = useSelector((state: any) => state?.user?.details?.currency_symbol);
     const router = useRouter();

    return (
        <div className="w-full overflow-x-auto h-[426px]">
            <table className="w-full min-w-[640px] text-sm">
                <thead className="border-b border-gray-200">
                    <tr className="text-[#577C8E]">
                        <th className="py-3 px-4 text-left  text-lg sm:text-lg">
                            Products
                        </th>
                        <th className="py-3 px-4 text-center text-lg sm:text-lg">
                            Price
                        </th>
                        <th className="py-3 px-4 text-center text-lg sm:text-lg whitespace-nowrap">
                            Total Qty Sold
                        </th>
                        <th className="py-3 px-4 text-center text-lg sm:text-lg">
                            Total Profit
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {commisionData?.top_selling_products?.map((product: any, index: number) => (
                        <tr
                            key={index}
                            className="hover:bg-gray-50 transition-colors"
                            onClick={() => router.push(`/product?id=${product?.id}`)}
                        >
                            <td className="py-2 sm:py-3 px-4">
                                <Link
                                    href={`/product?id=${product?.id}`}
                                    className="flex items-start sm:items-center gap-2 sm:gap-3 group"
                                >
                                    <div className="flex-shrink-0">
                                        <img
                                            src={product.image
                                                ? `${process.env.NEXT_PUBLIC_BASE_URL}${product.image}`
                                                : '/product.png'
                                            }
                                            alt={product.name || 'Product'}
                                            className="w-10 h-10 sm:w-12 sm:h-12 bg-[#F5F5F5] rounded-md p-1 object-cover"
                                        />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-lg sm:text-base text-gray-900 truncate group-hover:text-blue-600">
                                            {product?.name}
                                        </p>
                                        <p className="text-xs sm:text-base text-gray-500 truncate">
                                            Category: {product?.category}
                                        </p>
                                    </div>
                                </Link>
                            </td>

                            <td className="py-2 sm:py-3 px-4 text-center">
                                <span className="text-base sm:text-lg whitespace-nowrap">
                                    {currency}{product?.unit_price}
                                </span>
                            </td>

                            <td className="py-2 sm:py-3 px-4 text-center">
                                <span className="text-base sm:text-lg">
                                    {product?.total_quantity_sold}
                                </span>
                            </td>

                            <td className="py-2 sm:py-3 px-4 text-center">
                                <span className="text-base sm:text-lg text-[#34A864] whitespace-nowrap">
                                    {currency} {product?.revenue_generated}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TopSellingProducts;
