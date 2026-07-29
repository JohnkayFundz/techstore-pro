import {
  useState,
} from "react";

import StarRating from "./StarRating";

import {
  useReviews,
} from "../../context/ReviewContext";

import {
  useToast,
} from "../../context/ToastContext";


function ReviewCard({
  review,
  productId,
}) {


  const {
    deleteReview,
    updateReview,
  } = useReviews();


  const {
    showToast,
  } = useToast();



  const [editing, setEditing] =
    useState(false);



  const [comment, setComment] =
    useState(review.comment);



  function handleHelpful(){


    updateReview(

      productId,

      review.id,

      {
        helpful:
        review.helpful + 1,
      }

    );


    showToast({

      type:"success",

      title:"Thank you",

      message:
      "Feedback marked as helpful."

    });


  }





  function handleDelete(){


    deleteReview(

      productId,

      review.id

    );


    showToast({

      type:"info",

      title:"Review removed",

      message:
      "Your review has been deleted."

    });


  }






  function handleUpdate(){


    updateReview(

      productId,

      review.id,

      {
        comment,
      }

    );


    setEditing(false);



    showToast({

      type:"success",

      title:"Updated",

      message:
      "Review updated successfully."

    });


  }





  return (

    <article className="review-card">



      <div className="review-header">


        <div>


          <h4>
            {review.user}
          </h4>


          <StarRating
            rating={review.rating}
          />


        </div>


      </div>





      <h3>
        {review.title}
      </h3>





      {
        editing ? (

          <textarea

            value={comment}

            onChange={
              (e)=>
              setComment(e.target.value)
            }

          />


        ) : (

          <p>
            {review.comment}
          </p>

        )

      }






      <small>
        {review.date}
      </small>





      <div className="review-actions">


        <button
          onClick={handleHelpful}
        >

          👍 Helpful (
          {review.helpful}
          )

        </button>





        <button
          onClick={
            () =>
            setEditing(!editing)
          }
        >

          ✏️ Edit

        </button>





        {
          editing && (

            <button
              onClick={handleUpdate}
            >

              💾 Save

            </button>

          )
        }






        <button
          onClick={handleDelete}
        >

          🗑 Delete

        </button>



      </div>



    </article>

  );

}


export default ReviewCard;