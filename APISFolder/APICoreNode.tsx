export const apiCoreNode = async (
  endpoint: string,
  requestBody: any,
  method: string = "POST",
  token: any | null = null
) => {
  const data = JSON.stringify({ ...requestBody });

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Token ${token}` }),
  };

  const options: RequestInit = {
    method: method,
    headers: headers,
    next: { revalidate: 0 },
  };

  // Conditionally add the body if method is POST
  if (method !== "GET") {
    options.body = data;
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`, options);

    console.log("new header", response)

    // Check if response is not ok (non-2xx status code)
   if (!response.ok) {
  const responseData = await response.json();
  return {
    status: response.status,
    body: responseData,
  };
}

    // Return both status and body as JSON
    const responseData = await response.json();
    return {
      status: response.status,
      body: responseData,
    };
  } catch (error: any) {
    console.error("API Error:", error.message);
    // You can return an error object here, or re-throw the error
    return { status: "error", body: error.message || "Something went wrong"};
  }
};
