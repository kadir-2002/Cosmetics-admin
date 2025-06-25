export const apiCoreDelete = async (endpoint: string, token: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Token ${token}` }), // Include the token if provided
      },
      next: { revalidate: 0 },
    });
 
    if (response.status === 204) {
      return { success: true };
    } else if (response.status === 500) {
      throw new Error("Server not responding");
    } else if (response.status === 401) {
      return response?.json();
    } else {
      throw new Error(`Unexpected status code: ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
};