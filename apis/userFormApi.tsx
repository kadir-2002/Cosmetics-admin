import { apiCoreNode } from "@/APISFolder/APICoreNode";
import { apiCoreDelete } from "./apiCoreDelete";
import { apiCoreFormData } from "./apiCoreFormData";
import { apiCoreGet } from "./apiCoreGet";
import { apiCoreUpdateuser } from "./apiCoreUpdateuser";

export const createUserApi = async (
  password: string,
  firstName: string,
  lastName: string,
  phone_number: string,
  email: string,
  county_code: any,
  profile_picture: File | null | any,
  isActive: boolean,
  category: string,
  token: string
) => {

  const formData = new FormData();
  formData.append("password", password);
  formData.append("first_name", firstName);
  formData.append("last_name", lastName);
  // if (phone_number) {
  //   formData.append("phone_number", phone_number);
  // } else {
  //   formData.append("phone_number", "");
  // }

  formData.append("email", email);
  // if (phone_number) {
  //   formData.append("country_code_for_phone_number", county_code);
  // } else {
  //   formData.append("country_code_for_phone_number", "");
  // }
  formData.append("role", category);
  if (profile_picture) {
    formData.append("profile_picture", profile_picture);
  }

  formData.append("is_active", isActive.toString());
  const response = await apiCoreFormData("/admin/create/", formData, "POST", token);
  return response;

};

export const userAllDataApi = async (params: { search?: string; category?: any; current_page: number; page_size: number, is_active?: boolean, token: string, isActiveInactive?: boolean, ordering?: string }) => {
  const queryParams = new URLSearchParams({
    page: params.current_page.toString(),
    page_size: params.page_size.toString(),
  });
  if (params.search) {
    queryParams.append("search", params.search);
  } else if (params.category) {
    queryParams.append("category", params.category?.id);
  }

  if (params.is_active !== undefined) {
    queryParams.append("is_active", params.is_active.toString());
  }

  if (params.isActiveInactive !== undefined) {
    queryParams.append("is_active", params.isActiveInactive.toString());
  }

  if (params.ordering) {
    queryParams.append("ordering", params.ordering);
  }

  const endpoint = `/admin/adminlist/?${queryParams.toString()}`;
  const response = await apiCoreNode(endpoint, {},"GET", params?.token);
  return response;
};

export const userDeleteApi = async (id: any, token: string) => {
  const response = await apiCoreNode(`/admin/delete/${id}/`,{},"DELETE" ,token);
  return response;
};

export const userUpdatedApi = async (
  id: string,
  firstName: string,
  lastName: string,
  phone_number: string,
  email: string,
  county_code: any,
  profile_picture: string,
  is_active: boolean,
  category: string,
  token: string
) => {
  const formData = new FormData();
  formData.append("firstName", firstName);
  formData.append("lastName", lastName);
  formData.append("is_active",is_active.toString() );
  
  // if (phone_number) {
  //   formData.append("phone_number", phone_number);
  // } else {
  //   formData.append("phone_number", "");
  // }
  formData.append("email", email);
  if (phone_number) {
    formData.append("country_code_for_phone_number", county_code);
  }

  formData.append("role", category);

  if (profile_picture) {
    formData.append("image", profile_picture);
  }
  const response = await apiCoreUpdateuser(`/admin/update/${id}/`, formData, "PATCH", token);
  return response;
};

export const roleDataApi = async (token: string) => {
  const response = await apiCoreGet("/user/role/?is_active=true", "GET", token);
  return response;
};

export const roleFilterDataApi = async (token: string) => {
  const response = await apiCoreGet("/user/role/", "GET", token);
  return response;
};


export const userFilterApi = async (params: { is_active: boolean, token: string }) => {
  const queryParams = new URLSearchParams({
    is_active: params.is_active.toString(),
  });
  const endpoint = `/user/panel/?${queryParams.toString()}`;
  const response = await apiCoreGet(endpoint, "GET", params?.token);
  return response;
};
