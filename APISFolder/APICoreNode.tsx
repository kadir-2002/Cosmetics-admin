export const apiCoreNode = async (
  endpoint: string,
  requestBody: any,
  method: string = "POST",
  token: any | null = null
) => {
  const data = JSON.stringify({ ...requestBody });

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Token ${token}` })
  };

  const options: RequestInit = {
    method: method,
    headers: headers,
    next: { revalidate: 0 },
  };

  // Conditionally add the body if method is POST
  if (method === "POST") {
    options.body = data;
  }

  return await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`, options)
    .then((response) => {
      if (!response?.ok) {
        if (response.status === 401) {
          console.log("Unauthorized");
          const responseData = "Unauthorized";
          return responseData;
        } else {
          console.log("Network response was not ok");
        }
      }
      return response?.json();
    })
    .then((responseData) => {
      return responseData; // Return the JSON data
    })
    .catch((error) => {
      console.log(error.message);
      // return error;
    });
};
