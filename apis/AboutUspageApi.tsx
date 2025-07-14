import { apiCoreNode } from "@/APISFolder/APICoreNode";
import { apiCoreDelete } from "./apiCoreDelete";
import { apiCoreFormData } from "./apiCoreFormData";
import { apiCoreGet } from "./apiCoreGet";
import { apiCoreUpdateuser } from "./apiCoreUpdateuser";

export const sectionAllDataApi = async (params: { token:string}) => {
  const response = await apiCoreGet(`/about_us_section/`, "GET" ,params?.token);
  return response;
};

export const createSectionApi = async (section_name:string,sequence_number: string, heading: string, sub_heading:string,description:string, image: string, isActive: boolean,token:string) => {

 const formData = new FormData();
 formData.append("section_name", section_name);
  formData.append("sequence_number", sequence_number);
  formData.append("heading", heading);
  formData.append("sub_heading", sub_heading);
  formData.append("description", description);
  if (image) {
    formData.append("image", image);
  }
  formData.append("is_active", isActive.toString());
  const response = await apiCoreFormData("/about_us_section/", formData, "POST", token);
  return response;
};

export const sectionDeleteApi = async (id: any,token:string) => {
  const response = await apiCoreNode(`/about_us_section/${id}/`,{},"DELETE", token);
  return response;
};
export const sectionUpdatedApi = async (section_name:string,id: string, sequence_number: string, heading: string, sub_heading:string,description:string, image: string, isActive: boolean,token:string) => {

   const formData = new FormData();
   formData.append("section_name", section_name);
   formData.append("sequence_number", sequence_number);
   formData.append("heading", heading);
   formData.append("sub_heading", sub_heading);
   formData.append("description", description);
   if (image) {
     formData.append("image", image);
   }
   formData.append("is_active", isActive.toString());
 
  const response = await apiCoreUpdateuser(`/about_us_section/${id}/`,formData, "PATCH",token);
  return response;
};


// Component api 
export const componentAlldataApi = async (id: any,token:string) => {
  const response = await apiCoreGet(`/about_us_component/?section_id=${id}`, "GET",token);
  return response;
}
export const createComponentApi = async (section: string,sequence_number:string,heading:string,sub_heading:string, description: string,image:string,is_active: boolean,percentage:string,token:string) => {

  const formData = new FormData();

  formData.append("section", section);
  formData.append("sequence_number", sequence_number);
  formData.append("heading", heading);
  formData.append("sub_heading", sub_heading);
  formData.append("description", description);
  if (image) {
    formData.append("image", image);
  }
  formData.append("is_active", is_active.toString());
  formData.append("precentage", percentage);
  const response = await apiCoreUpdateuser("/about_us_component/", formData,"POST",token);
  return response;
};
export const updateComponentApi = async (id: string, section: string,sequence_number:string,heading:string,sub_heading:string, description: string,image:string,is_active: boolean,percentage:string,token:string) => {
  const formData = new FormData();
  formData.append("section", section);
  formData.append("sequence_number", sequence_number);
  formData.append("heading", heading);
  formData.append("sub_heading", sub_heading);
  formData.append("description", description);
  if (image) {
    formData.append("image", image);
  }
  formData.append("is_active", is_active.toString());
  formData.append("precentage", percentage);
  const response = await apiCoreUpdateuser(`/about_us_component/${id}/?section_id=${section.toString()}`,formData, "PATCH",token);
  return response;
};
export const componentDeleteApi = async (id: any,section:string,token:string) => {
  const response = await apiCoreNode(`/about_us_component/${id}/?section_id=${section.toString()}`,{},"DELETE", token);
  return response;
};