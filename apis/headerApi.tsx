import { apiCores } from "./apiCore";
import { apiCoreDelete } from "./apiCoreDelete";
import { apiCoreGet } from "./apiCoreGet";
import { apiCoreUpdate } from "./apiCoreUpdate";

export const headerAllDataApi = async (apiParams: {ordering: string, isActive?: boolean}, token: string) => {
  const queryParams = new URLSearchParams();
  if (apiParams.isActive !== undefined) {
    queryParams.append("is_active", apiParams?.isActive.toString());
  }

  if (apiParams?.ordering) {
    queryParams.append("ordering", apiParams?.ordering);
  }
  const endpoint = `/frontend/header/?${queryParams}`;
  const response = await apiCoreGet(endpoint, "GET", token);
  return response;
};

export const headerDeleteApi = async (id: any, token: string) => {
  const response = await apiCoreDelete(`/frontend/header/${id}/`, token);
  return response;
};
export const headerUpdatedApi = async (id: string, name: string, sequence_number: string, link: string,isActive: boolean,token: string) => {
  const requestBody = { name:name,sequence_number:sequence_number,link:link, is_active: isActive };
  const response = await apiCoreUpdate(`/frontend/header/${id}/`, "", requestBody, "PATCH", token);
  return response;
};

export const headerCreateApi = async (name: string, sequence_number: string, link: string,isActive: boolean,token: string) => {
  const response = await apiCores(`/frontend/header/`, {name:name,link:link,sequence_number:sequence_number, is_active: isActive }, "POST", token);
  return response;
};