export const apiCoreUpdate = async (
  endpoint: string,
  p0: string,
  requestBody: any,
  method: "PATCH",
  token: string
) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`;

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Token ${token}` }),
      },
      body: JSON.stringify(requestBody),
      next: { revalidate: 0 },
    });

    const responseData = await response.json();

    if (response?.status === 200) {
      return { status: 200, data: responseData };
    } else if (response?.status === 201) {
      return { status: 201, data: responseData };
    } else if (response?.status === 401) {
      return { status: 401, data: responseData };
    } else if (response?.status === 400) {
      return { status: 400, data: responseData };
    } else if (response?.status === 500) {
      return { status: 500, data: responseData };
    } else {
      throw new Error(`Unexpected status code: ${response.status}`);
    }
  } catch (error: any) {
    console.error("Error in apiCoreUpdate:", error.message);
    return { status: "error", message: error.message };
  }
};
