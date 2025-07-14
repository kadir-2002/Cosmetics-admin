import { apiCoreNode } from "@/APISFolder/APICoreNode";
import { apiCores } from "./apiCore";
import { apiCoreDelete } from "./apiCoreDelete";
import { apiCoreGet } from "./apiCoreGet";
import { apiCoreUpdate } from "./apiCoreUpdate";

export const taxAllDataApi = async (searchParams: { search: string, token: string }) => {
  const queryParams = new URLSearchParams({
    search: searchParams.search,
  }).toString();
  const endpoint = `/tax/?${queryParams}`;
  const response = await apiCoreGet(endpoint, "GET", searchParams.token);
  return response;
};

export const createTaxApi = async (name: string, percentage: number, is_active: boolean, createdBy: number, token: string) => {
  const response = await apiCores("/tax/", { name: name, percentage: percentage, is_active: is_active, created_by: createdBy }, "POST", token);
  return response;
};

export const taxDeleteApi = async (id: any, token: any) => {
  const response = await apiCoreNode(`/tax/${id}/`,{},"DELETE", token);
  return response;
};
export const taxUpdatedApi = async (id: string, name: string, percentage: number, is_active: boolean, created_by: number, token: string) => {
  const requestBody = { name: name, percentage: percentage, is_active: is_active, created_by: created_by }
  const response = await apiCoreUpdate(`/tax/${id}/`, "", requestBody, "PATCH", token);
  return response;
};
