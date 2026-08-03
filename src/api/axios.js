import axios from "axios";


const api = axios.create({

  baseURL: import.meta.env.VITE_API_URL,

  withCredentials: true,

});



// Attach JWT automatically

api.interceptors.request.use(

  (config) => {

    const token =
      localStorage.getItem("token");


    if (
      token &&
      !config.headers.Authorization
    ) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }


    if (config.data instanceof FormData) {

      delete config.headers["Content-Type"];

    }


    return config;

  },


  (error) =>
    Promise.reject(error)

);



// Handle expired sessions

api.interceptors.response.use(

  (response) => response,


  (error) => {


    if (
      error.response?.status === 401
    ) {

      localStorage.removeItem("token");

      localStorage.removeItem(
        "techstore-user"
      );


      window.location.href =
        "/login";

    }


    return Promise.reject(error);

  }

);



export default api;