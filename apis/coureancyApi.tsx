import { apiCoreNode } from "@/APISFolder/APICoreNode";
import { apiCoreFormData } from "./apiCoreFormData";
import { apiCoreGet } from "./apiCoreGet";
import { apiCoreUpdateuser } from "./apiCoreUpdateuser";

export const createCoureeancyApi = async (
    country: string,
    currency: string,
    currency_symbol: string,
    logo: File | null | any,
    address:string,
    phone:string,
    email:string,
    description:string,
    facebook_icon:File | null | any,
    facebook_link:string,
    instagram_icon:File | null | any,
    instagram_link:string,
    twitter_icon:File | null | any,
    twitter_link:string,
    linkedin_icon:File | null | any,
    linkedin_link:string,
    product_low_stock_threshold:string,
    minimum_order_quantity:string,
    is_tax_inclusive:Boolean,
        company_state:string,
    token: string
) => {
    const formData = new FormData();
    formData.append("logo", logo);
    formData.append("description", description);
    // formData.append("country_code", "+91");
    formData.append("address", address);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("country", country);
    formData.append("currency", currency);
    formData.append("currency_symbol", '₹');
    // formData.append("product_low_stock_threshold", "20");
    if(facebook_icon){
     formData.append("facebook_icon", facebook_icon);
    }
  
    formData.append("facebook_link", facebook_link);
    if(instagram_icon){
       formData.append("instagram_icon", instagram_icon);
    }
    formData.append("instagram_link", instagram_link);
   if(twitter_icon){formData.append("twitter_icon", twitter_icon);}
    formData.append("twitter_link", twitter_link);
      if(linkedin_icon){
         formData.append("linkedin_icon", linkedin_icon); 
        }
    formData.append("linkedin_link", linkedin_link);
    formData.append("product_low_stock_threshold", product_low_stock_threshold);
    formData.append("minimum_order_quantity", minimum_order_quantity);
    formData.append("is_tax_inclusive", is_tax_inclusive.toString());
    formData.append("company_state", company_state);
    const response = await apiCoreFormData("/company-settings", formData, "POST", token);
    return response;
};

export const currencyAllDataApi = async (token: string) => {
    const response = await apiCoreNode(`/company-settings`, {},"GET");
    return response;
};

export const coureancyUpdatedApi = async (
    id: string,
    country: string,
    currency: string,
    currency_symbol: string,
    logo: File | null | any,
    address:string,
    phone:string,
    email:string,
    description:string,
    facebook_icon:File | null | any,
    facebook_link:string,
    instagram_icon:File | null | any,
    instagram_link:string,
    twitter_icon:File | null | any,
    twitter_link:string,
    linkedin_icon:File | null | any,
    linkedin_link:string,
    product_low_stock_threshold:string,
    minimum_order_quantity:string,
     is_tax_inclusive:Boolean,
        company_state:string,
    token: string
) => {
    const formData = new FormData();
    formData.append("logo", logo);
    formData.append("description", description);
    // formData.append("country_code", "+91");
    formData.append("address", address);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("country", country);
    formData.append("currency", currency);
    formData.append("currency_symbol", "₹");
    // formData.append("product_low_stock_threshold", "20");
    formData.append("facebook_icon", facebook_icon);
    formData.append("facebook_link", facebook_link);
    formData.append("instagram_icon", instagram_icon);
    formData.append("instagram_link", instagram_link);
    formData.append("twitter_icon", twitter_icon);
    formData.append("twitter_link", twitter_link);
    formData.append("linkedin_icon", linkedin_icon);
    formData.append("linkedin_link", linkedin_link);
    formData.append("product_low_stock_threshold", product_low_stock_threshold);
    formData.append("minimum_order_quantity", minimum_order_quantity);
    formData.append("is_tax_inclusive", is_tax_inclusive.toString());
    formData.append("company_state", company_state);
    const response = await apiCoreUpdateuser(`/company-settings/`, formData, "POST", token);
    return response;
};