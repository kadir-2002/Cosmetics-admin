import { apiCoreNode } from "@/APISFolder/APICoreNode";
import { apiCoreDelete } from "./apiCoreDelete";
import { apiCoreFormData } from "./apiCoreFormData";
import { apiCoreGet } from "./apiCoreGet";
import { apiCoreUpdateuser } from "./apiCoreUpdateuser";

export const categryAllDataApi = async (params: {
  search?: string;
  category?: string;
  current_page: number;
  page_size: number;
  token: string;
  ordering: string;
  filtervalue?: boolean;

}) => {
  const queryParams = new URLSearchParams({
    page: params.current_page.toString(),
    page_size: params.page_size.toString(),
  });
  if (params.search) {
    queryParams.append("search", params.search);
  } else if (params.ordering) {
    queryParams.append("ordering", params.ordering);
  }
  if (params.filtervalue !== undefined) {
    queryParams.append("isDeleted", params.filtervalue.toString());
  }
  const endpoint = `/category`;
  const response = await apiCoreNode(endpoint, {},"GET");
  return response;
};

export const createCategryApi = async (
  sequence_number: string,
  name: string,
  image: string,
  banner: string,
  token: string
) => {
  const formData = new FormData();
  formData.append("sequence_number", sequence_number);
  formData.append("name", name);

  if (image) {
    formData.append("image", image);
  }
  if (banner) {
    formData.append("banner", banner);
  }
  const response = await apiCoreFormData(
    "/category",
    formData,
    "POST",
    token
  );
  return response;
};

export const categoryDeleteApi = async (id: any, token: string) => {
  const response = await apiCoreDelete(`/category/${id}`, token);
  return response;
};
export const categryUpdatedApi = async (
  id: string,
  sequence_number: string,
  name: string,
  image: string,
  banner: string,
  token: string
) => {
  const formData = new FormData();
  formData.append("sequence_number", sequence_number);
  formData.append("name", name);

  if (image) {
    formData.append("image", image);
  }
  if (banner) {
    formData.append("banner", banner);
  }

  console.log("formdata update:");
for (const pair of formData.entries()) {
  console.log(`${pair[0]}:`, pair[1]);
}
  const response = await apiCoreUpdateuser(
    `/category/${id}`,
    formData,
    "PATCH",
    token
  );
  return response;
};

// sub-categry api
export const subCategryAlldataApi = async (id: any, token: string) => {
  const response = await apiCoreGet(
    `/product-category/?parent_category=${id}`,
    "GET",
    token
  );
  return response;
};
export const createSubCategryApi = async (
  sequence_number: string,
  name: string,
  title: string,
  heading: string,
  description: string,
  seo_description: string,
  seo_title:string,
  seo_data:string,
  seo_keyword:string,
  parent_catgeory: number,
  image: string,
  banner: string,
  isDeleted: boolean,
  created_by: number,
  token: string
) => {
  const formData = new FormData();
  formData.append("sequence_number", sequence_number);
  formData.append("title", title);
  formData.append("heading", heading);
  formData.append("name", name);
  formData.append("seo_description", seo_description);
  formData.append("description", description);
  formData.append("seo_title", seo_title);
  formData.append("seo_data", seo_data);
  formData.append("seo_keyword", seo_keyword);
  formData.append("parent_category", parent_catgeory.toString());
  if (image) {
    formData.append("image", image);
  }
  if (banner) {
    formData.append("banner", banner);
  }
  formData.append("isDeleted", isDeleted.toString());
  const response = await apiCoreUpdateuser(
    "/product-category/",
    formData,
    "POST",
    token
  );
  return response;
};
export const updateSubCategryApi = async (
  id: string,
  sequence_number: string,
  name: string,
  title: string,
  heading: string,
  description: string,
  seo_description: string,
  seo_title:string,
  seo_data:string,
  seo_keyword:string,
  parent_catgeory: number,
  image: string,
  banner: string,
  isDeleted: boolean,
  created_by: number,
  token: string
) => {
  const formData = new FormData();
  formData.append("sequence_number", sequence_number);
  formData.append("title", title);
  formData.append("heading", heading);
  formData.append("name", name);
  formData.append("seo_description", seo_description);
  formData.append("seo_title", seo_title);
  formData.append("seo_data", seo_data);
  formData.append("seo_keyword", seo_keyword);
  formData.append("description", description);
  formData.append("parent_catgory", parent_catgeory.toString());
  if (image) {
    formData.append("image", image);
  }
  if (banner) {
    formData.append("banner", banner);
  }
  formData.append("isDeleted", isDeleted.toString());

  const response = await apiCoreUpdateuser(
    `/product-category/${id}/`,
    formData,
    "PATCH",
    token
  );
  return response;
};
export const subcategoryDeleteApi = async (id: any, token: string) => {
  const response = await apiCoreDelete(`/product-category/${id}/`, token);
  return response;
};
