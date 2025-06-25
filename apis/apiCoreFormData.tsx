export const apiCoreFormData = async (
  endpoint: string,
  formData: FormData,
  method: string = "POST",
  token?: string
) => {
  try {
    const headers: HeadersInit = {

      ...(token && { Authorization: `Token ${token}` }),
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`, {
      method,
      body: formData,
      headers,
      next: { revalidate: 0 },
    });

    if (response.status === 201) {
      const responseData = await response.json();
      return { status: 201, data: responseData };
    } else if (response.status === 401) {
      const responseData = await response.json();
      return { status: 401, data: responseData };
    } else if (response.status === 500) {
      throw new Error("Server not responding.");
    } else if (response.status === 400) {
      return await response.json();
    } else if (response.status === 200) {
      const responseData = await response.json();
      return { status: 200, data: responseData };
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error in apiCoreFormData:");
    throw error;
  }
};