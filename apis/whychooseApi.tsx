import { apiCoreNode } from "@/APISFolder/APICoreNode";
import { apiCoreDelete } from "./apiCoreDelete";
import { apiCoreFormData } from "./apiCoreFormData";
import { apiCoreGet } from "./apiCoreGet";
import { apiCoreUpdateuser } from "./apiCoreUpdateuser";

export const createWhyChooseUsApi = async (
  sequence_number: string,
  heading: string,
  description: string,
  image: File | null | any,
  isActive: boolean,
  created_by: any,
  token: string,
) => {

  const formData = new FormData();
  formData.append("sequenceNumber", sequence_number);
  formData.append("heading", heading);
  formData.append("description", description);
  if (image) {
    formData.append("image", image);
  }
  formData.append("isActive", isActive.toString());
  const response = await apiCoreFormData("/why-choose-us/", formData, "POST", token);
  return response;

};
export const whychooseusAllDataApi = async (params: {ordering: string, isActive?: boolean }, token: string) => {
  const queryParams = new URLSearchParams
  if (params.ordering) {
    queryParams.append("ordering", params.ordering);
  }
  if (params.isActive !== undefined) {
    queryParams.append("is_active", params.isActive.toString());
  }
  const endpoint = `/why-choose-us/?${queryParams.toString()}`;
  const response = await apiCoreNode(endpoint, {},"GET");
  return response;
};

export const whyChooseUsDeleteApi = async (id: any, token: string) => {
  const response = await apiCoreNode(`/why-choose-us/${id}/`,{},"DELETE" ,token);
  return response;
};

export const whyChooseUsUpdatedApi = async (
  id: string,
  sequence_number: string,
  heading: string,
  description: string,
  image: File | null | any,
  isActive: boolean,
  updated_by: any,
  token: string
) => {
  const formData = new FormData();
  formData.append("sequenceNumber", sequence_number);
  formData.append("heading", heading);
  formData.append("description", description);
  if (image) {
    formData.append("image", image);
  }
  formData.append("isActive", isActive.toString());

  const response = await apiCoreUpdateuser(`/frontend/whychooseus/${id}/`, formData, "PATCH", token,);
  return response;
};


