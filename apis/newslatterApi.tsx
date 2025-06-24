import { apiCoreGet } from "./apiCoreGet";
import { apiCoreUpdate } from "./apiCoreUpdate";

export const newsletterAllDataApi = async (searchParams: {
  search: string;
  token: string;
  is_active?: boolean;
  pageSize: number;
  ordering: string;
}) => {
  const queryParams = new URLSearchParams({
    search: searchParams.search.toString(),
    pageSize: searchParams.pageSize.toString(),
  });
  if (searchParams.is_active !== undefined) {
    queryParams.append("is_active", searchParams.is_active.toString());
  }
  if (searchParams.ordering) {
    queryParams.append("ordering", searchParams.ordering);
  }
  const endpoint = `/frontend/newsletter/?${queryParams}`;
  const response = await apiCoreGet(endpoint, "GET", searchParams.token);
  return response;
};

//// contact us  form api

export const contactAllDataApi = async (searchParams: {
  search: string;
  current_page: number;
  page_size: number;
  token: string;
}) => {
  const queryParams = new URLSearchParams({
    search: searchParams.search.toString(),
    page: searchParams.current_page.toString(),
    page_size: searchParams.page_size.toString(),
  });

  const endpoint = `/frontend/contact_form/?${queryParams.toString()}`;
  const response = await apiCoreGet(endpoint, "GET", searchParams.token);
  return response;
};

export const contactUpdatedApi = async (
  id: string,
  contacted_the_customer: boolean,
  reply_given: string,
  token: string
) => {
  const requestBody = {
    contacted_the_customer: contacted_the_customer,
    reply_given: reply_given,
  };
  const response = await apiCoreUpdate(
    `/frontend/contact_form/${id}/`,
    "",
    requestBody,
    "PATCH",
    token
  );
  return response;
};
