import { apiCores } from "./apiCore";
import { apiCoreGet } from "./apiCoreGet";

export const creategoogleanalyticsApi = async (
  email: string,
  measurement_id: string,
  tag: string,
  is_active: boolean,
  token: string
) => {
  const response = await apiCores(
    "/google-analytics/",
    {
      google_email: email,
      measurement_id: measurement_id,
      tag: tag,
      is_active: true,
      created_by:token,
      updated_by: token,
    },
    "POST",
    token
  );
  return response;
};

export const googleanalyticsApiAllDataApi = async (token: string) => {
  const response = await apiCoreGet(`/google-analytics/`, "GET", token);
  return response;
};

export const updategoogleanalyticsApi = async (
  id: string,
  email: string,
  measurement_id: string,
  tag: string,
  is_active: boolean,
  token: string
) => {
  const response = await apiCores(
    `/google-analytics/${id}/`,
    {
      google_email: email,
      measurement_id: measurement_id,
      tag: tag,
      is_active: true,
      updated_by: token,
    },
    "PATCH",
    token
  );
  return response;
};
