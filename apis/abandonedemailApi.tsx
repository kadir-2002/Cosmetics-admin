import { apiCoreNode } from "@/APISFolder/APICoreNode";
import { apiCores } from "./apiCore";
import { apiCoreDelete } from "./apiCoreDelete";
import { apiCoreGet } from "./apiCoreGet";
import { apiCoreUpdate } from "./apiCoreUpdate";

export const abandonedAllDataApi = async (apiParams: {ordering: string, isActive?: boolean}, token: string) => {
  const queryParams = new URLSearchParams();
  if (apiParams.isActive !== undefined) {
    queryParams.append("is_active", apiParams?.isActive.toString());
  }

  // if (apiParams?.ordering) {
  //   queryParams.append("ordering", apiParams?.ordering);
  // }
  const endpoint = `/abandoned-cart-setting/?${queryParams}`;
  const response = await apiCoreGet(endpoint, "GET", token);
  return response;
};

export const abandonedDeleteApi = async (id: any, token: string) => {
  const response = await apiCoreNode(`/abandoned-cart-setting/${id}/`,{},"DELETE", token);
  return response;
};
export const abandonedUpdatedApi = async (id: string, sendTime: string, discount: string, expireTime: string,isActive: boolean,token: string) => {
  const requestBody = { hours_after_email_is_sent:sendTime,discount_to_be_given_in_percent:discount,hours_after_email_cart_is_emptied:expireTime, is_active: isActive };
  const response = await apiCoreUpdate(`/abandoned-cart-setting/${id}/`, "", requestBody, "PATCH", token);
  return response;
};

export const abandonedCreateApi = async (sendTime: string, discount: string, expireTime: string,isActive: boolean,token: string) => {
  const response = await apiCores(`/abandoned-cart-setting/`, { hours_after_email_is_sent:sendTime,discount_to_be_given_in_percent:discount,hours_after_email_cart_is_emptied:expireTime, is_active: isActive }, "POST", token);
  return response;
};
