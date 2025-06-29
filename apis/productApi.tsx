import { apiCoreNode } from "@/APISFolder/APICoreNode";
import { apiCores } from "./apiCore";
import { apiCoreDelete } from "./apiCoreDelete";
import { apiCoreFormData } from "./apiCoreFormData";
import { apiCoreGet } from "./apiCoreGet";
import { apiCoregetid } from "./apiCoregetid";
import { apiCoreUpdate } from "./apiCoreUpdate";
import { apiCoreUpdateuser } from "./apiCoreUpdateuser";

export const productAllDataApi = async (params: {
  search?: string;
  // current_page: number;
  // page_size: number;
  is_active?: boolean;
  is_in_stock?: boolean;
  id?: number;
  threshold?: boolean;
  token: string;
  ordering: string;
  filterValue: any;
  iscaegoryvalue: any;
}) => {
  let endpoint;
  if (params.id) {
    endpoint = `/product/${params.id}/`;
  } else {
    const queryParams = new URLSearchParams({
      // page: params.current_page.toString(),
      // page_size: params.page_size.toString(),
    });
    if (params.is_active !== undefined) {
      queryParams.append("is_active", params.is_active.toString());
    }

    if (params.is_in_stock !== undefined) {
      queryParams.append("is_in_stock", params.is_in_stock.toString());
    }
    if (params.threshold !== undefined) {
      queryParams.append("threshold", params.threshold.toString());
    }
    if (params.search) {
      queryParams.append("search", params.search);
    }
    if (params.ordering) {
      queryParams.append("ordering", params.ordering);
    }
    if (params.filterValue !== undefined) {
      queryParams.append("is_active", params.filterValue);
    }
    if (params.iscaegoryvalue) {
      queryParams.append("category", params.iscaegoryvalue);
    }

    endpoint = `/product/?parent=true&${queryParams.toString()}`;
  }

  const response = await apiCoreNode(endpoint, {}, "GET", params?.token);
  return response;
};
export const createProductApi = async (
  name: string,
  SKU: string,
  description: string,
  categoryId: number,
  sub_catogry: number,
  basePrice: number,
  sellingPrice: number,
  priceDifferencePercent: number,
  variant_specifications: any,
  stock: number,
  is_active: boolean,
  isNewArrival: boolean,
  createdById: number,
  token: string,
  weight: string,
  length: string,
  width: string,
  height: string,
  product_details: string,
  seoTitle: string,
  seoDescription: string,
  seoKeyword: string,
) => {
  // ✅ Force transform even if user passes an object
  let transformedVariants: any[] = [];

  if (Array.isArray(variant_specifications)) {
    transformedVariants = variant_specifications;
  } else if (
    typeof variant_specifications === 'object' &&
    variant_specifications !== null
  ) {
    transformedVariants = Object.entries(variant_specifications).flatMap(
      ([key, values]) =>
        Array.isArray(values)
          ? values.map((val) => ({ name: key, value: val }))
          : [{ name: key, value: values }]
    );
  }
  console.log("createproductapi");

  const payload: any = {
    name,
    SKU,
    description,
    basePrice,
    sellingPrice,
    priceDifferencePercent,
    variant_specifications: transformedVariants,
    stock,
    is_active,
    isNewArrival,
    createdById,
    weight,
    length,
    width,
    height,
    product_details,
    sequenceNumber: null,
    seoTitle,
    seoDescription,
    seoKeyword,
  };

  if (sub_catogry) {
    payload.subcategoryId = sub_catogry;
  } else {
    payload.categoryId = categoryId;
  }

  console.log("🟢 Final payload:", payload);

  const response = await apiCoreNode("/product/", payload, "POST", token);
  return response;
};

export const productDeleteApi = async (id: any, token: string) => {
  const response = await apiCoreNode(`/product/${id}/`, {},"DELETE",token);
  return response;
};

