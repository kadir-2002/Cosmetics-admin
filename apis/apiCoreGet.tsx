export const apiCoreGet = async (endpoint: string, p0: string, token: string) => {
  return await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Token ${token}` }), // Include token if provided
    },
    next: { revalidate: 0 },
  }) 
 
    .then((response) => {
      if (response?.status === 200) {
        return response?.json();
      } else if (response?.status === 401) {
        return response?.json();
      } else if (response?.status === 500) {
        throw new Error("Server not responding");
      } else if (response?.status === 400) {
        return response?.json();
      }
    })
    .catch((error) => {
      console.error(error.message);
    });
};

