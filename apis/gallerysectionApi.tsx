import { apiCores } from "./apiCore";
import { apiCoreDelete } from "./apiCoreDelete";
import { apiCoreGet } from "./apiCoreGet";
import { apiCoreUpdate } from "./apiCoreUpdate";

export const gallerysectionAllDataApi = async (token:string) => {

      const response = await apiCoreGet(`/frontend/gallery_section/?`, "GET",token);
      return response; 
  };
  
export const createGallerysectionApi = async (name: string, created_by: number,token:string) => {
  const response = await apiCores("/frontend/gallery_section/", { name: name,  created_by:created_by }, "POST",token);
  return response;
};

export const gallerysectionDeleteApi = async (id: any,token:string) => {
  const response = await apiCoreDelete(`/frontend/gallery_section/${id}/`, token);
  return response;
};
export const gallerysectionUpdatedApi = async (id:string,name: string, created_by: number,token:string)=> {
  const requestBody = {
    name: name,
    created_by:created_by
  };
  const response = await apiCoreUpdate(`/frontend/gallery_section/${id}/`, "", requestBody, "PATCH",token);
  return response;
};
