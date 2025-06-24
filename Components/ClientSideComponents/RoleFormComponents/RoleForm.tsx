"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  createRoleApi,
  roleAllDataApi,
  roleDeleteApi,
  roleUpdatedApi,
} from "@/apis/roleApi";
import toast from "react-hot-toast";
import { MdArrowDropUp, MdDelete } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import RoleDeletePopUpComponent from "./RoleDeleteComponent";
import RoleInfoPopup from "./RoleInfoPopup";
import { useDispatch, useSelector } from "react-redux";
import { GoSearch } from "react-icons/go";
import { AiOutlineClose } from "react-icons/ai";
import { BsPuzzleFill } from "react-icons/bs";
import { Switch } from "@headlessui/react";
import { PiKeyholeFill } from "react-icons/pi";
import RoleAcessComponent from "./RoleAcessComponent";
import { clearUserDetails } from "@/redux/userSlice";
import { useRouter } from "next/navigation";
import { FaAngleDown } from "react-icons/fa6";
import ActiveInactiveFilterPopup from "./ActiveInactiveFilterPopup";
import { IoMdArrowDropdown } from "react-icons/io";
import { FiPlus, FiMinus } from "react-icons/fi";
interface Role {
  id: string;
  name: string;
  isActive: boolean;
}

const AdminForm = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [newRole, setNewRole] = useState({
    roleName: "",
    description: "",
    isActive: false,
    show_user_page: false,
    show_user_role_page: false,
    show_customer_page: false,
    show_discount_coupon_page: false,
    show_delivery_setting_page: false,
    show_product_category_page: false,
    show_product_page: false,
    show_product_tag_page: false,
    show_order_page: false,
    show_tax_page: false,
    show_banner_page: false,
    show_blog_page: false,
    show_payment_services_page: false,
    show_shipping_services_page: false,
    show_google_analytics_settings_page: false,
    show_header_section_page: false,
    show_homepage_statistics_page: false,
    show_why_choose_us_section_page: false,
    show_gallery_section_page: false,
    show_gallery_page: false,
    show_testimonial_page: false,
    show_about_us_page: false,
    show_store_page: false,
    show_contact_us_page: false,
    show_newsletter_page: false,
    show_pincode_page: false,
    show_abandoned_cart_settings_page: false,
  });
  const [isEdit, setIsEdit] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [isOpenDeletePopup, setIsLogoutPopup] = useState<boolean>(false);
  const [isOpenInfoPopup, setIsInfoPopup] = useState<boolean>(false);
  const createdBy = useSelector((state: any) => state?.user?.details?.id);
  const [searchText, setSearchText] = useState<string>("");
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [info, setinfo] = useState("");
  const [isOpenAcesspopup, setOpenAcesspopup] = useState<boolean>(false);
  const [isActiveInactiveFitlerPopup, setIsActiveInactiveFilterPopup] =
    useState<boolean>(false);
  const [isAcessData, setAcessData] = useState<any>("");
  const [ordering, setOrdering] = useState("");
  const [isfiltervalue, setfiltervalue] = useState<string>("");
  const token = useSelector((state: any) => state?.user?.token);
  const dispatch = useDispatch();
  const router = useRouter();
  const roleFormRef = useRef<HTMLFormElement>(null);

  const handleCreateOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {
      roleName,
      description,
      isActive,
      show_user_page,
      show_user_role_page,
      show_customer_page,
      show_discount_coupon_page,
      show_delivery_setting_page,
      show_product_category_page,
      show_product_page,
      show_tax_page,
      show_product_tag_page,
      show_order_page,
      show_banner_page,
      show_blog_page,
      show_payment_services_page,
      show_shipping_services_page,
      show_google_analytics_settings_page,
      show_header_section_page,
      show_homepage_statistics_page,
      show_why_choose_us_section_page,
      show_gallery_section_page,
      show_gallery_page,
      show_testimonial_page,
      show_about_us_page,
      show_store_page,
      show_contact_us_page,
      show_newsletter_page,
      show_pincode_page,
      show_abandoned_cart_settings_page,
    } = newRole;
    if (!roleName.trim()) {
      return;
    }
    try {
      if (isEdit) {
        const response = await roleUpdatedApi(
          selectedRoleId,
          roleName,
          description,
          isActive,
          show_user_page,
          show_user_role_page,
          show_customer_page,
          show_discount_coupon_page,
          show_delivery_setting_page,
          show_product_category_page,
          show_product_page,
          show_tax_page,
          show_order_page,
          show_product_tag_page,
          show_banner_page,
          show_blog_page,
          show_payment_services_page,
          show_shipping_services_page,
          show_google_analytics_settings_page,
          show_header_section_page,
          show_homepage_statistics_page,
          show_why_choose_us_section_page,
          show_gallery_section_page,
          show_gallery_page,
          show_testimonial_page,
          show_about_us_page,
          show_store_page,
          show_contact_us_page,
          show_newsletter_page,
          show_pincode_page,
          show_abandoned_cart_settings_page,
          createdBy,
          token
        );
        if (response?.status === 200) {
          toast.success("Role updated successfully");
          setIsEdit(false);
          setOpenForm(false);
          fetchRoles();
          setNewRole({
            roleName: "",
            description: "",
            isActive: false,
            show_user_page: false,
            show_user_role_page: false,
            show_customer_page: false,
            show_discount_coupon_page: false,
            show_delivery_setting_page: false,
            show_product_category_page: false,
            show_product_page: false,
            show_product_tag_page: false,
            show_order_page: false,
            show_tax_page: false,
            show_banner_page: false,
            show_blog_page: false,
            show_payment_services_page: false,
            show_shipping_services_page: false,
            show_google_analytics_settings_page: false,
            show_header_section_page: false,
            show_homepage_statistics_page: false,
            show_why_choose_us_section_page: false,
            show_gallery_section_page: false,
            show_gallery_page: false,
            show_testimonial_page: false,
            show_about_us_page: false,
            show_store_page: false,
            show_contact_us_page: false,
            show_newsletter_page: false,
            show_pincode_page: false,
            show_abandoned_cart_settings_page: false,
          });
        } else if (
          response?.data?.error === "group with this name already exists"
        ) {
          toast.error("Role already exists");
        } else if (response?.data?.detail === "Invalid token") {
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
        }
      } else {
        const response = await createRoleApi(
          roleName,
          description,
          isActive,
          show_user_page,
          show_user_role_page,
          show_customer_page,
          show_discount_coupon_page,
          show_delivery_setting_page,
          show_product_category_page,
          show_product_page,
          show_product_tag_page,
          show_order_page,
          show_tax_page,
          show_banner_page,
          show_blog_page,
          show_payment_services_page,
          show_shipping_services_page,
          show_google_analytics_settings_page,
          show_header_section_page,
          show_homepage_statistics_page,
          show_why_choose_us_section_page,
          show_gallery_section_page,
          show_gallery_page,
          show_testimonial_page,
          show_about_us_page,
          show_store_page,
          show_contact_us_page,
          show_newsletter_page,
          show_pincode_page,
          show_abandoned_cart_settings_page,
          createdBy,
          token
        );
        if (response?.data?.error === "group with this name already exists") {
          toast.error("Role already exists");
        } else if (response?.status === 201) {
          toast.success("Role created successfully");
          setOpenForm(false);
          fetchRoles();
          setNewRole({
            roleName: "",
            description: "",
            isActive: false,
            show_user_page: false,
            show_user_role_page: false,
            show_customer_page: false,
            show_discount_coupon_page: false,
            show_delivery_setting_page: false,
            show_product_category_page: false,
            show_product_page: false,
            show_product_tag_page: false,
            show_order_page: false,
            show_tax_page: false,
            show_banner_page: false,
            show_blog_page: false,
            show_payment_services_page: false,
            show_shipping_services_page: false,
            show_google_analytics_settings_page: false,
            show_header_section_page: false,
            show_homepage_statistics_page: false,
            show_why_choose_us_section_page: false,
            show_gallery_section_page: false,
            show_gallery_page: false,
            show_testimonial_page: false,
            show_about_us_page: false,
            show_store_page: false,
            show_contact_us_page: false,
            show_newsletter_page: false,
            show_pincode_page: false,
            show_abandoned_cart_settings_page: false,
          });
        } else if (response?.data?.detail === "Invalid token") {
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
        }
      }
    } catch (error) {
      console.error("Error creating or updating role:", error);
    }
  };

  const isActive =
    isfiltervalue === "Active"
      ? true
      : isfiltervalue === "Inactive"
      ? false
      : undefined;

  const fetchRoles = async () => {
    try {
      const response = await roleAllDataApi({
        search: searchText,
        token: token,
        is_active: isActive,
        ordering: ordering,
      });
      if (response?.user_roles) {
        setRoles(response?.user_roles || []);
      } else if (response?.detail === "Invalid token") {
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again");
        router.push("/");
      }
    } catch (error) {}
  };

  const handleOrdering = (field: string) => {
    setOrdering((prev) => (prev === field ? `-${field}` : field));
  };

  useEffect(() => {
    fetchRoles();
  }, [searchText, isfiltervalue, ordering]);

  const handleDelete = async (id: string) => {
    setSelectedRoleId(id);
    setIsLogoutPopup(true);
  };

  const handleDeleteConform = async (id: string) => {
    try {
      const response = await roleDeleteApi(id, token);
      if (response?.success) {
        toast.success("Role deleted successfully");
        setIsLogoutPopup(false);
        fetchRoles();
      } else if (response?.detail === "Invalid token") {
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again");
        router.push("/");
      }
    } catch (error) {
      console.error("Failed to delete role:");
    }
  };
  const handleEdit = (role: {
    id: string;
    description: string;
    name: string;
    is_active: boolean;
    show_user_page: boolean;
    show_user_role_page: boolean;
    show_customer_page: boolean;
    show_discount_coupon_page: boolean;
    show_delivery_setting_page: boolean;
    show_product_category_page: boolean;
    show_product_page: boolean;
    show_product_tag_page: boolean;
    show_order_page: boolean;
    show_tax_page: boolean;
    show_banner_page: boolean;
    show_blog_page: boolean;
    show_payment_services_page: boolean;
    show_shipping_services_page: boolean;
    show_google_analytics_settings_page: boolean;
    show_header_section_page: boolean;
    show_homepage_statistics_page: boolean;
    show_why_choose_us_section_page: boolean;
    show_gallery_section_page: boolean;
    show_gallery_page: boolean;
    show_testimonial_page: boolean;
    show_about_us_page: boolean;
    show_store_page: boolean;
    show_contact_us_page: boolean;
    show_newsletter_page: boolean;
    show_pincode_page: boolean;
    show_abandoned_cart_settings_page: boolean;
  }) => {
    if (roleFormRef.current) {
      roleFormRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setOpenForm(true);
    setNewRole({
      roleName: role?.name,
      description: role?.description,
      isActive: role?.is_active,
      show_user_page: role?.show_user_page,
      show_user_role_page: role?.show_user_role_page,
      show_customer_page: role?.show_customer_page,
      show_discount_coupon_page: role?.show_discount_coupon_page,
      show_delivery_setting_page: role?.show_delivery_setting_page,
      show_product_category_page: role?.show_product_category_page,
      show_product_page: role?.show_product_page,
      show_product_tag_page: role?.show_product_tag_page,
      show_order_page: role?.show_order_page,
      show_tax_page: role?.show_tax_page,
      show_banner_page: role?.show_banner_page,
      show_blog_page: role?.show_blog_page,
      show_payment_services_page: role?.show_payment_services_page,
      show_shipping_services_page: role?.show_shipping_services_page,
      show_google_analytics_settings_page:
        role?.show_google_analytics_settings_page,
      show_header_section_page: role?.show_header_section_page,
      show_homepage_statistics_page: role?.show_homepage_statistics_page,
      show_why_choose_us_section_page: role?.show_why_choose_us_section_page,
      show_gallery_section_page: role?.show_gallery_section_page,
      show_gallery_page: role?.show_gallery_page,
      show_testimonial_page: role?.show_testimonial_page,
      show_about_us_page: role?.show_about_us_page,
      show_store_page: role?.show_store_page,
      show_contact_us_page: role?.show_contact_us_page,
      show_newsletter_page: role?.show_newsletter_page,
      show_pincode_page: role?.show_pincode_page,
      show_abandoned_cart_settings_page:
        role?.show_abandoned_cart_settings_page,
    });
    setIsEdit(true);
    setSelectedRoleId(role.id);
  };
  const handlecCancleEdit = () => {
    setIsEdit(false);
    setOpenForm(false);
    setNewRole({
      roleName: "",
      description: "",
      isActive: false,
      show_user_page: false,
      show_user_role_page: false,
      show_customer_page: false,
      show_discount_coupon_page: false,
      show_delivery_setting_page: false,
      show_product_category_page: false,
      show_product_page: false,
      show_product_tag_page: false,
      show_order_page: false,
      show_tax_page: false,
      show_banner_page: false,
      show_blog_page: false,
      show_payment_services_page: false,
      show_shipping_services_page: false,
      show_google_analytics_settings_page: false,
      show_header_section_page: false,
      show_homepage_statistics_page: false,
      show_why_choose_us_section_page: false,
      show_gallery_section_page: false,
      show_gallery_page: false,
      show_testimonial_page: false,
      show_about_us_page: false,
      show_store_page: false,
      show_contact_us_page: false,
      show_newsletter_page: false,
      show_pincode_page: false,
      show_abandoned_cart_settings_page: false,
    });
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };
  const clearSearch = () => {
    setSearchText("");
  };
  const handleopenform = () => {
    setIsEdit(false);
    setOpenForm(!openForm);
    setNewRole({
      roleName: "",
      description: "",
      isActive: false,
      show_user_page: false,
      show_user_role_page: false,
      show_customer_page: false,
      show_discount_coupon_page: false,
      show_delivery_setting_page: false,
      show_product_category_page: false,
      show_product_page: false,
      show_product_tag_page: false,
      show_order_page: false,
      show_tax_page: false,
      show_banner_page: false,
      show_blog_page: false,
      show_payment_services_page: false,
      show_shipping_services_page: false,
      show_google_analytics_settings_page: false,
      show_header_section_page: false,
      show_homepage_statistics_page: false,
      show_why_choose_us_section_page: false,
      show_gallery_section_page: false,
      show_gallery_page: false,
      show_testimonial_page: false,
      show_about_us_page: false,
      show_store_page: false,
      show_contact_us_page: false,
      show_newsletter_page: false,
      show_pincode_page: false,
      show_abandoned_cart_settings_page: false,
    });
  };
  const handleOpenInfo = (id: string) => {
    setIsInfoPopup(true);
    setinfo(id);
  };
  const activeHandler = async (
    userInformation: any,
    isActive: boolean,
    show_user_page: boolean,
    show_user_role_page: boolean,
    show_customer_page: boolean,
    show_discount_coupon_page: boolean,
    show_delivery_setting_page: boolean,
    show_product_category_page: boolean,
    show_product_page: boolean,
    show_tax_page: boolean,
    show_order_page: boolean,
    show_product_tag_page: boolean,
    show_banner_page: boolean,
    show_blog_page: boolean,
    show_payment_services_page: boolean,
    show_shipping_services_page: boolean,
    show_google_analytics_settings_page: boolean,
    show_header_section_page: boolean,
    show_homepage_statistics_page: boolean,
    show_why_choose_us_section_page: boolean,
    show_gallery_section_page: boolean,
    show_gallery_page: boolean,
    show_testimonial_page: boolean,
    show_about_us_page: boolean,
    show_store_page: boolean,
    show_contact_us_page: boolean,
    show_newsletter_page: boolean,
    show_pincode_page: boolean,
    show_abandoned_cart_settings_page: boolean
  ) => {
    const response = await roleUpdatedApi(
      userInformation.id,
      userInformation.name,
      userInformation.description,
      isActive,
      show_user_page,
      show_user_role_page,
      show_customer_page,
      show_discount_coupon_page,
      show_delivery_setting_page,
      show_product_category_page,
      show_product_page,
      show_product_tag_page,
      show_tax_page,
      show_order_page,
      show_banner_page,
      show_blog_page,
      show_payment_services_page,
      show_shipping_services_page,
      show_google_analytics_settings_page,
      show_header_section_page,
      show_homepage_statistics_page,
      show_why_choose_us_section_page,
      show_gallery_section_page,
      show_gallery_page,
      show_testimonial_page,
      show_about_us_page,
      show_store_page,
      show_contact_us_page,
      show_newsletter_page,
      show_pincode_page,
      show_abandoned_cart_settings_page,
      createdBy,
      token
    );
    if (response?.status === 200) {
      fetchRoles();
    } else if (response?.data?.detail === "Invalid token") {
      dispatch(clearUserDetails());
      toast.error("Session Expired, Please Login Again");
      router.push("/");
    }
  };
  const handleRoleAcess = (role: { id: string }) => {
    setOpenAcesspopup(true);
    setAcessData(role);
  };
  const handlefilter = (value: any) => {
    setfiltervalue(value);
    setIsActiveInactiveFilterPopup(false);
  };
  return (
    <div className='min-h-screen w-full flex flex-col lg:items-center'>
      <div className='flex justify-center items-center mx-auto w-full mb-4 lg:gap-8 gap-3 '>
        <div className='md:w-[60%] w-[90%] relative'>
          <div className='relative'>
            <span className='absolute top-1/2 transform -translate-y-1/2 bg-admin-buttonprimary h-full w-[50px] rounded-l-lg flex justify-center items-center'>
              <GoSearch size={23} color='white' />
            </span>
            <input
              type='text'
              className='w-full p-2 pl-16 pr-10 border h-12 bg-white border-gray-500 rounded-lg focus:outline-none'
              placeholder='Search by Role Name'
              value={searchText}
              onChange={handleSearchChange}
            />
            {searchText && (
              <button
                className='absolute right-3 top-1/2 transform -translate-y-1/2'
                onClick={clearSearch}
              >
                <AiOutlineClose size={23} />
              </button>
            )}
          </div>
        </div>
        <div onClick={handleopenform}>
          {openForm ? (
            <button type='button' className='button h-12'>
              <span className='button__text'>Close</span>
              <span className='button__icon'>
                <FiMinus size={24} />
              </span>
            </button>
          ) : (
            <button type='button' className='button h-12'>
              <span className='button__text'>Add</span>
              <span className='button__icon'>
                <FiPlus size={24} />
              </span>
            </button>
          )}
        </div>
      </div>
      {openForm && (
        <form
          ref={roleFormRef}
          onSubmit={handleCreateOrUpdate}
          className='bg-white w-full rounded-lg shadow-md lg:p-6'
        >
          <div className='flex lg:flex-row flex-col p-4 items-center w-full lg:gap-8 gap-4 justify-between'>
            <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm'>
              <BsPuzzleFill color='#A5B7C0' size={26} />
              <input
                type='text'
                // placeholder="Enter Role"
                value={newRole.roleName}
                required
                onChange={(e) =>
                  setNewRole((prev) => ({ ...prev, roleName: e.target.value }))
                }
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
              />
              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                Enter Role
              </label>
            </div>
            <div className='flex bg-[#F3F3F3] p-3 relative w-full h-12 rounded-lg shadow-sm'>
              <BsPuzzleFill color='#A5B7C0' size={26} />
              <input
                type='text'
                // placeholder="Enter Description"
                value={newRole.description}
                onChange={(e) =>
                  setNewRole((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 bg-transparent text-gray-900 placeholder-transparent transition-all duration-300 ease-in-out '
              />
              <label
                htmlFor='tag'
                className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 transition-all duration-300 ease-in-out bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
              >
                Enter Description
              </label>
            </div>
          </div>

          <div className='grid lg:grid-cols-6 grid-cols-2 justify-center items-center mt-3 gap-4 p-4'>
            <div className='flex  items-center justify-between gap-2 bg-[#F3F3F3] rounded-lg h-12 lg:w-46 w-full p-2'>
              <label className='text-sm text-[#577C8E] lg:px-3'>
                Is Active?
              </label>
              <div className='switch'>
                <label>
                  <input
                    type='checkbox'
                    checked={newRole.isActive}
                    onChange={(e) =>
                      setNewRole((prev) => ({
                        ...prev,
                        isActive: e.target.checked,
                      }))
                    }
                  />
                  <span className='slider'></span>
                </label>
              </div>
            </div>
            <div className='flex  items-center justify-between gap-2 bg-[#F3F3F3] rounded-lg h-12 lg:w-46 w-full p-2'>
              <label className='text-sm text-[#577C8E] lg:px-3 w-[30%]'>
                Banner
              </label>
              <div className='switch  w-[70%]'>
                <label>
                  <input
                    type='checkbox'
                    checked={newRole.show_banner_page}
                    onChange={(e) =>
                      setNewRole((prev) => ({
                        ...prev,
                        show_banner_page: e.target.checked,
                      }))
                    }
                  />
                  <span className='slider'></span>
                </label>
              </div>
            </div>
            <div className='flex  items-center justify-between gap-2 bg-[#F3F3F3] rounded-lg h-12 lg:w-46 w-full p-2'>
              <label className='text-sm text-[#577C8E] lg:px-3 w-[30%]'>
                Categories
              </label>
              <div className='switch w-[70%]'>
                <label>
                  <input
                    type='checkbox'
                    checked={newRole.show_product_category_page}
                    onChange={(e) =>
                      setNewRole((prev) => ({
                        ...prev,
                        show_product_category_page: e.target.checked,
                      }))
                    }
                  />
                  <span className='slider'></span>
                </label>
              </div>
            </div>
            <div className='flex  items-center justify-between gap-2 bg-[#F3F3F3] rounded-lg h-12 lg:w-46 w-full p-2'>
              <label className='text-sm text-[#577C8E] lg:px-3 w-[30%]'>
                Customers
              </label>
              <div className='switch w-[70%]'>
                <label>
                  <input
                    type='checkbox'
                    checked={newRole.show_customer_page}
                    onChange={(e) =>
                      setNewRole((prev) => ({
                        ...prev,
                        show_customer_page: e.target.checked,
                      }))
                    }
                  />
                  <span className='slider'></span>
                </label>
              </div>
            </div>
            <div className='flex  items-center justify-between gap-2 bg-[#F3F3F3] rounded-lg h-12 lg:w-46 w-full p-2'>
              <label className='text-sm text-[#577C8E] lg:px-3 w-[30%]'>
                Product
              </label>
              <div className='switch w-[70%]'>
                <label>
                  <input
                    type='checkbox'
                    checked={newRole.show_product_page}
                    onChange={(e) =>
                      setNewRole((prev) => ({
                        ...prev,
                        show_product_page: e.target.checked,
                      }))
                    }
                  />
                  <span className='slider'></span>
                </label>
              </div>
            </div>
            <div className='flex  items-center justify-between gap-2 bg-[#F3F3F3] rounded-lg h-12 lg:w-46 w-full p-2'>
              <label className='text-sm text-[#577C8E] lg:px-3 w-[30%]'>
                Tax
              </label>
              <div className='switch  w-[70%]'>
                <label>
                  <input
                    type='checkbox'
                    checked={newRole.show_tax_page}
                    onChange={(e) =>
                      setNewRole((prev) => ({
                        ...prev,
                        show_tax_page: e.target.checked,
                      }))
                    }
                  />
                  <span className='slider'></span>
                </label>
              </div>
            </div>
            <div className='flex  items-center justify-between gap-2 bg-[#F3F3F3] rounded-lg h-12 lg:w-46 w-full p-2'>
              <label className='text-sm text-[#577C8E] lg:px-3 w-[30%]'>
                Coupons
              </label>
              <div className='switch w-[70%]'>
                <label>
                  <input
                    type='checkbox'
                    checked={newRole.show_discount_coupon_page}
                    onChange={(e) =>
                      setNewRole((prev) => ({
                        ...prev,
                        show_discount_coupon_page: e.target.checked,
                      }))
                    }
                  />
                  <span className='slider'></span>
                </label>
              </div>
            </div>
            <div className='flex  items-center justify-between gap-2 bg-[#F3F3F3] rounded-lg h-12 lg:w-46 w-full p-2'>
              <label className='text-sm text-[#577C8E] lg:px-3'>User</label>
              <div className='switch'>
                <label>
                  <input
                    type='checkbox'
                    checked={newRole.show_user_page}
                    onChange={(e) =>
                      setNewRole((prev) => ({
                        ...prev,
                        show_user_page: e.target.checked,
                      }))
                    }
                  />
                  <span className='slider'></span>
                </label>
              </div>
            </div>
            <div className='flex  items-center justify-between gap-2 bg-[#F3F3F3] rounded-lg h-12 lg:w-46 w-full p-2'>
              <label className='text-sm text-[#577C8E] lg:px-3 w-[30%]'>
                Role
              </label>
              <div className='switch w-[70%]'>
                <label>
                  <input
                    type='checkbox'
                    checked={newRole.show_user_role_page}
                    onChange={(e) =>
                      setNewRole((prev) => ({
                        ...prev,
                        show_user_role_page: e.target.checked,
                      }))
                    }
                  />
                  <span className='slider'></span>
                </label>
              </div>
            </div>
            <div className='flex  items-center justify-between gap-2 bg-[#F3F3F3] rounded-lg h-12 lg:w-46 w-full p-2'>
              <label className='text-sm text-[#577C8E] lg:px-3 w-[30%]'>
                Blog
              </label>
              <div className='switch  w-[70%]'>
                <label>
                  <input
                    type='checkbox'
                    checked={newRole.show_blog_page}
                    onChange={(e) =>
                      setNewRole((prev) => ({
                        ...prev,
                        show_blog_page: e.target.checked,
                      }))
                    }
                  />
                  <span className='slider'></span>
                </label>
              </div>
            </div>
            <div className='flex  items-center justify-between gap-2 bg-[#F3F3F3] rounded-lg h-12 lg:w-46 w-full p-2'>
              <label className='text-sm text-[#577C8E] lg:px-3 w-[30%]'>
                Order
              </label>
              <div className='switch w-[70%] '>
                <label>
                  <input
                    type='checkbox'
                    checked={newRole.show_order_page}
                    onChange={(e) =>
                      setNewRole((prev) => ({
                        ...prev,
                        show_order_page: e.target.checked,
                      }))
                    }
                  />
                  <span className='slider'></span>
                </label>
              </div>
            </div>
            <div className='flex  items-center justify-between gap-2 bg-[#F3F3F3] rounded-lg h-12 lg:w-46 w-full p-2'>
              <label className='text-sm text-[#577C8E] lg:px-3 w-[30%]'>
                Shipping
              </label>
              <div className='switch w-[70%]'>
                <label>
                  <input
                    type='checkbox'
                    checked={newRole.show_shipping_services_page}
                    onChange={(e) =>
                      setNewRole((prev) => ({
                        ...prev,
                        show_shipping_services_page: e.target.checked,
                      }))
                    }
                  />
                  <span className='slider'></span>
                </label>
              </div>
            </div>
            <div className='flex  items-center justify-between gap-2 bg-[#F3F3F3] rounded-lg h-12 lg:w-46 w-full p-2'>
              <label className='text-sm text-[#577C8E] lg:px-3 w-[30%]'>
                Payment Gateway
              </label>
              <div className='switch w-[70%]'>
                <label>
                  <input
                    type='checkbox'
                    checked={newRole.show_payment_services_page}
                    onChange={(e) =>
                      setNewRole((prev) => ({
                        ...prev,
                        show_payment_services_page: e.target.checked,
                      }))
                    }
                  />
                  <span className='slider'></span>
                </label>
              </div>
            </div>

            <div className='flex  items-center justify-between gap-2 bg-[#F3F3F3] rounded-lg h-12 lg:w-46 w-full p-2'>
              <label className='text-sm text-[#577C8E] lg:px-3 w-[30%]'>
                Delivery Settings
              </label>
              <div className='switch w-[70%]'>
                <label>
                  <input
                    type='checkbox'
                    checked={newRole.show_delivery_setting_page}
                    onChange={(e) =>
                      setNewRole((prev) => ({
                        ...prev,
                        show_delivery_setting_page: e.target.checked,
                      }))
                    }
                  />
                  <span className='slider'></span>
                </label>
              </div>
            </div>
            <div className='flex  items-center justify-between gap-2 bg-[#F3F3F3] rounded-lg h-12 lg:w-46 w-full p-2'>
              <label className='text-sm text-[#577C8E] lg:px-3 w-[30%]'>
                Tag
              </label>
              <div className='switch w-[70%]'>
                <label>
                  <input
                    type='checkbox'
                    checked={newRole.show_product_tag_page}
                    onChange={(e) =>
                      setNewRole((prev) => ({
                        ...prev,
                        show_product_tag_page: e.target.checked,
                      }))
                    }
                  />
                  <span className='slider'></span>
                </label>
              </div>
            </div>
            <div className='flex  items-center justify-between gap-2 bg-[#F3F3F3] rounded-lg h-12 lg:w-46 w-full p-2'>
              <label className='text-sm text-[#577C8E] lg:px-3 w-[30%]'>
                Banner
              </label>
              <div className='switch w-[70%]'>
                <label>
                  <input
                    type='checkbox'
                    checked={newRole.show_banner_page}
                    onChange={(e) =>
                      setNewRole((prev) => ({
                        ...prev,
                        show_banner_page: e.target.checked,
                      }))
                    }
                  />
                  <span className='slider'></span>
                </label>
              </div>
            </div>
            <div className='flex  items-center justify-between gap-2 bg-[#F3F3F3] rounded-lg h-12 lg:w-46 w-full p-2'>
              <label className='text-sm text-[#577C8E] lg:px-3 w-[30%]'>
                Google Analytics
              </label>
              <div className='switch w-[70%]'>
                <label>
                  <input
                    type='checkbox'
                    checked={newRole.show_google_analytics_settings_page}
                    onChange={(e) =>
                      setNewRole((prev) => ({
                        ...prev,
                        show_google_analytics_settings_page: e.target.checked,
                      }))
                    }
                  />
                  <span className='slider'></span>
                </label>
              </div>
            </div>
            <div className='flex  items-center justify-between gap-2 bg-[#F3F3F3] rounded-lg h-12 lg:w-46 w-full p-2'>
              <label className='text-sm text-[#577C8E] lg:px-3 w-[30%]'>
                Header
              </label>
              <div className='switch w-[70%]'>
                <label>
                  <input
                    type='checkbox'
                    checked={newRole.show_header_section_page}
                    onChange={(e) =>
                      setNewRole((prev) => ({
                        ...prev,
                        show_header_section_page: e.target.checked,
                      }))
                    }
                  />
                  <span className='slider'></span>
                </label>
              </div>
            </div>
            <div className='flex  items-center justify-between gap-2 bg-[#F3F3F3] rounded-lg h-12 lg:w-46 w-full p-2'>
              <label className='text-sm text-[#577C8E] lg:px-3 w-[30%]'>
                Counter
              </label>
              <div className='switch w-[70%]'>
                <label>
                  <input
                    type='checkbox'
                    checked={newRole.show_homepage_statistics_page}
                    onChange={(e) =>
                      setNewRole((prev) => ({
                        ...prev,
                        show_homepage_statistics_page: e.target.checked,
                      }))
                    }
                  />
                  <span className='slider'></span>
                </label>
              </div>
            </div>
            <div className='flex  items-center justify-between gap-2 bg-[#F3F3F3] rounded-lg h-12 lg:w-46 w-full p-2'>
              <label className='text-sm text-[#577C8E] lg:px-3 w-[30%]'>
                Why Choose US
              </label>
              <div className='switch w-[70%]'>
                <label>
                  <input
                    type='checkbox'
                    checked={newRole.show_why_choose_us_section_page}
                    onChange={(e) =>
                      setNewRole((prev) => ({
                        ...prev,
                        show_why_choose_us_section_page: e.target.checked,
                      }))
                    }
                  />
                  <span className='slider'></span>
                </label>
              </div>
            </div>
            <div className='flex  items-center justify-between gap-2 bg-[#F3F3F3] rounded-lg h-12 lg:w-46 w-full p-2'>
              <label className='text-sm text-[#577C8E] lg:px-3 w-[30%]'>
                Gallery Type
              </label>
              <div className='switch w-[70%]'>
                <label>
                  <input
                    type='checkbox'
                    checked={newRole.show_gallery_section_page}
                    onChange={(e) =>
                      setNewRole((prev) => ({
                        ...prev,
                        show_gallery_section_page: e.target.checked,
                      }))
                    }
                  />
                  <span className='slider'></span>
                </label>
              </div>
            </div>
            <div className='flex  items-center justify-between gap-2 bg-[#F3F3F3] rounded-lg h-12 lg:w-46 w-full p-2'>
              <label className='text-sm text-[#577C8E] lg:px-3 w-[30%]'>
              Gallery
              </label>
              <div className='switch w-[70%]'>
                <label>
                  <input
                    type='checkbox'
                    checked={newRole.show_gallery_page}
                    onChange={(e) =>
                      setNewRole((prev) => ({
                        ...prev,
                        show_gallery_page: e.target.checked,
                      }))
                    }
                  />
                  <span className='slider'></span>
                </label>
              </div>
            </div>
            <div className='flex  items-center justify-between gap-2 bg-[#F3F3F3] rounded-lg h-12 lg:w-46 w-full p-2'>
              <label className='text-sm text-[#577C8E] lg:px-3 w-[30%]'>
              Testimonial
              </label>
              <div className='switch w-[70%]'>
                <label>
                  <input
                    type='checkbox'
                    checked={newRole.show_testimonial_page}
                    onChange={(e) =>
                      setNewRole((prev) => ({
                        ...prev,
                        show_testimonial_page: e.target.checked,
                      }))
                    }
                  />
                  <span className='slider'></span>
                </label>
              </div>
            </div>
            <div className='flex  items-center justify-between gap-2 bg-[#F3F3F3] rounded-lg h-12 lg:w-46 w-full p-2'>
              <label className='text-sm text-[#577C8E] lg:px-3 w-[30%]'>
              About Us
              </label>
              <div className='switch w-[70%]'>
                <label>
                  <input
                    type='checkbox'
                    checked={newRole.show_about_us_page}
                    onChange={(e) =>
                      setNewRole((prev) => ({
                        ...prev,
                        show_about_us_page: e.target.checked,
                      }))
                    }
                  />
                  <span className='slider'></span>
                </label>
              </div>
            </div>
            <div className='flex  items-center justify-between gap-2 bg-[#F3F3F3] rounded-lg h-12 lg:w-46 w-full p-2'>
              <label className='text-sm text-[#577C8E] lg:px-3 w-[30%]'>
              Store Address
              </label>
              <div className='switch w-[70%]'>
                <label>
                  <input
                    type='checkbox'
                    checked={newRole.show_store_page}
                    onChange={(e) =>
                      setNewRole((prev) => ({
                        ...prev,
                        show_store_page : e.target.checked,
                      }))
                    }
                  />
                  <span className='slider'></span>
                </label>
              </div>
            </div>
            <div className='flex  items-center justify-between gap-2 bg-[#F3F3F3] rounded-lg h-12 lg:w-46 w-full p-2'>
              <label className='text-sm text-[#577C8E] lg:px-3 w-[30%]'>
              Contact Us
              </label>
              <div className='switch w-[70%]'>
                <label>
                  <input
                    type='checkbox'
                    checked={newRole.show_contact_us_page}
                    onChange={(e) =>
                      setNewRole((prev) => ({
                        ...prev,
                        show_contact_us_page: e.target.checked,
                      }))
                    }
                  />
                  <span className='slider'></span>
                </label>
              </div>
            </div>
            <div className='flex  items-center justify-between gap-2 bg-[#F3F3F3] rounded-lg h-12 lg:w-46 w-full p-2'>
              <label className='text-sm text-[#577C8E] lg:px-3 w-[30%]'>
              Newsletter
              </label>
              <div className='switch w-[70%]'>
                <label>
                  <input
                    type='checkbox'
                    checked={newRole.show_newsletter_page}
                    onChange={(e) =>
                      setNewRole((prev) => ({
                        ...prev,
                        show_newsletter_page: e.target.checked,
                      }))
                    }
                  />
                  <span className='slider'></span>
                </label>
              </div>
            </div>
            <div className='flex  items-center justify-between gap-2 bg-[#F3F3F3] rounded-lg h-12 lg:w-46 w-full p-2'>
              <label className='text-sm text-[#577C8E] lg:px-3 w-[30%]'>
              Pincode
              </label>
              <div className='switch w-[70%]'>
                <label>
                  <input
                    type='checkbox'
                    checked={newRole.show_pincode_page}
                    onChange={(e) =>
                      setNewRole((prev) => ({
                        ...prev,
                        show_pincode_page: e.target.checked,
                      }))
                    }
                  />
                  <span className='slider'></span>
                </label>
              </div>
            </div>
            <div className='flex  items-center justify-between gap-2 bg-[#F3F3F3] rounded-lg h-12 lg:w-46 w-full p-2'>
              <label className='text-sm text-[#577C8E] lg:px-3 w-[30%]'>
              Abandoned Cart
              </label>
              <div className='switch w-[70%]'>
                <label>
                  <input
                    type='checkbox'
                    checked={newRole.show_abandoned_cart_settings_page}
                    onChange={(e) =>
                      setNewRole((prev) => ({
                        ...prev,
                        show_abandoned_cart_settings_page: e.target.checked,
                      }))
                    }
                  />
                  <span className='slider'></span>
                </label>
              </div>
            </div>
          </div>

          <div className='flex justify-center items-center lg:gap-12 gap-3 mb-3'>
            <div className='mt-2 flex gap-3 justify-center items-center'>
              <button
                type='submit'
                className={`text-lg lg:w-[230px] w-full mt-3  ${
                  isEdit ? "bg-green-500" : "bg-admin-buttonprimary"
                } text-white px-6 lg:py-3 py-2 rounded-md`}
              >
                {isEdit ? "Update" : "Create"}
              </button>
              {isEdit ? (
                <>
                  {" "}
                  <button
                    onClick={handlecCancleEdit}
                    className='text-lg lg:w-[230px] mt-3 bg-[#577C8E] text-white px-6 lg:py-3 py-2 rounded-md'
                  >
                    Cancel
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </form>
      )}

      <div className='bg-white shadow-md rounded-lg w-full flex justify-center items-center mt-6'>
        <div className='overflow-x-auto w-full '>
          <table className='w-full border-collapse'>
            <thead>
              <tr className='bg-admin-secondary text-admin-text-primary font-semibold  cursor-pointer'>
                {/* <th className="py-3 px-4">Role Name</th> */}
                <th
                  className={`px-4 text-center cursor-pointer transition-colors duration-200 ${
                    ordering === "name" || ordering === "-name"
                      ? "text-admin-text-primary"
                      : "text-admin-text-primary"
                  }`}
                  onClick={() => handleOrdering("name")}
                >
                  <div className='flex items-center justify-start space-x-0'>
                    <span className=''>Name</span>
                    <span className='flex flex-col leading-none'>
                      <MdArrowDropUp
                        className={`w-7 h-7 transform -mb-1 ${
                          ordering === "name"
                            ? "text-admin-text-primary"
                            : "text-admin-text-primary"
                        }`}
                      />
                      <IoMdArrowDropdown
                        className={`w-7 h-7 transform -mt-3 ${
                          ordering === "-name"
                            ? "text-admin-text-primary"
                            : "text-admin-text-primary"
                        }`}
                      />
                    </span>
                  </div>
                </th>
                <th
                  className='py-3 px-4 flex gap-1 justify-center items-center'
                  onClick={() => setIsActiveInactiveFilterPopup(true)}
                >
                  {isfiltervalue === "" ? "Status" : isfiltervalue}{" "}
                  <FaAngleDown className='text-admin-text-primary' />
                </th>
                <th className='py-3 px-4'>Permission</th>
                <th className='py-3 px-4'>Action</th>
                <th className='py-3 px-4'>Info</th>
              </tr>
            </thead>
            <tbody>
              {roles?.map((role: any, index: any) => (
                <tr key={index} className='border-b-[1px] hover:bg-blue-100'>
                  <td className='py-3 px-4 text-start'>{role?.name}</td>
                  <td className='py-3 px-4'>
                    <div className='flex flex-col items-center'>
                      <Switch
                        checked={role?.is_active}
                        onChange={() =>
                          activeHandler(
                            role,
                            !role?.is_active,
                            role?.show_user_page,
                            role?.show_user_role_page,
                            role?.show_customer_page,
                            role?.show_discount_coupon_page,
                            role?.show_delivery_setting_page,
                            role?.show_product_category_page,
                            role?.show_product_page,
                            role?.show_tax_page,
                            role?.show_order_page,
                            role?.show_product_tag_page,
                            role?.show_banner_page,
                            role?.show_blog_page,
                            role?.show_payment_services_page,
                            role?.show_shipping_services_page,
                            role?.show_google_analytics_settings_page,
                            role?.show_header_section_page,
                            role?.show_homepage_statistics_page,
                            role?.show_why_choose_us_section_page,
                            role?.show_gallery_section_page,
                            role?.show_gallery_page,
                            role?.show_testimonial_page,
                            role?.show_about_us_page,
                            role?.show_store_page,
                            role?.show_contact_us_page,
                            role?.show_newsletter_page,
                            role?.show_pincode_page,
                            role?.show_abandoned_cart_settings_page
                          )
                        }
                        className={`${
                          role?.is_active ? "bg-green-500" : "bg-gray-300"
                        } relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-200 ease-in-out`}
                      >
                        <span
                          className={`${
                            role?.is_active ? "translate-x-6" : "translate-x-1"
                          } inline-block w-6 h-6 bg-white rounded-full transition-transform duration-200 ease-in-out`}
                        />
                      </Switch>
                    </div>
                  </td>
                  <td className='py-3 px-4 text-center'>
                    <div
                      className='flex justify-center'
                      onClick={() => handleRoleAcess(role)}
                    >
                      <PiKeyholeFill size={30} color='#577C8E' />
                    </div>
                  </td>

                  <td className='py-3 px-4 items-center'>
                    <div className='flex justify-center gap-4'>
                      <button
                        onClick={() => handleEdit(role)}
                        className='text-orange-500'
                      >
                        <TbEdit size={26} />
                      </button>
                      <button
                        onClick={() => handleDelete(role?.id)}
                        className='text-red-500'
                      >
                        <MdDelete size={26} />
                      </button>
                    </div>
                  </td>
                  <td className='py-3 px-4 text-center'>
                    <div className='mt-1'>
                      <button
                        className='text-blue-500'
                        aria-label='Info'
                        onClick={() => handleOpenInfo(role?.id)}
                      >
                        <img
                          src='/Info.png'
                          alt='Profile'
                          className='h-6 w-6 object-cover rounded-full'
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isOpenAcesspopup && (
        <RoleAcessComponent
          isOpenDeletePopup={isOpenAcesspopup}
          handleDeleteConform={() => handleRoleAcess(isAcessData)}
          setIsLogoutDialogOpen={setOpenAcesspopup}
          setIsOpen={setIsLogoutPopup}
          role={isAcessData}
          fetchRoles={fetchRoles}
        />
      )}
      {isOpenInfoPopup && (
        <RoleInfoPopup
          role={roles.find((role) => role.id === info)}
          isOpenInfoPopup={isOpenInfoPopup}
          setIsInfoPopup={setIsInfoPopup}
          setIsOpen={setIsInfoPopup}
        />
      )}
      {isActiveInactiveFitlerPopup && (
        <ActiveInactiveFilterPopup
          isOpenActiveInactivePopup={isActiveInactiveFitlerPopup}
          setIsActiveInactiveFilterPopup={setIsActiveInactiveFilterPopup}
          handlefilter={handlefilter}
          isActiveInactiveValue={isfiltervalue}
        />
      )}

      {isOpenDeletePopup && (
        <RoleDeletePopUpComponent
          isOpenDeletePopup={isOpenDeletePopup}
          handleDeleteConform={() => handleDeleteConform(selectedRoleId)}
          setIsLogoutDialogOpen={setIsLogoutPopup}
          setIsOpen={setIsLogoutPopup}
        />
      )}
    </div>
  );
};

export default AdminForm;
