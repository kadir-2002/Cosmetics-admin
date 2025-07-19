import { apiCoreNode } from "@/APISFolder/APICoreNode";
import { apiCoreDelete } from "./apiCoreDelete";
import { apiCoreFormData } from "./apiCoreFormData";
import { apiCoreGet } from "./apiCoreGet";
import { apiCoreUpdateuser } from "./apiCoreUpdateuser";

export const createGalleryApi = async (
  sequence_number: string,
  image: File | null | any,
  types: string,
  isActive: boolean,
  token: string,
) => {

  const formData = new FormData(); 
  formData.append("sequence_number", sequence_number);
  if (image) {
    formData.append("image", image);
  }
  formData.append("section", types);
  formData.append("is_active", isActive.toString());
  // formData.append("created_by", created_by.toString());
  const response = await apiCoreFormData("/galleryitem/", formData, "POST", token);
  console.log(response,"response create")
  return response;

};
export const galleryAllDataApi = async (
  params: { ordering: string; isActive?: boolean; page?: number; page_size?: number },
  token: string
) => {
  const queryParams = new URLSearchParams();

  if (params.ordering) {
    queryParams.append("ordering", params.ordering);
  }
  if (params.isActive !== undefined) {
    queryParams.append("is_active", params.isActive.toString());
  }
  if (params.page) {
    queryParams.append("page", params.page.toString());
  }
  if (params.page_size) {
    queryParams.append("page_size", params.page_size.toString());
  }

  const endpoint = `/galleryitem/?${queryParams.toString()}`;
  const response = await apiCoreNode(endpoint,{}, "GET", token);
  return response;
};


export const galleryDeleteApi = async (id: any, token: string) => {
  const response = await apiCoreNode(`/galleryitem/${id}/`,{},"DELETE", token);
  return response;
};

export const galleryUpdatedApi = async (
  id: string,
  sequence_number: string,
  image: File | null | any,
  types:string,
  isActive: boolean,
  token: string
) => {
  const formData = new FormData();
  formData.append("sequence_number", sequence_number);
  if (image) {
    formData.append("image", image);
  }
  formData.append("section", types);
  formData.append("is_active", isActive.toString());
  // formData.append("updated_by", updated_by);

  const response = await apiCoreUpdateuser(`/galleryitem/${id}/`, formData, "PATCH", token,);
  console.log(formData,"galleryitem  galleryApi")
  console.log(response,"response update")
  return response;
};

