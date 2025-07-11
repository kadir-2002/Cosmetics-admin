import { apiCoreUpdateuser } from "./apiCoreUpdateuser";

export const profileUpdatedApi = async (
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  // profile_picture: string,
  category: string,
  isActive: boolean,
  token:string
) => {
  const formData = new FormData();
  formData.append("firstName", firstName);
  formData.append("lastName", lastName);
  // if (phone_number) {
  //   formData.append("phone_number", phone_number);
  // } else {
  //   formData.append("phone_number", "");
  // }
  formData.append("email", email);
  // if (phone_number) {
  //   formData.append("country_code_for_phone_number", county_code);
  // } 

  formData.append("role", category);

  // if (profile_picture) {
  //   formData.append("file", profile_picture);
  // }
  formData.append("is_active", isActive.toString());
  const response = await apiCoreUpdateuser(`/admin/update/${id}/`, formData, "PATCH",token);
  return response;
};