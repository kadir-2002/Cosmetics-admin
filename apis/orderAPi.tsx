import { apiCoreNode } from "@/APISFolder/APICoreNode";
import { apiCoreGet } from "./apiCoreGet";
import { apiCoreUpdate } from "./apiCoreUpdate";

export const orderAllDataApi = async (searchParams: {
  search: string;
  startDates?: string;
  endDates?: string;
  id: string;
  current_page: number;
  page_size: number;
  token: string;
  isfiltervalue: string;
  ordering: string;
}) => {
  let endpoint: string;

  if (searchParams.id) {
    endpoint = `/order/user-order/?id=${searchParams.id}`;
  } else {
    const queryParams = new URLSearchParams();

    // Conditionally append if values exist
    if (searchParams.startDates) {
      queryParams.append("start_date", searchParams.startDates);
    }
    if (searchParams.endDates) {
      queryParams.append("end_date", searchParams.endDates);
    }

    queryParams.append("page", searchParams.current_page.toString());
    queryParams.append("page_size", searchParams.page_size.toString());

    if (searchParams.search) {
      queryParams.append("search", searchParams.search);
    }

    if (searchParams.isfiltervalue) {
      queryParams.append("order_status", searchParams.isfiltervalue);
    }

    if (searchParams.ordering) {
      queryParams.append("ordering", searchParams.ordering);
    }

    endpoint = `/order/user-order/?${queryParams.toString()}`;
  }

  const response = await apiCoreNode(endpoint, {}, "GET", searchParams.token);
  return response;
};














export const orderUpdatedApi = async (id: string, status: string, updated_by: string, token: string) => {
  const requestBody = {  status: status };
  const response = await apiCoreNode(`/order/${id}/status/`, requestBody, "PATCH", token);
  console.log(response ,"staus")
  return response;
};