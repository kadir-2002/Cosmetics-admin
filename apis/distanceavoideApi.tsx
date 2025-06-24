import { apiCores } from "./apiCore";
import { apiCoreGet } from "./apiCoreGet";
import { apiCoreUpdate } from "./apiCoreUpdate";

export const distanceDataApi = async (token: string) => {
  const response = await apiCoreGet("/mainapp/delivery-setting/", "GET", token);
  return response;
};

export const createDistanceApi = async (distance: number, charge: number, created_by: number, token: string) => {
  const response = await apiCores("/mainapp/delivery-setting/", { maximum_delivery_distance: distance, delivery_charge_for_maximum_delivery_distance: charge, created_by: created_by }, "POST", token);
  return response;
};

export const distanceDeleteApi = async (id: any, createdBy: number, token: string) => {
  try {
    const response = await apiCoreDelete(`/mainapp/delivery-setting/${id}/`, "DELETE", { deleted_by: createdBy }, token);
    return response;
  } catch (error) {
    throw error;
  }
};

export const apiCoreDelete = async (endpoint: string, method: string, body: object, token: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Token ${token}` }),
      },
      body: method === "DELETE" ? JSON.stringify(body) : null,
      next: { revalidate: 0 },
    });


    if (response.ok) {
      if (response.status === 204) {
        return { status: 204, data: null };
      }
      const responseData = await response.json();
      return { status: response.status, data: responseData };
    } else if (response.status === 401) {
      return { status: 401, data: null };
    } else {
      if (response.status === 500) {
        throw new Error("Server not responding");
      } else if (response.status === 404) {
        throw new Error("Data not found");
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    }
  } catch (error) {
    throw new Error(`Failed to perform API call`);
  }
};

export const UpdateDistanceApi = async (id: string, distance: number, charge: number, updated_by: number, token: string) => {
  const requestBody = {
    maximum_delivery_distance: distance,
    delivery_charge_for_maximum_delivery_distance: charge,
    updated_by: updated_by,
  };
  const response = await apiCoreUpdate(`/mainapp/delivery-setting/${id}/`, "", requestBody, "PATCH", token);
  return response;
};
