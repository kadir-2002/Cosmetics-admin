import { apiCoreNode } from "@/APISFolder/APICoreNode";
import { apiCores } from "./apiCore";
import { apiCoreDelete } from "./apiCoreDelete";
import { apiCoreFormData } from "./apiCoreFormData";
import { apiCoreGet } from "./apiCoreGet";
import { apiCoreUpdate } from "./apiCoreUpdate";
import { apiCoreUpdateuser } from "./apiCoreUpdateuser";

export const createBlogApi = async (
  title: string,
  content: string,
  image: File | null | any,
  category: string,
  author: string,
  publish_date: string,
  image_alternate_text: string,
  seo_title: string,
  seo_metadata: string,
  tagjoints:number[],
  seofocuskeywordjoints:number[],
  isActive: boolean,
  created_by: any,
  token: string
) => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  if (image) {
    formData.append("image", image);
  }
  formData.append("image_alternate_text", image_alternate_text);
  formData.append("seo_title", seo_title);
  formData.append("seo_metadata", seo_metadata);
  formData.append("product_category", category);
  formData.append("author", author);
  formData.append("publish_date", publish_date);
  formData.append("tagjoints", JSON.stringify(tagjoints));
  formData.append("seofocuskeywordjoints", JSON.stringify(seofocuskeywordjoints));
  formData.append("is_active", isActive.toString());
  formData.append("created_by", created_by.toString());
  const response = await apiCoreFormData(
    "/blog/",
    formData,
    "POST",
    token
  );
  return response;
};
export const blogAllDataApi = async (params: {
  search?: string;
  category?: string;
  current_page: number;
  page_size: number;
  ordering: string;
  numbering: string;
  token: string;
  isActiveInactive?: boolean;
}) => {
  const queryParams = new URLSearchParams({
    page: params.current_page.toString(),
    page_size: params.page_size.toString(),
  });
  if (params.search) {
    queryParams.append("search", params.search);
  } else if (params.category) {
    queryParams.append("category", params.category);
  } else if (params.ordering) {
    queryParams.append("ordering", params.ordering);
  } else if (params.numbering) {
    queryParams.append("ordering", params.numbering);
  }
  if (params.isActiveInactive !== undefined) {
    queryParams.append("is_active", params.isActiveInactive.toString());
  }
  const endpoint = `/blog/?${queryParams.toString()}`;
  const response = await apiCoreGet(endpoint, "GET", params.token);
  return response;
};

export const blogDeleteApi = async (id: any, token: string) => {
  const response = await apiCoreNode(`/blog/${id}/`,{},"DELETE", token);
  return response;
};

export const blogUpdatedApi = async (
  id: string,
  title: string,
  content: string,
  image: File | null | any,
  category: string,
  author: string,
  publish_date: string,
  image_alternate_text: string,
  seo_title: string,
  seo_metadata: string,
  tagjoints:number [],
  seofocuskeywordjoints:number[],
  isActive: boolean,
  updated_by: any,
  token: string
) => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);

  if (image) {
    formData.append("image", image);
  }
  formData.append("product_category", category);
  formData.append("image_alternate_text", image_alternate_text);
  formData.append("seo_title", seo_title);
  formData.append("seo_metadata", seo_metadata);
  formData.append("author", author);
  formData.append("publish_date", publish_date);
  formData.append("tagjoints", JSON.stringify(tagjoints));
  formData.append("seofocuskeywordjoints", JSON.stringify(seofocuskeywordjoints));
  formData.append("is_active", isActive.toString());
  formData.append("updated_by", updated_by);
  const response = await apiCoreUpdateuser(
    `/blog/${id}/`,
    formData,
    "PATCH",
    token
  );
  return response;
};

//////blogtagapi//////
export const blogtagAllDataApi = async (searchParams: {
  page: number;
  page_size: number;
  token: string;
  searchText: string;
}) => {
  const queryParams = new URLSearchParams({
    search: searchParams.searchText.toString(),
    page: String(searchParams.page),
    page_size: String(searchParams.page_size),
  }).toString();
  const response = await apiCoreGet(
    `/blog/tag/?${queryParams}`,
    "GET",
    searchParams.token
  );
  return response;
};

export const createBlogTagApi = async (
  name: string,
  is_active:boolean,
  created_by: number,
  token: string
) => {
  const response = await apiCores(
    "/blog/tag/",
    { name: name,is_active:is_active, created_by: created_by },
    "POST",
    token
  );
  return response;
};

export const blogtagDeleteApi = async (id: any, token: string) => {
  const response = await apiCoreNode(`/blog/tag/${id}`,{id:Number(id)},"DELETE", token);
  return response;
};
export const blogtagUpdatedApi = async (
  id: string,
  name: string,
  is_active:boolean,
  created_by: number,
  token: string
) => {
  const requestBody = {
    name: name,
    is_active:is_active,
    created_by: created_by,
  };
  const response = await apiCoreUpdate(
    `/blog/tag/${id}`,
    "",
    requestBody,
    "PATCH",
    token
  );
  return response;
};

export const blogtagfetchdata = async (token: string) => {
  const response = await apiCoreNode(`/blog/tag/`,{},"GET",token);
  return response;
};

//////SEO key Word api//////

export const seoAllDataApi = async (searchParams: {
  page: number;
  page_size: number;
  token: string;
  searchText: string;
}) => {
  const queryParams = new URLSearchParams({
    search: searchParams.searchText.toString(),
    page: String(searchParams.page),
    page_size: String(searchParams.page_size),
  }).toString();
  const response = await apiCoreGet(
    `/blog/keyword/?${queryParams}`,
    "GET",
    searchParams.token
  );
  return response;
};

export const createSeoApi = async (
  name: string,
  created_by: number,
  token: string
) => {
  const response = await apiCores(
    "/blog/keyword/",
    { name: name, created_by: created_by, is_active:true },
    "POST",
    token
  );
  return response;
};

export const seoDeleteApi = async (id: any, token: string) => {
  const response = await apiCoreNode(
    `/blog/keyword/${id}/`,{},'DELETE',
    token
  );
  return response;
};
export const seoUpdatedApi = async (
  id: string,
  name: string,
  created_by: number,
  token: string
) => {
  const requestBody = {
    name: name,
    created_by: created_by,
  };
  const response = await apiCoreUpdate(
    `/blog/keyword/${id}/`,
    "",
    requestBody,
    "PATCH",
    token
  );
  return response;
};

export const seofetchdata = async (token: string) => {
  const response = await apiCoreNode(`/blog/keyword/`,{},"GET",token);
  return response;
};

//////////////blogcommentAllDataApi/////////

export const blogcommentAllDataApi = async (params: { product?: string; current_page: number; page_size: number,token:string }) => {
  const queryParams = new URLSearchParams({
    page: params.current_page.toString(),
    page_size: params.page_size.toString(),
  });
  if (params.product) {
    queryParams.append("blog", params.product);
  }
  const endpoint = `/frontend/blog-comment/?${queryParams.toString()}`;
  const response = await apiCoreGet(endpoint, "GET",params?.token);
  return response;
};