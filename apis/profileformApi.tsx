import { apiCoreUpdateuser } from "./apiCoreUpdateuser";

export const profileUpdatedApi = async (
  id: string,
  firstName: string,
  lastName: string,
  phone_number: string,
  email: string,
  county_code: string,
  profile_picture: string,
  isActive: boolean,
  category: string,
  token:string
) => {
  const formData = new FormData();
  formData.append("first_name", firstName);
  formData.append("last_name", lastName);
  if (phone_number) {
    formData.append("phone_number", phone_number);
  } else {
    formData.append("phone_number", "");
  }
  formData.append("email", email);
  if (phone_number) {
    formData.append("country_code_for_phone_number", county_code);
  } 

  formData.append("category", category);

  if (profile_picture) {
    formData.append("profile_picture", profile_picture);
  }
  formData.append("is_active", isActive.toString());
  const response = await apiCoreUpdateuser(`/user/panel/${id}/`, formData, "PATCH",token);
  return response;
};