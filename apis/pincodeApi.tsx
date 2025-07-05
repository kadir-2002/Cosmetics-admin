import { apiCoreNode } from "@/APISFolder/APICoreNode";
import { apiCores } from "./apiCore";
import { apiCoreDelete } from "./apiCoreDelete";
import { apiCoreFormData } from "./apiCoreFormData";
import { apiCoreGet } from "./apiCoreGet";
import { apiCoreUpdate } from "./apiCoreUpdate";

export const pincodeAllDataApi = async (apiParams: {
  ordering: string;
  search?: string;
  filtervalue?: boolean;
  current_page: number;
  page_size: number;
  isActive?: boolean;
  token: string;
}) => {
  const queryParams = new URLSearchParams({
    page: apiParams.current_page.toString(),
    page_size: apiParams.page_size.toString(),
  });

  if (apiParams.isActive !== undefined) {
    queryParams.append("is_active", apiParams?.isActive.toString());
  }
  if (apiParams?.search) {
    queryParams.append("search", apiParams.search);
  }
  if (apiParams.filtervalue!==undefined) {
    queryParams.append("is_active", apiParams.filtervalue.toString());
  }
  const endpoint = `/pincode/?${queryParams}`;
  const response = await apiCoreGet(endpoint, "GET", apiParams.token);
  return response;
};

export const pinCodeDeleteApi = async (id: any, token: string) => {
  const response = await apiCoreDelete(`/pincode/${id}/`, token);
  return response;
};
export const pinCodeUpdatedApi = async (
  id: string,
  state: string,
  city: string,
  is_active: boolean,
  zipcode: string,
  token: string
) => {
  const requestBody = {
    city: city,
    state: state,
    is_active: is_active,
    zipcode: zipcode,
  };
  const response = await apiCoreUpdate(
    `/pincode/${id}/`,
    "",
    requestBody,
    "PATCH",
    token
  );
  return response;
};

export const pinCodeCreateApi = async (
  state: string,
  city: string,
  zipcode: string,
  estimated_delivery_days:number,
  is_active: boolean,
  id:string,
  token: string
) => {
  const response = await apiCoreNode(
    `/pincode/`,
    { city: city, state: state, is_active: is_active, zipcode: Number(zipcode) ,estimated_delivery_days:Number(estimated_delivery_days),created_by:"ADMIN"},
    "POST",
    token
  );
  return response;
};


///////csv upload APi

export const pincodeCSVUploadApi = async (excel_file:  File | null | any,token: string) => {
  const formData = new FormData();
  formData.append("file", excel_file);
  const response = await apiCoreFormData(`/pincode/upload-csv/`,formData,"POST",token);
  return response;
};