export const ProductUpdatedApi = async (
  id: string,
  name: string,
  SKU: string,
  description: string,
  category: string,
  sub_catogry: string,
  base_price: string,
  selling_price: string,
  base_and_selling_price_difference_in_percent: string,
  variant_specifications: any,
  stock: string,
  is_active: boolean,
  is_new_arrival: boolean,
  minimum_order_quantity: string,
  tag_list: [],
  updated_by: number,
  token: string,
  low_stock_threshold: string,
  weight: string,
  length: string,
  width: string,
  height: string,
  product_details: string,
  care_instruction: string,
  seo_title: string,
  seo_description: string,
  seo_keyword: string,
  warranty: string,
  delivery_or_installation_tips: string,
  material: string,
  weight_bearing_number: string,
  is_stackable: boolean,
  stackable_pieces_number: string
) => {
  const requestBody: any = {
    name: name,
    SKU: SKU,
    description: description,
    basePrice: base_price,
    sellingPrice: selling_price,
    priceDifferencePercent:
      base_and_selling_price_difference_in_percent,
    variant_specifications: variant_specifications,
    stock: stock,
    is_active: is_active,
    isNewArrival: is_new_arrival,
    updatedById: updated_by,
    weight: weight,
    length: length,
    width: width,
    height: height,
    productDetails: product_details,
    seoTitle: seo_title,
    seoDescription: seo_description,
    seoKeyword: seo_keyword,
    warranty: warranty,
  };
  if (sub_catogry) {
    requestBody.subcategoryId = sub_catogry;
  } else {
    requestBody.categoryId = category;
  }
  const response = await apiCoreNode(
    `/product/${id}/`,
    
    requestBody,
    "PATCH",
    token
  );
  console.log(response,"update product")
  return response;
};
export const ProductToggleUpdatedApi = async (
  id: string,
  name: string,
  description: string,
  sku: string,
  category: string,
  base_price: string,
  selling_price: string,
  base_and_selling_price_difference_in_percent: string,
  variant_specifications: any,
  stock: string,
  is_active: boolean,
  is_new_arrival: boolean,
  tagListIds: number[],
  updated_by: number,
  token: string,
  low_stock_threshold: string,
  weight: string,
  length: string,
  width: string,
  height: string,
  product_details: string,
  care_instruction: string,
  seo_title: string,
  seo_description: string,
  seo_keyword: string,
  warranty: string,
  delivery_or_installation_tips: string,
  material: string,
  weight_bearing_number: string,
  is_stackable: boolean,
  stackable_pieces_number: string
) => {
  const requestBody = {
    name: name,
    description: description,
    SKU: sku,
    category: category,
    base_price: base_price,
    selling_price: selling_price,
    base_and_selling_price_difference_in_percent:
      base_and_selling_price_difference_in_percent,
    variant_specifications: variant_specifications,
    stock: stock,
    is_active: is_active,
    is_new_arrival: is_new_arrival,
    tag_list: tagListIds,
    updated_by: updated_by,
    low_stock_threshold: low_stock_threshold,
    weight: weight,
    length: length,
    width: width,
    height: height,
    product_details: product_details,
    care_instruction: care_instruction,
    seo_title: seo_title,
    seo_description: seo_description,
    seo_keyword: seo_keyword,
    warranty: warranty,
    delivery_or_installation_tips: delivery_or_installation_tips,
    material: material,
    weight_bearing_number: weight_bearing_number,
    is_stackable: is_stackable,
    stackable_pieces_number: stackable_pieces_number,
  };
  const response = await apiCoreUpdate(
    `/product/${id}/`,
    "",
    requestBody,
    "PATCH",
    token
  );
  return response;
};

export const catagoryDataApi = async (token: string) => {
  const response = await apiCoreNode(`/category/`, {}, "GET", token);
  return response;
};
export const tagDataApi = async (token: string) => {
  const response = await apiCoreGet(`/product-tag/`, "GET", token);
  return response;
};
export const prentProductDataApi = async (token: string) => {
  const response = await apiCoreGet(`/parent-product/`, "GET", token);
  return response;
};

export const productImgApi = async (
  isSelectedProductImgId: string,
  sequence_number: string,
  image: File | null | any,
  isActive: boolean,
  created_by: string,
  token: string
) => {
  console.log(isSelectedProductImgId,"image id -----------------------")
  const formData = new FormData();
  formData.append("productId", isSelectedProductImgId);
  formData.append("sequence", sequence_number);
  if (image) {
    formData.append("image", image);
  }

  const response = await apiCoreFormData(
    "/product/image/",
    formData,
    "POST",
    token
  );
  console.log(response,"rs")
  return response;
};
export const imgUpdatedApi = async (
  id: string,
  isSelectedProductImgId: string,
  sequence_number: string,
  image: File | null | any,
  isActive: boolean,
  created_by: string
) => {
  const formData = new FormData();
  formData.append("product", isSelectedProductImgId);
  formData.append("sequence_number", sequence_number);
  formData.append("updated_by", created_by);

  if (image) {
    formData.append("profile_picture", image);
  }
  formData.append("is_active", isActive.toString());
  const response = await apiCoreUpdateuser(
    `/product-image/${id}/`,
    formData,
    "PATCH"
  );
  return response;
};
export const imgDeleteApi = async (
  setSelectedImgId: any,
  isParentProductId: any,
  token: string
) => {
  const response = await apiCoreNode(
    `/product/image/${setSelectedImgId}`,
    {},
    "DELETE",
    token
  );
  return response;
};

export const imgAllDataApi = async (isParentProductId: any, token: string) => {
  const response = await apiCoreNode(
    `/product/image/${isParentProductId}`,
    {},
    "GET",
    token
  );
  console.log(response,"img")
  return response;
};
//--------------------------------------------------------

export const ChildproductAllDataApi = async (
  isParentProductId: string,
  current_page: number,
  page_size: number,
  token: string
) => {
  // const queryParams = new URLSearchParams({
  //   parent: isParentProductId.toString(),
  //   page: current_page.toString(),
  //   page_size: page_size.toString(),
  // });
  const endpoint = `/product/variant/product/${isParentProductId.toString()}`;
  const response = await apiCoreNode(endpoint,{}, "GET");
  return response;
};

