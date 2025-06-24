export const apiCoreUpdateuser = async (
  endpoint: string,
  formData: FormData,
  method: string = "PATCH",
  token?: string,

) => {
  try {
    const headers: HeadersInit = {
      ...(token && { Authorization: `Token ${token}` }), 
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`, {
      method,
      body: formData,
      headers,
      next: { revalidate: 0 },
    });

    const responseData = await response.json();

    if (response.status === 200) {
      return { status: 200, data: responseData };
    }else if(response.status === 201) {
      return { status: 200, data: responseData };
    } else if (response.status === 400) {
      return { status: 400, data: responseData };
    } else if (response.status === 401) {
      return { status: 401, data: responseData };
    } else if (response.status === 500) {
      throw new Error("Server not responding.");
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error in apiCoreUpdate:", error);
    throw error;
  }
};