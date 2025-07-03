"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { FaArrowLeft, FaSearchLocation } from "react-icons/fa";
import SidebarItem from "./SidebarItem";
import ClickOutside from "./ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import { MdDashboardCustomize, MdOutlineProductionQuantityLimits, MdOutlineRateReview, MdOutlineUnsubscribe } from "react-icons/md";
import { TbCategoryPlus, TbLayoutNavbarCollapseFilled, TbListDetails } from "react-icons/tb";
import { FaBagShopping, FaOpencart, FaRegImage, FaUsers, FaUsersBetweenLines } from "react-icons/fa6";
import { LuGalleryVerticalEnd } from "react-icons/lu";
import { IoIosContact } from "react-icons/io";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const menuGroups = [
  {
    name: "MENU",
    menuItems: [
      { icon: <MdDashboardCustomize className="h-6 w-6"  />, label: "Dashboard", route: "/" },
      { icon: <TbLayoutNavbarCollapseFilled className="h-6 w-6"  />, label: "Header", route: "/header" },
      { icon: <FaRegImage className="h-6 w-6"  />, label: "Banner", route: "/banner" },
      { icon: <FaUsersBetweenLines className="h-6 w-6 bg"  />, label: "Why Choose Us", route: "/whychooseus" },
      { icon: <LuGalleryVerticalEnd className="h-6 w-6"  />, label: "Gallery", route: "/gallery" },
      {
        icon: <LuGalleryVerticalEnd className="h-6 w-6"  />,
        label: "Gallery Type",
        route: "/gallery-section",
      },
      {
        icon: <MdOutlineRateReview className="h-6 w-6"  />,
        label: "Testimonials",
        route: "/testimonials",
      },

      // { icon: "/blog.png", label: "Counter", route: "/countersection" },
      { icon: <TbCategoryPlus className="h-6 w-6"  />, label: "Categories", route: "/categories" },
      { icon: <FaUsers className="h-6 w-6"  />, label: "Customers", route: "/customers" },
      { icon: <FaBagShopping  className="h-6 w-6"  />, label: "Product", route: "/product" },
      { icon: <FaSearchLocation className="h-6 w-6"  />, label: "Pincode", route: "/pincode" },
      // { icon: "/tax.png", label: "Tax", route: "/tax" },
      // { icon: "/Coupon.png", label: "Coupons", route: "/coupons" },
      { icon: <FaUsers className="h-6 w-6"  />, label: "User", route: "/user" },
      // { icon: "/role.png", label: "Role", route: "/role" },
      // { icon: "/blog.png", label: "Blog", route: "/blog" },
      { icon: <FaOpencart className="h-6 w-6"  />, label: "Order", route: "/order" },
      // { icon: "/shipping.png", label: "Shipping", route: "/Shipping" },
      // {
      //   icon: "/payment.png",
      //   label: "Payment Gateway",
      //   route: "/payment-gateway",
      // },
      // {
      //   icon: "/distance.png",
      //   label: "Delivery Settings",
      //   route: "/distance-avoid",
      // },
      // { icon: "/tag.png", label: "Tag", route: "/tag" },
      {
        icon: <TbListDetails className="h-6 w-6" />,
        label: "Company Details",
        route: "/companydetails",
      },
      // { icon: "/blog.png", label: "Abandoned Email", route: "/abandonedemail" },
      // { icon: "/store.png", label: "Store Address", route: "/storeaddress" },
      { icon: <IoIosContact className="h-6 w-6"  />, label: "Contact Us", route: "/contactus" },
      { icon: <MdOutlineUnsubscribe className="h-6 w-6"  />, label: "Newsletter", route: "/newsletter" },
      // {
      //   icon: "/payment.png",
      //   label: "Google Analytics",
      //   route: "/googleanalytics",
      // },
      // {
      //   icon: "/newslatter.png",
      //   label: "About Us",
      //   route: "/aboutus",
      // },
    ],
  },
];

const permissionToMenuLabelMap: { [key: string]: string } = {
  show_user_page: "User",
  show_user_role_page: "Role",
  show_customer_page: "Customers",
  show_discount_coupon_page: "Coupons",
  show_delivery_setting_page: "Delivery Settings",
  show_tax_page: "Tax",
  show_product_category_page: "Categories",
  show_product_page: "Product",
  show_product_tag_page: "Tag",
  show_order_page: "Order",
  show_banner_page: "Banner",
  show_blog_page: "Blog",
  show_payment_services_page: "Payment Gateway",
  show_shipping_services_page: "Shipping",
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

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

  const userPermissions = useSelector((state: any) => state?.user?.details);
  // const filteredMenuItems = menuGroups[0].menuItems.filter((item) => {
  //   const permissionKey = Object.keys(permissionToMenuLabelMap).find(
  //     (key) => permissionToMenuLabelMap[key] === item.label
  //   );
  //   return permissionKey ? userPermissions[permissionKey] : true;
  // });

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed flex z-30 mt-12 left-0 top-1 overflow-y-auto hidescroll h-screen flex-col bg-admin-primary text-white duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full "
        }`}
      >
        <div className='flex items-center mt-5 justify-between gap-2 px-6 py-5.5 lg:py-6.5'>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls='sidebar'
            className='lg:hidden p-2 flex justify-end items-end w-full'
          >
            <FaArrowLeft size={23} />
          </button>
        </div>
        <div className='flex flex-col duration-300 ease-linear'>
          <nav className='px-4 pr-0 lg:p-6'>
            <h3 className='mb-2 ml-4 text-xl font-semibold'>MENU</h3>
            <ul className='mb-24 flex flex-col gap-1.5 overflow-y-auto hidescroll'>
              {menuGroups[0].menuItems.map((menuItem, menuIndex) => (
                <SidebarItem
                  key={menuIndex}
                  item={menuItem}
                  pageName={pageName}
                  setSidebarOpen={setSidebarOpen}
                  setPageName={setPageName}
                />
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
