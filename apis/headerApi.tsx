import { apiCoreNode } from "@/APISFolder/APICoreNode";
import { apiCores } from "./apiCore";
import { apiCoreDelete } from "./apiCoreDelete";
import { apiCoreGet } from "./apiCoreGet";
import { apiCoreUpdate } from "./apiCoreUpdate";

export const headerAllDataApi = async (apiParams: { ordering: string, isActive?: boolean }, token: string) => {
  const queryParams = new URLSearchParams();
  if (apiParams.isActive !== undefined) {
    queryParams.append("is_active", apiParams?.isActive.toString());
  }

  if (apiParams?.ordering) {
    queryParams.append("ordering", apiParams?.ordering);
  }
  const endpoint = `/header?${queryParams}`;
  const response = await apiCoreNode(endpoint, {}, "GET", token);
  return response;
};

export const headerDeleteApi = async (id: any, token: string) => {
  const response = await apiCoreNode(`/header/${id}/`, {}, "DELETE", token);
  return response;
};
export const headerUpdatedApi = async (id: string, name: string, sequence_number: string, link: string, isActive: boolean, token: string) => {
  const requestBody = { name: name, sequence_number: sequence_number, link: link, is_active: isActive };
  const response = await apiCoreNode(`/header/${id}/`, requestBody, "PATCH", token);
  return response;
};

export const headerCreateApi = async (name: string, sequence_number: number, link: string, isActive: boolean, userId: number, token: string) => {
  const response = await apiCoreNode(`/header/`, { name: name, link: link, sequence_number: sequence_number, userId, is_active: isActive }, "POST", token);
  console.log(response.body,"api")
  return response;
};