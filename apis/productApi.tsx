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

  const response = await apiCoreGet(endpoint, "GET", params?.token);
  return response;
};
export const createProductApi = async (
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
  minimum_order_quantity: number,
  tag_list: [],
  created_by: number,
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
  const payload: any = {
    name,
    SKU,
    description,
    base_price,
    selling_price,
    base_and_selling_price_difference_in_percent,
    variant_specifications,
    stock,
    is_active,
    is_new_arrival,
    minimum_order_quantity: minimum_order_quantity,
    tag_list,
    created_by,
    low_stock_threshold,
    weight,
    length,
    width,
    height,
    product_details,
    sequence_number:null,
    care_instruction,
    seo_title,
    seo_description,
    seo_keyword,
    warranty,
    delivery_or_installation_tips,
    material,
    weight_bearing_number,
    is_stackable,
    stackable_pieces_number,
  };

  if (sub_catogry) {
    payload.category = sub_catogry;
  } else {
    payload.category = category;
  }
  const response = await apiCores("/product/", payload, "POST", token);
  return response;
};

export const productDeleteApi = async (id: any, token: string) => {
  const response = await apiCoreDelete(`/product/${id}/`, token);
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
    base_price: base_price,
    selling_price: selling_price,
    base_and_selling_price_difference_in_percent:
      base_and_selling_price_difference_in_percent,
    variant_specifications: variant_specifications,
    stock: stock,
    is_active: is_active,
    is_new_arrival: is_new_arrival,
    minimum_order_quantity: minimum_order_quantity,
    tag_list: tag_list,
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
  if (sub_catogry) {
    requestBody.category = sub_catogry;
  } else {
    requestBody.category = category;
  }
  const response = await apiCoreUpdate(
    `/product/${id}/`,
    "",
    requestBody,
    "PATCH",
    token
  );
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
  const response = await apiCoreGet(`/parent-child-categories/`, "GET", token);
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
  const formData = new FormData();
  formData.append("product", isSelectedProductImgId);
  formData.append("sequence_number", sequence_number);
  formData.append("created_by", created_by);
  if (image) {
    formData.append("image", image);
  }

  formData.append("is_active", isActive.toString());
  const response = await apiCoreFormData(
    "/product-image/",
    formData,
    "POST",
    token
  );
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
  const response = await apiCoreDelete(
    `/product-image/${setSelectedImgId}/?product=${isParentProductId}`,
    token
  );
  return response;
};

export const imgAllDataApi = async (isParentProductId: any, token: string) => {
  const response = await apiCoregetid(
    `/product-image/?product=${isParentProductId}`,
    "GET",
    token
  );
  return response;
};
//--------------------------------------------------------

export const ChildproductAllDataApi = async (
  isParentProductId: string,
  current_page: number,
  page_size: number,
  token: string
) => {
  const queryParams = new URLSearchParams({
    parent: isParentProductId.toString(),
    page: current_page.toString(),
    page_size: page_size.toString(),
  });
  const endpoint = `/product-variant/?${queryParams.toString()}`;
  const response = await apiCoreGet(endpoint, "GET", token);
  return response;
};

export const createProductVarientApi = async (
  product: string,
  description: string,
  SKU: string,
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
  const payload: any = {
    product: product,
    description: description,
    SKU: SKU,
    selling_price: selling_price,
    base_and_selling_price_difference_in_percent:
      base_and_selling_price_difference_in_percent,
    specification: specification,
    stock: stock,
    colour_code: colorcode,
    is_selected: is_selected,
    is_active: is_active,
    is_new_arrival: is_new_arrival,
    created_by: created_by,
    low_stock_threshold: low_stock_threshold,
  };
  const response = await apiCores("/product-variant/", payload, "POST", token);
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
export const VarientTabApi = async (product: string, token: string) => {
  const queryParams = new URLSearchParams({
    product: product.toString(),
  });
  const endpoint = `/product-variant-specs/?${queryParams.toString()}`;
  const response = await apiCoreGet(endpoint, "GET", token);
  return response;
};
export const productVArientDeleteApi = async (
  id: any,
  isSelectedProductId: any,
  token: string
) => {
  const response = await apiCoreDelete(
    `/product-variant/${id}/?parent=${isSelectedProductId}`,
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
  formData.append("product_variant", isSelectedProductImgId);
  formData.append("sequence_number", sequence_number);
  formData.append("created_by", created_by);
  if (image) {
    formData.append("image", image);
  }

  formData.append("is_active", isActive.toString());
  const response = await apiCoreFormData(
    "/product-variant-image/",
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
  const response = await apiCoreDelete(
    `/product-variant-image/${isSelectedProductImgIds}/?variant=${isSelectedProductImgId}`,
    token
  );
  return response;
};
export const imgAllVArientDataApi = async (id: any, token: string) => {
  const response = await apiCoregetid(
    `/product-variant-image/?variant=${id}`,
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
  const response = await apiCoreUpdate(
    `/update_product_sequence/`,
    "",
    sequencePayload,
    "PATCH",
    token
  );
  return response;
};
