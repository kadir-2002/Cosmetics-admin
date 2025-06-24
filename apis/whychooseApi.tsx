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
  formData.append("sequence_number", sequence_number);
  formData.append("heading", heading);
  formData.append("description", description);
  if (image) {
    formData.append("image", image);
  }
  formData.append("is_active", isActive.toString());
  formData.append("created_by", created_by.toString());
  const response = await apiCoreFormData("/frontend/whychooseus/", formData, "POST", token);
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
  const endpoint = `/frontend/whychooseus/?${queryParams.toString()}`;
  const response = await apiCoreGet(endpoint, "GET", token);
  return response;
};

export const whyChooseUsDeleteApi = async (id: any, token: string) => {
  const response = await apiCoreDelete(`/frontend/whychooseus/${id}/`, token);
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
  formData.append("sequence_number", sequence_number);
  formData.append("heading", heading);
  formData.append("description", description);
  if (image) {
    formData.append("image", image);
  }
  formData.append("is_active", isActive.toString());
  formData.append("updated_by", updated_by);

  const response = await apiCoreUpdateuser(`/frontend/whychooseus/${id}/`, formData, "PATCH", token,);
  return response;
};


