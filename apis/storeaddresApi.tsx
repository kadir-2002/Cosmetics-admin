import { apiCoreNode } from "@/APISFolder/APICoreNode";
import { apiCores } from "./apiCore";
import { apiCoreDelete } from "./apiCoreDelete";
import { apiCoreFormData } from "./apiCoreFormData";
import { apiCoreGet } from "./apiCoreGet";
import { apiCoreUpdate } from "./apiCoreUpdate";

export const addressAllDataApi = async (apiParams: {
  current_page: number;
  page_size: number;
  ordering: string;
  isActive?: boolean;
  token: string;
  search?:string;
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

  if (apiParams?.ordering) {
    queryParams.append("ordering", apiParams?.ordering);
  }
  const endpoint = `/store/?${queryParams}`;
  const response = await apiCoreGet(endpoint, "GET", apiParams?.token);
  return response;
};

export const addresDeleteApi = async (id: any, token: string) => {
  const response = await apiCoreNode(`/store/${id}/`,{},"DELETE", token);
  return response;
};
export const storeUpdatedApi = async (
  id: string,
  name: string,
  email: string,
  phone_numbers: string,
  address: string,
  locality: string,
  city: string,
  state: string,
  country: string,
  is_active: boolean,
  zipcode: string,
  latitude: string,
  longitude: string,
  token: string
) => {
  const requestBody = {
    name: name,
    email: email,
    phone_numbers: phone_numbers,
    address: address,
    locality: locality,
    city: city,
    state: state,
    country: country,
    is_active: is_active,
    zipcode: zipcode,
    latitude: latitude,
    longitude: longitude,
  };
  const response = await apiCoreUpdate(
    `/store/${id}/`,
    "",
    requestBody,
    "PATCH",
    token
  );
  return response;
};

export const storeCreateApi = async (
  name: string,
  email: string,
  phone_numbers: string,
  address: string,
  locality: string,
  city: string,
  state: string,
  country: string,
  is_active: boolean,
  zipcode: string,
  latitude: string,
  longitude: string,
  token: string
) => {
  const response = await apiCores(
    `/store/`,
    {
      name: name,
      email: email,
      phone_numbers: phone_numbers,
      address: address,
      locality: locality,
      city: city,
      state: state,
      country: country,
      is_active: is_active,
      zipcode: zipcode,
      latitude: latitude,
      longitude: longitude,
    },
    "POST",
    token
  );
  return response;
};
///////csv upload APi

// export const storeCSVUploADApi = async (excel_file:  File | null | any,token: string) => {
//   const formData = new FormData();
//   formData.append("file", excel_file);
//   const response = await apiCoreFormData(`/store/csv-upload`,formData,"POST",token);
//   return response;
// };

export const storeCSVUploADApi = async (excel_file: File, token: string) => {
  const formData = new FormData();
  formData.append("file", excel_file);

  const response = await apiCoreFormData(
    `/store/csv-upload`,
    formData,
    "POST",
    token
  );

  return response;
};



