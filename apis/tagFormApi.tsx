import { apiCoreNode } from "@/APISFolder/APICoreNode";
import { apiCores } from "./apiCore";
import { apiCoreDelete } from "./apiCoreDelete";
import { apiCoreGet } from "./apiCoreGet";
import { apiCoreUpdate } from "./apiCoreUpdate";

export const tagAllDataApi = async (searchParams: { page: number; page_size: number ,token:string}) => {

    const queryParams = new URLSearchParams({
      page: String(searchParams.page),
      page_size: String(searchParams.page_size),
    }).toString();

      const response = await apiCoreGet(`/product-tag/?${queryParams}`, "GET",searchParams.token);
      return response; 
  };
  
export const createTagApi = async (name: string,is_active:boolean, created_by: number,token:string) => {
  const response = await apiCores("/product-tag/", { name: name, is_active:is_active ,created_by:created_by }, "POST",token);
  return response;
};

export const tagDeleteApi = async (id: any,token:string) => {
  const response = await apiCoreNode(`/product-tag/${id}/`,{},"DELETE", token);
  return response;
};
export const tagUpdatedApi = async (id:string,name: string,is_active:boolean, created_by: number,token:string)=> {
  const requestBody = {
    name: name,
    is_active:is_active,
    created_by:created_by
  };
  const response = await apiCoreUpdate(`/product-tag/${id}/`, "", requestBody, "PATCH",token);
  return response;
};
