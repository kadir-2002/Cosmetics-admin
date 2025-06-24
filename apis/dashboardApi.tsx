import { apiCoreForPost } from "./apiCoreForPost";


export const dashboardAllDataApi = async (created_by: string, formattedStartDate: any, formattedEndDate: any, token: string) => {
    const response = await apiCoreForPost("/user/dashboard/", { user_id: created_by, start_date: formattedStartDate, end_date: formattedEndDate, token: token }, token);
    return response;
};
export const dashboardSettingApi = async (created_by: string, selectedComponents: any, token: string) => {
    const response = await apiCoreForPost("/user/dashboard-setting/", { user_id: created_by, components: selectedComponents }, token);
    return response;
};


export const dashboardTabDataApi = async (created_by: string, token: string) => {
    const response = await apiCoreForPost("/user/dashboard-sections/", { user_id: created_by, token: token }, token);
    return response;
};