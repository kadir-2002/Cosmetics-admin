import { apiCoreNode } from "@/APISFolder/APICoreNode";
import { apiCoreGet } from "./apiCoreGet";
import { apiCoreUpdate } from "./apiCoreUpdate";

export const orderAllDataApi = async (searchParams: { search: string, startDates: string, endDates: string, id: string, current_page: number, page_size: number, token: string, isfiltervalue: string, ordering: string }) => {
  // const queryParams = new URLSearchParams({
  //   order_status: searchParams.order_status,
  //   start_date: searchParams.startDates,
  //   end_date: searchParams.endDates,
  //   page: searchParams.current_page.toString(),
  //   page_size: searchParams.page_size.toString(),
  // });
  // if (searchParams.id) {
  //   queryParams.append("search", searchParams.id.toString());
  // } else {
  //   queryParams.append("search", searchParams.search.toString());
  // } if (searchParams.isfiltervalue) {
  //   queryParams.append("order_status", searchParams.isfiltervalue.toString());

  // } if (searchParams.ordering) {
  //   queryParams.append("ordering", searchParams.ordering.toString());
  // }
  let endpoint

  if (searchParams.id) {
    endpoint = `/order/get-orders/?search=${searchParams.id}`;
  } else {
    const queryParams = new URLSearchParams({
      start_date: searchParams.startDates,
      end_date: searchParams.endDates,
      page: searchParams.current_page.toString(),
      page_size: searchParams.page_size.toString(),
    });

    if (searchParams.search) {
      queryParams.append("search", searchParams.search.toString());
    }

    if (searchParams.isfiltervalue) {
      queryParams.append("order_status", searchParams.isfiltervalue.toString());

    }
    if (searchParams.ordering) {
      queryParams.append("ordering", searchParams.ordering.toString());
    }

    endpoint = `/order/get-orders/?${queryParams}`;
    console.log(endpoint,":::::::::::::::::::::")
  }


  const response = await apiCoreNode(endpoint,{}, "GET",searchParams.token);
  return response;
};














export const orderUpdatedApi = async (id: string, status: string, updated_by: string, token: string) => {
  const requestBody = {  status: status };
  const response = await apiCoreNode(`/order/${id}/status/`, requestBody, "PATCH", token);
  console.log(response ,"staus")
  return response;
};