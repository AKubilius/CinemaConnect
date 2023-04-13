import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7019/",
});
const apiTrending = axios.create({
  baseURL: "https://api.themoviedb.org/3/trending/all/day?api_key=c9154564bc2ba422e5e0dede6af7f89b",
});


const authConfig = {
  headers: {
    Authorization:  `Bearer ${sessionStorage.getItem("token")}`,
  }
};

export {api,authConfig};