export const apiCoreForPost = async (
    endpoint: string,
    requestBody: any,
    token: string
) => {
    return await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Token ${token}` }),

        },
        body: JSON.stringify(requestBody),
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
            throw error;
        });
};
