import { apiCoreDelete } from "./apiCoreDelete";
import { apiCoreFormData } from "./apiCoreFormData";
import { apiCoreGet } from "./apiCoreGet";
import { apiCoreUpdateuser } from "./apiCoreUpdateuser";

export const testimonialAllDataApi = async (params: {
  search?: string;
  category?: string;
  current_page: number;
  page_size: number;
  token: string;
  ordering: string;
  filtervalue?: boolean;
}) => {
  const queryParams = new URLSearchParams({
    // page: params.current_page.toString(),
    // page_size: params.page_size.toString(),
  });
  if (params.search) {
    queryParams.append("search", params.search);
  } else if (params.ordering) {
    queryParams.append("ordering", params.ordering);
  }
  if (params.filtervalue !== undefined) {
    queryParams.append("is_active", params.filtervalue.toString());
  }
  const endpoint = `/frontend/testimonial/?${queryParams.toString()}`;
  const response = await apiCoreGet(endpoint, "GET", params?.token);
  return response;
};

export const createtesTimonialApi = async (
  name: string,
  description: string,
  role: string,
  image: string,
  is_active: boolean,
  token: string
) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("testimonial", description);
  if (image) {
    formData.append("profile_picture", image);
  }
  formData.append("designation", role);
  formData.append("is_active", is_active.toString());
  const response = await apiCoreFormData(
    "/frontend/testimonial/",
    formData,
    "POST",
    token
  );
  return response;
};

export const testimonialDeleteApi = async (id: any, token: string) => {
  const response = await apiCoreDelete(`/frontend/testimonial/${id}/`, token);
  return response;
};
export const testimonialUpdatedApi = async (
  id: string,
  name: string,
  description: string,
  image: string,
  role: string,
  is_active: boolean,
  token: string
) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("testimonial", description);
  if (image) {
    formData.append("profile_picture", image);
  }
  formData.append("designation", role);
  formData.append("is_active", is_active.toString());

  const response = await apiCoreUpdateuser(
    `/frontend/testimonial/${id}/`,
    formData,
    "PATCH",
    token
  );
  return response;
};
