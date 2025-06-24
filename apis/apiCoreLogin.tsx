export const apiCoreslogin = async (
  endpoint: string,
  requestBody: any,
  method: string = "POST"
) => {
  const data = JSON.stringify({ jsonrpc: "2.0", params: { ...requestBody }, });
  return await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`, { method: method, headers: { "Content-Type": "application/json", }, body: JSON.stringify(requestBody), next: { revalidate: 0 }, })
  
  .then(async (response) => {
      if (response?.status === 200) {
        const responseData = await response.json(); 
        return {status: 200, data: responseData}
      } else if (response?.status === 201) {
        const responseData = await response.json(); 
        return {status: 201, data: responseData}
      } else if (response?.status === 500) {
        const responseData = await response.json(); 
        return {status:500 , data: responseData}
      } else if (response?.status === 400) {
        const responseData = await response.json(); 
        return {status: 400, data: responseData}
      }
    })
    .then((responseData) => {
      return responseData; 
    })
    .catch((error) => {
      console.log(error.message);
      return error;
    });
}