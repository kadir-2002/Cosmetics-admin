import { apiCores } from "./apiCore";
import { apiCoreDelete } from "./apiCoreDelete";
import { apiCoreGet } from "./apiCoreGet";
import { apiCoreUpdate } from "./apiCoreUpdate";

export const CounterAllDataApi = async (apiParams: {
  current_page: number;
  page_size: number;
  token: string;
  filtervalue?: boolean;
}) => {
  const queryParams = new URLSearchParams({
    page: String(apiParams.current_page),
    page_size: String(apiParams.page_size),
  });

  if (apiParams.filtervalue !== undefined) {
    queryParams.append("is_active", apiParams.filtervalue.toString());
  }
  const endpoint = `/frontend/homepage_statistics/?${queryParams.toString()}`;
  const response = await apiCoreGet(endpoint, "GET", apiParams.token);
  return response;
};
export const createCounterApi = async (name: string, value: string,is_active:boolean,token:string) => {
  const response = await apiCores("/frontend/homepage_statistics/", { title: name,  number:value,is_active:is_active }, "POST",token);
  return response;
};

export const counterDeleteApi = async (id: any,token:string) => {
  const response = await apiCoreDelete(`/frontend/homepage_statistics/${id}/`, token);
  return response;
};
export const counterUpdatedApi = async (id:string,name: string, value: string,is_active:boolean,token:string)=> {
  const requestBody = {
    title: name,
    number:value,
    is_active:is_active
  };
  const response = await apiCoreUpdate(`/frontend/homepage_statistics/${id}/`, "", requestBody, "PATCH",token);
  return response;
};
