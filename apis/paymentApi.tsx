import { apiCores } from "./apiCore";
import { apiCoreGet } from "./apiCoreGet";

export const paymentAllDataApi = async (token:string) => {
    const response = await apiCoreGet("/payment-service/", "GET",token);
    return response;
};

export const paymentCreateApi = async (name: any, formData: any, created_by: string,token:string) => {
    const { url, razorpay_key_id, razorpay_key_secret, stripe_api_key, stripe_endpoint_secret, start_date, paypal_client_id, paypal_secret, hyperpay_entity_id, hyperpay_authorization_bearer, cashfree_app_id, cashfree_secret_key, authorizenet_login_id, authorizenet_transaction_key, end_date, is_active, } = formData;
    let requestBody: any = { name, url, is_active, created_by, start_date, end_date };
    // if (start_date) {
    //     requestBody.start_date = start_date;
    // }
    // if (end_date) {
    //     requestBody.end_date = end_date;
    // }
    if (name === "Razorpay") {
        requestBody.razorpay_key_id = razorpay_key_id;
        requestBody.razorpay_key_secret = razorpay_key_secret;
    } else if (name === "Stripe") {
        requestBody.stripe_api_key = stripe_api_key;
        requestBody.stripe_endpoint_secret = stripe_endpoint_secret;
    } else if (name === "PayPal") {
        requestBody.paypal_client_id = paypal_client_id;
        requestBody.paypal_secret = paypal_secret;

    }
    else if (name === "HyperPay") {
        requestBody.hyperpay_entity_id = hyperpay_entity_id;
        requestBody.hyperpay_authorization_bearer = hyperpay_authorization_bearer;

    }
    else if (name === "Cashfree") {
        requestBody.cashfree_app_id = cashfree_app_id;
        requestBody.cashfree_secret_key = cashfree_secret_key;

    }
    else if (name === "Authorize.net") {
        requestBody.authorizenet_login_id = authorizenet_login_id;
        requestBody.authorizenet_transaction_key = authorizenet_transaction_key;
    }
    const response = await apiCores(`/payment-service/`, requestBody, "POST",token);
    return response;
};

export const paymentUpdatedApi = async (name: any, formData: any, updated_by: string,token:string) => {
    const { id, url, razorpay_key_id, razorpay_key_secret, stripe_api_key, stripe_endpoint_secret, start_date, paypal_client_id, paypal_secret, hyperpay_entity_id, hyperpay_authorization_bearer, cashfree_app_id, cashfree_secret_key, authorizenet_login_id, authorizenet_transaction_key, end_date, is_active, } = formData;

    let requestBody: any = { name, url, is_active, updated_by, start_date, end_date };
    // if (start_date) {
    //     requestBody.start_date = start_date;
    // }
    // if (end_date) {
    //     requestBody.end_date = end_date;
    // }
    if (name === "Razorpay") {
        requestBody.razorpay_key_id = razorpay_key_id;
        requestBody.razorpay_key_secret = razorpay_key_secret;
    } else if (name === "Stripe") {
        requestBody.stripe_api_key = stripe_api_key;
        requestBody.stripe_endpoint_secret = stripe_endpoint_secret;
    } else if (name === "PayPal") {
        requestBody.paypal_client_id = paypal_client_id;
        requestBody.paypal_secret = paypal_secret;

    }
    else if (name === "HyperPay") {
        requestBody.hyperpay_entity_id = hyperpay_entity_id;
        requestBody.hyperpay_authorization_bearer = hyperpay_authorization_bearer;

    }
    else if (name === "Cashfree") {
        requestBody.cashfree_app_id = cashfree_app_id;
        requestBody.cashfree_secret_key = cashfree_secret_key;

    }
    else if (name === "Authorize.net") {
        requestBody.authorizenet_login_id = authorizenet_login_id;
        requestBody.authorizenet_transaction_key = authorizenet_transaction_key;

    }

    const response = await apiCores(`/payment-service/${id}/`, requestBody, "POST",token);
    return response;
};


export const toggleUpdatedApi = async (id: string, methodData: any, is_active: boolean, updated_by: string,token:string) => {
    const {
        name,
        url,
        razorpay_key_id,
        razorpay_key_secret,
        stripe_api_key,
        stripe_endpoint_secret,
        start_date,
        end_date,
        paypal_client_id,
        paypal_secret,
        hyperpay_entity_id,
        hyperpay_authorization_bearer,
        cashfree_app_id,
        cashfree_secret_key,
        authorizenet_login_id,
        authorizenet_transaction_key,
    } = methodData;

    let requestBody: any = {
        url,
        is_active,
        updated_by,
        start_date,
        end_date
    };
    // if (start_date) {
    //     requestBody.start_date = start_date;
    // }
    // if (end_date) {
    //     requestBody.end_date = end_date;
    // }
    if (name === "Razorpay") {
        requestBody.razorpay_key_id = razorpay_key_id;
        requestBody.razorpay_key_secret = razorpay_key_secret;
    } else if (name === "Stripe") {
        requestBody.stripe_api_key = stripe_api_key;
        requestBody.stripe_endpoint_secret = stripe_endpoint_secret;
    } else if (name === "PayPal") {
        requestBody.paypal_client_id = paypal_client_id;
        requestBody.paypal_secret = paypal_secret;
    } else if (name === "HyperPay") {
        requestBody.hyperpay_entity_id = hyperpay_entity_id;
        requestBody.hyperpay_authorization_bearer = hyperpay_authorization_bearer;
    } else if (name === "Cashfree") {
        requestBody.cashfree_app_id = cashfree_app_id;
        requestBody.cashfree_secret_key = cashfree_secret_key;
    } else if (name === "Authorize.Net") {
        requestBody.authorizenet_login_id = authorizenet_login_id;
        requestBody.authorizenet_transaction_key = authorizenet_transaction_key;
    }

    const response = await apiCores(`/payment-service/${id}/`, requestBody, "PATCH",token);
    return response;
};





export const cashondeveleryCreateApi = async (name: any,is_active:boolean ,created_by: string,token:string) => {
    let requestBody: any = { name, is_active};
  
    const response = await apiCores(`/payment-service/`, requestBody, "POST",token);
    return response;
};
