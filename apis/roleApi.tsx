import { apiCores } from "./apiCore";
import { apiCoreDelete } from "./apiCoreDelete";
import { apiCoreGet } from "./apiCoreGet";
import { apiCoreUpdate } from "./apiCoreUpdate";

export const roleAllDataApi = async (searchParams: {
  search: string;
  token: string;
  is_active?: boolean;
  ordering: string;
}) => {
  const queryParams = new URLSearchParams({
    search: searchParams.search.toString(),
  });
  if (searchParams.is_active !== undefined) {
    queryParams.append("is_active", searchParams.is_active.toString());
  }
  if (searchParams.ordering) {
    queryParams.append("ordering", searchParams.ordering);
  }
  const endpoint = `/user/role/?${queryParams}`;
  const response = await apiCoreGet(endpoint, "GET", searchParams.token);
  return response;
};

export const createRoleApi = async (
  name: string,
  description: string,
  is_active: boolean,
  show_user_page: boolean,
  show_user_role_page: boolean,
  show_customer_page: boolean,
  show_discount_coupon_page: boolean,
  show_delivery_setting_page: boolean,
  show_product_category_page: boolean,
  show_product_page: boolean,
  show_product_tag_page: boolean,
  show_order_page: boolean,
  show_tax_page: boolean,
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
  show_abandoned_cart_settings_page: boolean,
  created_by: number,
  token: string
) => {
  const response = await apiCores(
    "/user/role/",
    {
      name: name,
      description: description,
      is_active: is_active,
      show_user_page: show_user_page,
      show_user_role_page: show_user_role_page,
      show_customer_page: show_customer_page,
      show_discount_coupon_page: show_discount_coupon_page,
      show_product_category_page: show_product_category_page,
      show_delivery_setting_page: show_delivery_setting_page,
      show_product_page: show_product_page,
      show_product_tag_page: show_product_tag_page,
      show_order_page: show_order_page,
      show_tax_page: show_tax_page,
      show_banner_page: show_banner_page,
      show_blog_page: show_blog_page,
      show_payment_services_page: show_payment_services_page,
      show_shipping_services_page: show_shipping_services_page,
      show_google_analytics_settings_page: show_google_analytics_settings_page,
      show_header_section_page: show_header_section_page,
      show_homepage_statistics_page: show_homepage_statistics_page,
      show_why_choose_us_section_page: show_why_choose_us_section_page,
      show_gallery_section_page: show_gallery_section_page,
      show_gallery_page: show_gallery_page,
      show_testimonial_page: show_testimonial_page,
      show_about_us_page: show_about_us_page,
      show_store_page: show_store_page,
      show_contact_us_page: show_contact_us_page,
      show_newsletter_page: show_newsletter_page,
      show_pincode_page: show_pincode_page,
      show_abandoned_cart_settings_page: show_abandoned_cart_settings_page,
      created_by: created_by,
    },
    "POST",
    token
  );
  return response;
};

export const roleDeleteApi = async (id: any, token: string) => {
  const response = await apiCoreDelete(`/user/role/${id}/`, token);
  return response;
};
export const roleUpdatedApi = async (
  id: string,
  name: string,
  description: string,
  is_active: boolean,
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
  show_abandoned_cart_settings_page: boolean,
  updated_by: number,
  token: string
) => {
  const requestBody = {
    name: name,
    description: description,
    is_active: is_active,
    show_user_page: show_user_page,
    show_user_role_page: show_user_role_page,
    show_customer_page: show_customer_page,
    show_discount_coupon_page: show_discount_coupon_page,
    show_product_category_page: show_product_category_page,
    show_delivery_setting_page: show_delivery_setting_page,
    show_product_page: show_product_page,
    show_tax_page: show_tax_page,
    show_order_page: show_order_page,
    show_product_tag_page: show_product_tag_page,
    show_banner_page: show_banner_page,
    show_blog_page: show_blog_page,
    show_payment_services_page: show_payment_services_page,
    show_shipping_services_page: show_shipping_services_page,
    show_google_analytics_settings_page: show_google_analytics_settings_page,
    show_header_section_page: show_header_section_page,
    show_homepage_statistics_page: show_homepage_statistics_page,
    show_why_choose_us_section_page: show_why_choose_us_section_page,
    show_gallery_section_page: show_gallery_section_page,
    show_gallery_page: show_gallery_page,
    show_testimonial_page: show_testimonial_page,
    show_about_us_page: show_about_us_page,
    show_store_page: show_store_page,
    show_contact_us_page: show_contact_us_page,
    show_newsletter_page: show_newsletter_page,
    show_pincode_page: show_pincode_page,
    show_abandoned_cart_settings_page: show_abandoned_cart_settings_page,
    updated_by: updated_by,
    token,
  };
  const response = await apiCoreUpdate(
    `/user/role/${id}/`,
    "",
    requestBody,
    "PATCH",
    token
  );
  return response;
};
