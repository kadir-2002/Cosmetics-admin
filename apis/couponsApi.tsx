import { apiCores } from "./apiCore";
import { apiCoreDelete } from "./apiCoreDelete";
import { apiCoreGet } from "./apiCoreGet";
import { apiCoreUpdate } from "./apiCoreUpdate";

export const couponsAllDataApi = async (
  token: string,
  isfilterCouponType: string,
  ordering: string,
  isActive?: boolean
) => {
  const queryParams = new URLSearchParams();
  if (isActive !== undefined) {
    queryParams.append("is_active", isActive.toString());
  }
  if (isfilterCouponType) {
    queryParams.append("type", isfilterCouponType);
  }
  if (ordering) {
    queryParams.append("ordering", ordering);
  }
  const endpoint = `/mainapp/discount-coupon/?${queryParams}`;
  const response = await apiCoreGet(endpoint, "GET", token);
  return response;
};

export const couponsDeleteApi = async (id: any, token: string) => {
  const response = await apiCoreDelete(
    `/mainapp/discount-coupon/${id}/`,
    token
  );
  return response;
};
export const couponsUpdatedApi = async (
  id: string,
  type: string,
  code: string,
  value: any,
  usage_limit: any,
  valid_from: any,
  valid_till: any,
  title: string,
  description: string,
  show_on_homepage: boolean,
  created_by: number,
  isActive: boolean,
  token: string
) => {
  const requestBody = {
    type: type,
    code: code,
    value: value,
    usage_limit: usage_limit,
    valid_from: valid_from,
    valid_till: valid_till,
    is_active: isActive,
    title: title,
    description: description,
    show_on_homepage: show_on_homepage,
    created_by: created_by,
  };
  const response = await apiCoreUpdate(
    `/mainapp/discount-coupon/${id}/`,
    "",
    requestBody,
    "PATCH",
    token
  );
  return response;
};

export const createCouponsApi = async (
  type: string,
  code: string,
  value: any,
  usage_limit: any,
  valid_from: any,
  valid_till: any,
  created_by: number,
  title: string,
  description: string,
  show_on_homepage: boolean,
  isActive: boolean,
  token: string
) => {
  const response = await apiCores(
    "/mainapp/discount-coupon/",
    {
      type: type,
      code: code,
      value: value,
      usage_limit: usage_limit,
      valid_from: valid_from,
      valid_till: valid_till,
      created_by: created_by,
      is_active: isActive,
      title: title,
      description: description,
      show_on_homepage: show_on_homepage,
    },
    "POST",
    token
  );
  return response;
};

///////////Discount----///////////

export const discountAllDataApi = async (
  token: string,
  isfilterCouponType: string,
  ordering: string,
  isActive?: boolean
) => {
  const queryParams = new URLSearchParams();
  if (isActive !== undefined) {
    queryParams.append("is_active", isActive.toString());
  }
  if (isfilterCouponType) {
    queryParams.append("type", isfilterCouponType);
  }
  if (ordering) {
    queryParams.append("ordering", ordering);
  }
  const endpoint = `/mainapp/spending-based-discount/?${queryParams}`;
  const response = await apiCoreGet(endpoint, "GET", token);
  return response;
};

export const discountDeleteApi = async (id: any, token: string) => {
  const response = await apiCoreDelete(
    `/mainapp/spending-based-discount/${id}/`,
    token
  );
  return response;
};

export const discountUpdatedApi = async (
  id: string,
  title:string,
  minimum_spend: string,
  discount_percentage: string,
  discount_price: any,
  isActive: boolean,
  token: string
) => {
  const requestBody = {
    title:title,
    minimum_spend: minimum_spend,
    discount_percentage: discount_percentage,
    discount_price: discount_price,
    is_active: isActive,
  };
  const response = await apiCoreUpdate(
    `/mainapp/spending-based-discount/${id}/`,
    "",
    requestBody,
    "PATCH",
    token
  );
  return response;
};

export const createDiscountApi = async (
  title:string,
  minimum_spend: string,
  discount_percentage: string,
  discount_price: any,
  isActive: boolean,
  token: string
) => {
  const response = await apiCores(
    "/mainapp/spending-based-discount/",
    {
      title:title,
      minimum_spend: minimum_spend,
      discount_percentage: discount_percentage,
      discount_price: discount_price,
      is_active: isActive,
    },
    "POST",
    token
  );
  return response;
};
