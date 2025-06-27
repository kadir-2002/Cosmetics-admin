import { apiCoreNode } from "@/APISFolder/APICoreNode";
import { apiCores } from "./apiCore";
import { apiCoreDelete } from "./apiCoreDelete";
import { apiCoreGet } from "./apiCoreGet";
import { apiCoreUpdate } from "./apiCoreUpdate";

export const gallerysectionAllDataApi = async (token:string) => {

      const response = await apiCoreNode(`/gallerytype`,{}, "GET",token);
      return response; 
  };
  
export const createGallerysectionApi = async (name: string, created_by: number,token:string) => {
  const response = await apiCoreNode("/gallerytype", { name: name,  created_by:created_by }, "POST",token);
  return response;
};

export const gallerysectionDeleteApi = async (id: any,token:string) => {
  const response = await apiCoreNode(`/gallerytype/${id}/`,{},'DELETE', token);
  return response;
};
export const gallerysectionUpdatedApi = async (id:string,name: string, created_by: number,token:string)=> {
  const requestBody = {
    name: name,
    created_by:created_by
  };
  const response = await apiCoreNode(`/gallerytype/${id}/`, requestBody, "PATCH",token);
  return response;
};