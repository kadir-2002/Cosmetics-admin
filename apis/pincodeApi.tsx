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
  const endpoint = `/mainapp/pincode/?${queryParams}`;
  const response = await apiCoreGet(endpoint, "GET", apiParams.token);
  return response;
};

export const pinCodeDeleteApi = async (id: any, token: string) => {
  const response = await apiCoreDelete(`/mainapp/pincode/${id}/`, token);
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
    `/mainapp/pincode/${id}/`,
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
  is_active: boolean,
  zipcode: string,
  token: string
) => {
  const response = await apiCores(
    `/mainapp/pincode/`,
    { city: city, state: state, is_active: is_active, zipcode: zipcode },
    "POST",
    token
  );
  return response;
};


///////csv upload APi

export const pincodeCSVUploadApi = async (excel_file:  File | null | any,token: string) => {
  const formData = new FormData();
  formData.append("excel_file", excel_file);
  const response = await apiCoreFormData(`/mainapp/upload_pincode_data_excel/`,formData,"POST",token);
  return response;
};