import { apiCores } from "./apiCore";
import { apiCoreGet } from "./apiCoreGet";

export const shippingAllDataApi = async (token:string) => {
    const response = await apiCoreGet("/shipping-service/", "GET",token);
    return response;
};

export const shippingCreateApi = async (name: any, formData: any, created_by: string,token:string) => {
    const {url,aramex_username,aramex_password,aramex_account_number,aramex_account_pin,shiprocket_username,shiprocket_password,shiprocket_token,usps_client_id,usps_client_secret,start_date, end_date,is_active} = formData;
    let requestBody: any = {name,url,is_active,created_by,start_date,end_date};
    // if (start_date) {
    //     requestBody.start_date = start_date;
    // }
    // if (end_date) {
    //     requestBody.end_date = end_date;
    // }
    if (name === "Aramex") {
        requestBody.aramex_username = aramex_username;
        requestBody.aramex_password = aramex_password;
        requestBody.aramex_account_number = aramex_account_number;
        requestBody.aramex_account_pin = aramex_account_pin;
    } else if (name === "Shiprocket") {
        requestBody.shiprocket_username = shiprocket_username;
        requestBody.shiprocket_password = shiprocket_password;
        requestBody.shiprocket_token = shiprocket_token;
    }else if(name==="USPS"){
        requestBody.usps_client_id = usps_client_id;
        requestBody.usps_client_secret = usps_client_secret;
    }
    const response = await apiCores(`/shipping-service/`, requestBody, "POST",token);
    return response;
};

export const shipingUpdatedApi = async (name: any,formData: any, updated_by: string,token:string) => {
    const {id ,url,aramex_username,aramex_password,aramex_account_number,aramex_account_pin,shiprocket_username,shiprocket_password,shiprocket_token,usps_client_id,usps_client_secret,start_date, end_date,is_active,} = formData;
    let requestBody: any = {name,url,is_active,updated_by,start_date,end_date};
    if (name === "Aramex") {
        requestBody.aramex_username = aramex_username;
        requestBody.aramex_password = aramex_password;
        requestBody.aramex_account_number = aramex_account_number;
        requestBody.aramex_account_pin = aramex_account_pin;
    } else if (name === "Shiprocket") {
        requestBody.shiprocket_username = shiprocket_username;
        requestBody.shiprocket_password = shiprocket_password;
        requestBody.shiprocket_token = shiprocket_token;
    }else if(name==="USPS"){
        requestBody.usps_client_id = usps_client_id;
        requestBody.usps_client_secret = usps_client_secret;
    }
    const response = await apiCores(`/shipping-service/${id}/`, requestBody, "PATCH",token);
    return response;
};


export const shipingTogggleUpdatedApi = async (id:string,formData: any, is_active: boolean, updated_by: string,token:string) => {
    const {name,url,aramex_username,aramex_password,aramex_account_number,aramex_account_pin,shiprocket_username,shiprocket_password,shiprocket_token,usps_client_id,usps_client_secret,start_date, end_date} = formData;

    let requestBody: any = {url,is_active,updated_by,start_date,end_date};  
    if (name === "Aramex") {
        requestBody.aramex_username = aramex_username;
        requestBody.aramex_password = aramex_password;
        requestBody.aramex_account_number = aramex_account_number;
        requestBody.aramex_account_pin = aramex_account_pin;
    } else if (name === "Shiprocket") {
        requestBody.shiprocket_username = shiprocket_username;
        requestBody.shiprocket_password = shiprocket_password;
        requestBody.shiprocket_token = shiprocket_token;
    }else if(name==="USPS"){
        requestBody.usps_client_id = usps_client_id;
        requestBody.usps_client_secret = usps_client_secret;
    }

    const response = await apiCores(`/shipping-service/${id}/`, requestBody, "PATCH",token);
    return response;
};
