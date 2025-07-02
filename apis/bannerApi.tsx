import { apiCoreNode } from "@/APISFolder/APICoreNode";
import { apiCoreDelete } from "./apiCoreDelete";
import { apiCoreFormData } from "./apiCoreFormData";
import { apiCoreUpdateuser } from "./apiCoreUpdateuser";

export const createBannerApi = async (
  sequence_number: string,
  heading: string,
  subheading:string,
 subheading2: string,
  imageUrl: File | null | any,
  mobile_banner: File | null | any,
  isActive: boolean,
  buttonText:string,
  buttonLink:string,
  token: string,
) => {

  const formData = new FormData();
  formData.append("sequence_number", sequence_number);
  formData.append("heading", heading);
  formData.append("subheading", subheading);
  if(mobile_banner){
    formData.append("mobile_banner", mobile_banner);
  }
  formData.append("subheading2", subheading2);
  formData.append("buttonText", buttonText);
  formData.append("buttonLink", buttonLink);
  if (imageUrl) {
    formData.append("image", imageUrl);
  }
  formData.append("isActive", isActive.toString());
  const response = await apiCoreFormData("/banners", formData, "POST", token);
  return response;

};
export const bannerAllDataApi = async (params: {ordering: string, isActive?: boolean }, token: string) => {
  const queryParams = new URLSearchParams
  if (params.ordering) {
    queryParams.append("ordering", params.ordering);
  }
  if (params.isActive !== undefined) {
    queryParams.append("isActive", params.isActive.toString());
  }
  const endpoint = `/banners?${queryParams.toString()}`;
  const response = await apiCoreNode(endpoint, {}, "GET", token);
  return response;
};

export const bannerDeleteApi = async (id: any, token: string) => {
  const response = await apiCoreNode(`/banners/${id}`,{},"DELETE", token);
  console.log(response,"bannerData")
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
  button_text:string,
  button_link:string,
  token: string
) => {
  const formData = new FormData();
  formData.append("sequence_number", sequence_number);
  formData.append("heading", heading);
  formData.append("subheading", sub_heading);
  formData.append("subheading2", description);
  formData.append("buttonText", button_text);
  formData.append("buttonLink", button_link);
  if (image) {
    formData.append("imageUrl", image);
  }
  if(mobile_banner){
    formData.append("mobile_banner", mobile_banner);
  }
  formData.append("isActive", isActive.toString());

  const response = await apiCoreUpdateuser(`/banners/${id}`, formData, "PATCH", token,);
  return response;
};


