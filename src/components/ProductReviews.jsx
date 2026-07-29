import {
  useMemo,
  useState,
} from "react";

import {
  useReviews,
} from "../../context/ReviewContext";


import ReviewCard from "./ReviewCard";
import RatingSummary from "./RatingSummary";
import ReviewForm from "./ReviewForm";


function ProductReviews({
  productId
}) {


  const {
    getProductReviews,
  } = useReviews();




  const [sortBy,setSortBy] =
    useState("newest");



  const [search,setSearch] =
    useState("");





  const productReviews =
    getProductReviews(productId);






  const filteredReviews =
    useMemo(()=>{


      let result =
        [...productReviews];



      if(search.trim()){


        result =
        result.filter(review =>


          review.comment
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )

          ||

          review.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )


        );


      }




      if(sortBy === "newest"){


        result.sort(

          (a,b)=>

          new Date(b.date)
          -
          new Date(a.date)

        );

      }




      if(sortBy === "highest"){


        result.sort(

          (a,b)=>

          b.rating-a.rating

        );

      }




      if(sortBy === "lowest"){


        result.sort(

          (a,b)=>

          a.rating-b.rating

        );

      }





      if(sortBy === "helpful"){


        result.sort(

          (a,b)=>

          b.helpful-a.helpful

        );

      }





      return result;



    },[
      productReviews,
      sortBy,
      search
    ]);







  return (

    <section className="reviews">


      <h2>
        Customer Reviews
      </h2>





      <RatingSummary

        reviews={productReviews}

      />





      <ReviewForm

        productId={productId}

      />





      <div className="review-controls">



        <input

          type="search"

          placeholder="Search reviews..."

          value={search}

          onChange={
            e =>
            setSearch(
              e.target.value
            )
          }

        />





        <select

          value={sortBy}

          onChange={
            e =>
            setSortBy(
              e.target.value
            )
          }

        >

          <option value="newest">
            Newest
          </option>


          <option value="highest">
            Highest Rating
          </option>


          <option value="lowest">
            Lowest Rating
          </option>


          <option value="helpful">
            Most Helpful
          </option>


        </select>



      </div>






      <div className="reviews-list">


        {
          filteredReviews.length === 0

          ?

          <p>
            No reviews found.
          </p>


          :

          filteredReviews.map(
            review => (

              <ReviewCard

                key={review.id}

                review={review}

                productId={productId}

              />

            )

          )


        }


      </div>


    </section>

  );

}



export default ProductReviews;