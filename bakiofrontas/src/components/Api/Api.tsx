import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7019/",
});

const apiTrending = axios.create({
  baseURL:
    "https://api.themoviedb.org/3/trending/all/day?api_key=c9154564bc2ba422e5e0dede6af7f89b",
});

const authConfig = {
  headers: {
    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
  },
};

async function makePostRequest(url: string, postData: any) {
  const authorizationToken = `Bearer ${sessionStorage.getItem("token")}`;
  try {
    const { data /*status*/ } = await axios.post<any>(url, postData, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: authorizationToken,
      },
    });

    return data;
  } catch (error) {
    await handleError(error);
  }
}

async function makeDeleteRequest(url: string) {
  const authorizationToken = `Bearer ${sessionStorage.getItem("token")}`;

  try {
    const { data, status } = await axios.delete<any>(url, {
      headers: {
        Accept: "application/json",
        Authorization: authorizationToken,
      },
    });

    console.log("response is: ", data);
    console.log("response status is: ", status);

    return data;
  } catch (error) {
    await handleError(error);
  }
}

async function handleError(error: any) {
  if (axios.isAxiosError(error)) {
    console.log("error message: ", error.message);
    return error.message;
  } else {
    console.log("unexpected error: ", error);
    return "An unexpected error occurred";
  }
}

export { api, authConfig, makePostRequest, makeDeleteRequest};
