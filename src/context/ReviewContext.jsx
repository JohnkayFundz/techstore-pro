import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import PropTypes from "prop-types";


const ReviewContext = createContext();



export function ReviewProvider({ children }) {


  const [reviews, setReviews] = useState(() => {

    try {

      const saved =
        localStorage.getItem("reviews");


      return saved
        ? JSON.parse(saved)
        : {};

    } catch(error){

      console.error(
        "Failed to load reviews",
        error
      );

      return {};

    }

  });





  useEffect(() => {


    localStorage.setItem(

      "reviews",

      JSON.stringify(reviews)

    );


  }, [reviews]);






  function addReview(productId, review){


    const newReview = {

      id:
        crypto.randomUUID(),


      user:
        review.user || "Anonymous",


      rating:
        Number(review.rating) || 5,


      title:
        review.title || "",


      comment:
        review.comment || "",


      date:
        new Date()
        .toISOString()
        .split("T")[0],


      helpful:0,


    };




    setReviews((prev)=>({


      ...prev,


      [productId]:[

        ...(prev[productId] || []),

        newReview,

      ],


    }));


  }







  function deleteReview(
    productId,
    reviewId
  ){


    setReviews((prev)=>({


      ...prev,


      [productId]:

        (prev[productId] || [])
        .filter(
          review =>
          review.id !== reviewId
        )


    }));


  }








  function updateReview(
    productId,
    reviewId,
    updatedReview
  ){


    setReviews((prev)=>({


      ...prev,


      [productId]:

      (prev[productId] || [])
      .map(review =>

        review.id === reviewId

        ?

        {
          ...review,
          ...updatedReview
        }

        :

        review

      )


    }));


  }







  function getProductReviews(productId){


    return reviews[productId] || [];


  }








  return (

    <ReviewContext.Provider

      value={{

        reviews,

        addReview,

        deleteReview,

        updateReview,

        getProductReviews,

      }}

    >

      {children}

    </ReviewContext.Provider>

  );

}






ReviewProvider.propTypes = {

  children:
    PropTypes.node.isRequired,

};








export function useReviews(){


  const context =
    useContext(
      ReviewContext
    );



  if(!context){

    throw new Error(
      "useReviews must be used inside ReviewProvider"
    );

  }



  return context;


}