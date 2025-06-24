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
    "/mainapp/google-analytics/",
    {
      google_email: email,
      measurement_id: measurement_id,
      tag: tag,
      is_active: true,
    },
    "POST",
    token
  );
  return response;
};

export const googleanalyticsApiAllDataApi = async (token: string) => {
  const response = await apiCoreGet(`/mainapp/google-analytics/`, "GET", token);
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
    `/mainapp/google-analytics/${id}/`,
    {
      google_email: email,
      measurement_id: measurement_id,
      tag: tag,
      is_active: true,
    },
    "PATCH",
    token
  );
  return response;
};
