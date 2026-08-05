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


    const token = localStorage.getItem("token");


    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }



    // Handle file uploads
    if (config.data instanceof FormData) {

      delete config.headers["Content-Type"];

    }



    return config;


  },


  (error) => {

    return Promise.reject(error);

  }

);








/* ==========================================================
   RESPONSE INTERCEPTOR
   Global error handling
========================================================== */

api.interceptors.response.use(

  (response) => response,


  (error) => {


    const status =
      error.response?.status;



    if (status === 401) {


      localStorage.removeItem("token");

      localStorage.removeItem(
        "techstore-user"
      );


      // prevent redirect loop
      if (
        window.location.pathname !== "/login"
      ) {

        window.location.href =
          "/login";

      }

    }



    return Promise.reject(error);


  }

);





export default api;