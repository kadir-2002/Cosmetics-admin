export const apiCores = async (
  endpoint: string,
  requestBody: any,
  method: string = "POST",
  token?: string
): Promise<any> => {
  const data = JSON.stringify(requestBody);

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Token ${token}` }),
      },
      body: data,
      next: { revalidate: 0 },
    });
    const responseData = await response.json();
    if (response.ok) {
      return { status: response.status, data: responseData };
    } else {
      return { status: response.status, data: responseData };
    }
  } catch (error) {
    console.error("API call failed:", error);
    return { status: "error", error: error };
  }
};
