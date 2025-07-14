import { roleUpdatedApi } from '@/apis/roleApi';
import { Switch } from '@headlessui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearUserDetails } from "@/redux/userSlice";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';

type Props = {
    isOpenDeletePopup: boolean;
    setIsLogoutDialogOpen: (isOpen: boolean) => void;
    handleDeleteConform: () => void;
    role: any;
    setIsOpen: (isOpen: boolean) => void;
    fetchRoles: any;
};

const RoleAccessComponent: React.FC<Props> = ({
    isOpenDeletePopup,
    setIsLogoutDialogOpen,
    handleDeleteConform,
    role,
    setIsOpen,
    fetchRoles,
}) => {
    const [localRole, setLocalRole] = useState(role);
    const createdBy = useSelector((state: any) => state?.user?.details?.id);
    const token = useSelector((state: any) => state?.user?.token);
    const dispatch = useDispatch();
    const router = useRouter();

    const fieldNameMapping: Record<string, string> = {
        show_banner_page: 'Banner',
        show_product_category_page: 'Categories',
        show_customer_page: 'Customers',
        show_product_page: 'Product',
        show_tax_page: 'Tax',
        show_discount_coupon_page: 'Coupons',
        show_user_page: 'User',
        show_user_role_page: 'Role',
        show_blog_page: 'Blog',
        show_order_page: 'Order',
        show_shipping_services_page: 'Shipping',
        show_payment_services_page: 'Payment Gateway',
        show_delivery_setting_page: 'Delivery Settings',
        show_product_tag_page: 'Tag',
        show_google_analytics_settings_page: "Google Analytics",
        show_header_section_page: "Header",
        show_homepage_statistics_page:  "Counter",
        show_why_choose_us_section_page: "Why Choose Us",
        show_gallery_section_page: "Gallery Type",
        show_gallery_page: "Gallery",
        show_testimonial_page: "Testimonials",
        show_about_us_page: "About Us",
        show_store_page: "Store Address",
        show_contact_us_page: "Contact Us",
        show_newsletter_page: "Newsletter",
        show_pincode_page: "Pincode",
        show_abandoned_cart_settings_page: "Abandoned Email",
    };

    const activeHandler = async (field: string, value: boolean) => {
        try {
            const updatedRole = {
                ...localRole,
                [field]: value,
            };

            const response = await roleUpdatedApi(
                localRole.id,
                localRole.name,
                localRole.description,
                updatedRole.is_active,
                updatedRole.show_user_page,
                updatedRole.show_user_role_page,
                updatedRole.show_customer_page,
                updatedRole.show_discount_coupon_page,
                updatedRole.show_delivery_setting_page,
                updatedRole.show_product_category_page,
                updatedRole.show_product_page,
                updatedRole.show_tax_page,
                updatedRole.show_order_page,
                updatedRole.show_product_tag_page,
                updatedRole.show_banner_page,
                updatedRole.show_blog_page,
                updatedRole.show_payment_services_page,
                updatedRole.show_shipping_services_page,
                updatedRole.show_google_analytics_settings_page,
                updatedRole.show_header_section_page,
                updatedRole.show_homepage_statistics_page,
                updatedRole.show_why_choose_us_section_page,
                updatedRole.show_gallery_section_page,
                updatedRole.show_gallery_page,
                updatedRole.show_testimonial_page,
                updatedRole.show_about_us_page,
                updatedRole.show_store_page,
                updatedRole.show_contact_us_page,
                updatedRole.show_newsletter_page,
                updatedRole.show_pincode_page,
                updatedRole.show_abandoned_cart_settings_page,
                createdBy,
                token
            );

            if (response?.status === 200) {
                setLocalRole(updatedRole);
                fetchRoles();
            } else if (response?.data?.message === "Invalid or expired token ") {
                dispatch(clearUserDetails());
                toast.error("Session Expired, Please Login Again")
                router.push("/");
            }
        } catch (error) {
            console.error('Error updating role access:', error);
        }
    };

    useEffect(() => {
        setLocalRole(role);
    }, [role]);

    return (
        <div
            className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50"
            role="dialog"
            aria-modal="true"
        >
            <div className="bg-white rounded-lg p-6 overflow-y-auto max-h-[90vh]">
                <h2 className="text-lg font-semibold mb-4">Role Access Management</h2>
                <div className="grid lg:grid-cols-4 grid-cols-2 gap-4">
                    {Object.keys(fieldNameMapping).map((field) => (
                        <div key={field} className="flex items-center lg:w-48 w-full gap-2 bg-gray-300 rounded-md p-2">
                            <p className="text-sm w-28">{fieldNameMapping[field]}</p>
                            <Switch
                                checked={localRole[field as keyof typeof localRole]}
                                onChange={(value) => activeHandler(field, value)}
                                className={`${localRole[field as keyof typeof localRole] ? 'bg-green-500' : 'bg-[#ff0000]'
                                    } relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-200 ease-in-out`}
                                aria-checked={localRole[field as keyof typeof localRole]}
                            >
                                <span
                                    className={`${localRole[field as keyof typeof localRole]
                                        ? 'translate-x-6'
                                        : 'translate-x-1'
                                        } inline-block w-6 h-6 bg-white rounded-full transition-transform duration-200 ease-in-out`}
                                />
                            </Switch>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end mt-6">
                    <button
                        onClick={() => setIsLogoutDialogOpen(false)}
                        className="px-4 py-2 bg-gray-300 text-black rounded-lg mr-2"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoleAccessComponent;
