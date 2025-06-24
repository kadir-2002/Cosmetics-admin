import { apiCoreNode } from "@/APISFolder/APICoreNode";
import { apiCoreDelete } from "./apiCoreDelete";
import { apiCoreFormData } from "./apiCoreFormData";
import { apiCoreUpdateuser } from "./apiCoreUpdateuser";

export const createBannerApi = async (
  sequence_number: string,
  heading: string,
  sub_heading:string,
  description: string,
  image: File | null | any,
  mobile_banner: File | null | any,
  isActive: boolean,
  button:string,
  button_link:string,
  created_by: any,
  token: string,
) => {

  const formData = new FormData();
  formData.append("sequence_number", sequence_number);
  formData.append("heading", heading);
  formData.append("sub_heading", sub_heading);
  if(mobile_banner){
    formData.append("mobile_banner", mobile_banner);
  }
  formData.append("description", description);
  formData.append("button_text", button);
  formData.append("button_link", button_link);
  if (image) {
    formData.append("image", image);
  }
  formData.append("is_active", isActive.toString());
  formData.append("created_by", created_by.toString());
  const response = await apiCoreFormData("/frontend/banner/", formData, "POST", token);
  return response;

};
export const bannerAllDataApi = async (params: {ordering: string, isActive?: boolean }, token: string) => {
  const queryParams = new URLSearchParams
  if (params.ordering) {
    queryParams.append("ordering", params.ordering);
  }
  if (params.isActive !== undefined) {
    queryParams.append("is_active", params.isActive.toString());
  }
  const endpoint = `/banners/?${queryParams.toString()}`;
  const response = await apiCoreNode(endpoint, {}, "GET", token);
  return response;
};

export const bannerDeleteApi = async (id: any, token: string) => {
  const response = await apiCoreDelete(`/frontend/banner/${id}/`, token);
  return response;
};

export const bannerUpdatedApi = async (
  id: string,
  sequence_number: string,
  heading: string,
  sub_heading:string,
  description: string,
  image: File | null | any,
  mobile_banner:File | null |any,
  isActive: boolean,
  button:string,
  button_link:string,
  updated_by: any,
  token: string
) => {
  const formData = new FormData();
  formData.append("sequence_number", sequence_number);
  formData.append("heading", heading);
  formData.append("sub_heading", sub_heading);
  formData.append("description", description);
  formData.append("button_text", button);
  formData.append("button_link", button_link);
  if (image) {
    formData.append("image", image);
  }
  if(mobile_banner){
    formData.append("mobile_banner", mobile_banner);
  }
  formData.append("is_active", isActive.toString());
  formData.append("updated_by", updated_by);

  const response = await apiCoreUpdateuser(`/frontend/banner/${id}/`, formData, "PATCH", token,);
  return response;
};


