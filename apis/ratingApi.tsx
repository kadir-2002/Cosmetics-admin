import { apiCoreGet } from "./apiCoreGet";
import { apiCoreUpdate } from "./apiCoreUpdate";

export const reviewAllDataApi = async (params: { product?: string; current_page: number; page_size: number,token:string }) => {
    const queryParams = new URLSearchParams({
      page: params.current_page.toString(),
      page_size: params.page_size.toString(),
    });
  
    if (params.product) {
      queryParams.append("product", params.product);
    }
    const endpoint = `/product-review/?${queryParams.toString()}`;
    const response = await apiCoreGet(endpoint, "GET",params?.token);
    return response;
  };
  export const ReviewToggleUpdatedApi = async (id: string,isParentProductId:any, is_active: boolean, updated_by: number,token:string) => {
    const requestBody = { is_active: is_active, updated_by: updated_by }
    const response = await apiCoreUpdate(`/product-review/${id}/?product=${isParentProductId}`, "", requestBody, "PATCH",token);
    return response;
  };