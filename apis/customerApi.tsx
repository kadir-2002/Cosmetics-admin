import { apiCoreNode } from "@/APISFolder/APICoreNode";
import { apiCores } from "./apiCore";
import { apiCoreDelete } from "./apiCoreDelete";
import { apiCoreFormData } from "./apiCoreFormData";
import { apiCoreGet } from "./apiCoreGet";
import { apiCoreUpdateuser } from "./apiCoreUpdateuser";

export const createCustomerApi = async (
  password: string,
  firstName: string,
  lastName: string,
  phone_number: string,
  email: string,
  profile_picture: File | null | any,
  isActive: boolean,
) => {

  const formData = new FormData();
  formData.append("password", password);
  formData.append("first_name", firstName);
  formData.append("last_name", lastName);
  formData.append("phone_number", phone_number);
  formData.append("email", email);

  if (profile_picture) {
    formData.append("profile_picture", profile_picture);
  }

  formData.append("is_active", isActive.toString());
  const response = await apiCoreFormData("/user/customer/", formData, "POST");
  return response;

};

export const customerAllDataApi = async (searchParams: { search: string; total_pages: number;startDates?: string, endDates: string, current_page: number; page_size: number, is_active?: boolean, id: number, ordering: string, token: string, isActiveInactive?: boolean }) => {
  let endpoint
  if (searchParams.id) {
    endpoint = `/user/customer/${searchParams.id}/`;
  } else {
    const queryParams = new URLSearchParams({
      page: searchParams.current_page.toString(),
      page_size: searchParams.page_size.toString(),
    });
    if (searchParams.is_active === undefined) {
      if (searchParams.startDates &&searchParams.startDates ) {
        queryParams.append("start_date", searchParams.startDates.toString());
        queryParams.append("end_date", searchParams.endDates.toString());
      }
    }
   
    if (searchParams.search) {
      queryParams.append("search", searchParams.search.toString());
    }
    if (searchParams.isActiveInactive !== undefined) {
      queryParams.append("is_active", searchParams.isActiveInactive.toString());
    }
    if (searchParams.ordering !== undefined) {
      queryParams.append("ordering", searchParams.ordering.toString());
    }
    if (searchParams.is_active !== undefined) {
      queryParams.append("is_active", searchParams.is_active.toString());
    }
    endpoint = `/admin/userlist/?${queryParams}`;
  }
 
  const response = await apiCoreNode(endpoint, {},"GET", searchParams.token);
  return response;
};

export const SinglecustomerAllOrderDataApi = async (searchParams: { total_pages: number; current_page: number; page_size: number, id: number, token: string, isfiltervalue: string, SingleCustomerDateSorting: string }) => {

  const queryParams = new URLSearchParams({
    customer: searchParams.id.toString(),
    page: searchParams.current_page.toString(),
    page_size: searchParams.page_size.toString(),
    ordering: searchParams.SingleCustomerDateSorting.toString(),
    order_status: searchParams.isfiltervalue.toString()

  });
  const endpoint = `/order/get-orders/?${queryParams}`;
  const response = await apiCoreNode(endpoint, {},"GET", searchParams.token);
  return response;
};


export const customerDeleteApi = async (id: any) => {
  const response = await apiCoreDelete(`/user/customer/${id}/`, "DELETE");
  return response;
};

export const customerUpdatedApi = async (
  id: string,
  firstName: string,
  lastName: string,
  phone_number: string,
  email: string,
  profile_picture: string,
  isActive: boolean,
  token: string
) => {
  const formData = new FormData();
  formData.append("first_name", firstName);
  formData.append("last_name", lastName);
  formData.append("phone_number", phone_number.toString());
  formData.append("email", email);
  if (profile_picture) {
    formData.append("profile_picture", profile_picture);
  }

  formData.append("is_active", isActive.toString());
  const response = await apiCoreUpdateuser(`/user/customer/${id}/`, formData, "PATCH", token);
  return response;
};

export const safeApiGet = async (
  endpoint: string,
  token: string | null = null
) => {
  return await apiCoreNode(endpoint, {}, "GET", token);
};

export const addressApi = async (id: any, token: string) => {
  const endpoint = `/address/user/${id}`;
  return await safeApiGet(endpoint, token);
};

export const customerAddresDeleteApi = async (id: any, user: any) => {
  const response = await apiCoreDelete(`/user/customer-address/${id}/?customer=${user}`, "DELETE");
  return response;
};
export const addresCreateApi = async (customer: any, address: string, locality: string, city: string, state: string, country: string, zipcode: string, created_by: any) => {
  const response = await apiCores("/user/customer-address/", { customer: customer, address: address, locality: locality, city: city, state: state, country: country, zipcode: zipcode, created_by: created_by }, "POST")
  return response;
}
export const updateAddresApi = async (id: any, customer: any, address: string, locality: string, city: string, state: string, country: string, zipcode: string, created_by: any) => {
  const response = await apiCores(`/user/customer-address/${id}/?customer=${customer}`, { id: id, user: customer, address: address, locality: locality, city: city, state: state, country: country, zipcode: zipcode, created_by: created_by }, "PATCH")
  return response;
} 
