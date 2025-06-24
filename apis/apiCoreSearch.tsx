export const apiCoreSearch = async (endpoint: string, p0: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 0 }, 
      });
      const responseData = await response.json(); 
      if (response.status === 200) {
        return { success: true,data:responseData};
      } else if (response.status === 500) {
        throw new Error("Server not responding");
      } else if (response.status === 400) {
        throw new Error("Data not found");
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      throw error; 
    }
  };
  

  