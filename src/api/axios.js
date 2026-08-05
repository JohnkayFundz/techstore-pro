import axios from "axios";



const api = axios.create({

  baseURL: import.meta.env.VITE_API_URL,

  withCredentials: true,

});





/* ==========================================================
   REQUEST INTERCEPTOR
   Attach JWT automatically
========================================================== */

api.interceptors.request.use(

  (config) => {


    config.headers =
      config.headers || {};



    const token =
      localStorage.getItem("token");



    if (
      token &&
      !config.headers.Authorization
    ) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }




    // Allow browser to set FormData boundary

    if (
      config.data instanceof FormData
    ) {

      delete config.headers[
        "Content-Type"
      ];

    }



    return config;


  },


  (error) => {

    return Promise.reject(error);

  }

);







/* ==========================================================
   RESPONSE INTERCEPTOR
   Handle expired login
========================================================== */

api.interceptors.response.use(

  (response) => response,


  (error) => {


    if (
      error.response?.status === 401
    ) {


      localStorage.removeItem(
        "token"
      );


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