export const createProductVarientApi = async (
  product: string,
  description: string,
  SKU: number,  
  selling_price: number,
  base_and_selling_price_difference_in_percent: string,
  specification: any,
  stock: number,
  colorcode: string,
  is_selected: boolean,
  is_active: boolean,
  is_new_arrival: boolean,
  created_by: number,
  low_stock_threshold: string,
  token: string
) => {
  const payload: any = {
    description:description,
    productId:product,
    SKU: SKU,
    selling_price: Number(selling_price),
    base_and_selling_price_difference_in_percent:
    base_and_selling_price_difference_in_percent,
    specification: specification,
    stock: Number(stock),
    colour_code: colorcode,
    is_selected: is_selected,
    is_active: is_active,
    is_new_arrival: is_new_arrival,
    created_by: created_by,
    low_stock_threshold: low_stock_threshold,
  };
  const response = await apiCoreNode(`/product/variant/${product}`,payload, "POST", token);
  return response;
};

export const ProductUpdatedVarientApi = async (
  id: string,
  isParentProductId: any,
  SKU: string,
  description: string,
  selling_price: string,
  base_and_selling_price_difference_in_percent: string,
  specification: any,
  stock: string,
  colorcode: string,
  is_selected: boolean,
  is_active: boolean,
  is_new_arrival: boolean,
  created_by: number,
  low_stock_threshold: string,
  token: string
) => {
  const requestBody: any = {
    SKU: SKU,
    description: description,
    selling_price: selling_price,
    base_and_selling_price_difference_in_percent:
      base_and_selling_price_difference_in_percent,
    specification: specification,
    stock: stock,
    colour_code: colorcode,
    is_selected: is_selected,
    is_active: is_active,
    is_new_arrival: is_new_arrival,
    updated_by: created_by,
    low_stock_threshold: low_stock_threshold,
  };

  const response = await apiCoreUpdate(
    `/product-variant/${id}/?parent=${isParentProductId}`,
    "",
    requestBody,
    "PATCH",
    token
  );
  return response;
};

// specification
export const VarientTabApi = async (product: string, token: string) => {
  
  
  const endpoint = `/product/spec/${product}`;
  const response = await apiCoreNode(endpoint,{}, "GET");
  console.log(response)
  return response;
};
export const productVArientDeleteApi = async (
  id: any,
  isSelectedProductId: any,
  token: string
) => {
  const response = await apiCoreNode(
    `/product/variant/${id}`,
    {},
    "DELETE",
    token
  );
  return response;
};

export const productVarientImgApi = async (
  isSelectedProductImgId: string,
  sequence_number: string,
  image: File | null | any,
  isActive: boolean,
  created_by: string,
  token: string
) => {
  const formData = new FormData();
  formData.append("variantId", isSelectedProductImgId);
  formData.append("sequence_number", sequence_number);
  if (image) {
    formData.append("images", image);
  }

  formData.append("is_active", isActive.toString());
  const response = await apiCoreFormData(
    `/product/variant/images/${isSelectedProductImgId}`,
    formData,
    "POST",
    token
  );
  return response;
};
export const imgVarientDeleteApi = async (
  isSelectedProductImgIds: any,
  isSelectedProductImgId: any,
  token: string
) => {
  const response = await apiCoreNode(
    `/product/variant/images/${isSelectedProductImgId}/${isSelectedProductImgIds}`,
    {},
    "DELETE",

    token
  );
  return response;
};
export const imgAllVArientDataApi = async (id: any, token: string) => {
  const response = await apiCoreNode(
    `/product/variant/images/${id}`,
    {},
    "GET",
    token
  );
  return response;
};
export const varientToggleUpdatedApi = async (
  isParentProductId: any,
  id: string,
  description: string,
  sku: string,
  selling_price: string,
  base_and_selling_price_difference_in_percent: string,
  specification: any,
  stock: string,
  is_selected: boolean,
  is_active: boolean,
  is_new_arrival: boolean,
  updated_by: number,
  low_stock_threshold: string,
  token: string
) => {
  const requestBody = {
    description: description,
    SKU: sku,
    selling_price: selling_price,
    base_and_selling_price_difference_in_percent:
      base_and_selling_price_difference_in_percent,
    specification: specification,
    stock: stock,
    is_selected: is_selected,
    is_active: is_active,
    is_new_arrival: is_new_arrival,
    updated_by: updated_by,
    low_stock_threshold: low_stock_threshold,
  };
  const response = await apiCoreUpdate(
    `/product-variant/${id}/?parent=${isParentProductId}`,
    "",
    requestBody,
    "PATCH",
    token
  );
  return response;
};

export const categryDataApi = async (token: any) => {
  const response = await apiCoreGet(
    `/product-category/?parent=true&`,
    "GET",
    token
  );
  return response;
};

export const productsequenceDataApi = async (
  sequencePayload: any,
  token: any
) => {
  const response = await apiCoreNode(
    `/product/update-sequence`,
    { sequencePayload },
    "PATCH",
    token
  );
  return response;
};
