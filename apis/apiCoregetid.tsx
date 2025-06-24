export const apiCoregetid = async (endpoint: string, method: string, token: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Token ${token}` }), // Add token to the headers
      },
      next: { revalidate: 0 },
    });

    if (response.status === 200) {
      const responseData = await response.json();
      return { status: 200, data: responseData };
    } else if (response.status === 500) {
      throw new Error("Server not responding");
    } else if (response.status === 400) {
      const responseData = await response.json();
      return { status: 400, data: responseData };
    } else {
      throw new Error(`Unexpected status code: ${response.status}`);
    }
  } catch (error) {
    console.error("Error in apiCoregetid:", error);
    throw error;
  }
};
