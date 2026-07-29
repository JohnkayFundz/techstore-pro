import {
  useState,
} from "react";

import {
  useReviews,
} from "../../context/ReviewContext";

import {
  useToast,
} from "../../context/ToastContext";


function ReviewForm({ productId }) {


  const {
    addReview,
  } = useReviews();


  const {
    showToast,
  } = useToast();



  const [form,setForm] = useState({

    user:"",
    title:"",
    rating:5,
    comment:"",

  });




  function handleChange(e){

    setForm({

      ...form,

      [e.target.name]:
      e.target.value,

    });

  }






  function handleSubmit(e){

    e.preventDefault();



    if(
      !form.user ||
      !form.comment
    ){

      showToast({

        type:"warning",

        title:"Missing information",

        message:
        "Please fill in your name and review."

      });


      return;

    }




    addReview(

      productId,

      form

    );




    showToast({

      type:"success",

      title:"Review submitted",

      message:
      "Thank you for your feedback!"

    });




    setForm({

      user:"",

      title:"",

      rating:5,

      comment:"",

    });


  }





  return (

    <form
      className="review-form"
      onSubmit={handleSubmit}
    >


      <h3>
        Write a Review
      </h3>



      <input

        type="text"

        name="user"

        placeholder="Your name"

        value={form.user}

        onChange={handleChange}

      />




      <input

        type="text"

        name="title"

        placeholder="Review title"

        value={form.title}

        onChange={handleChange}

      />





      <select

        name="rating"

        value={form.rating}

        onChange={handleChange}

      >

        <option value="5">
          ⭐⭐⭐⭐⭐
        </option>

        <option value="4">
          ⭐⭐⭐⭐
        </option>

        <option value="3">
          ⭐⭐⭐
        </option>

        <option value="2">
          ⭐⭐
        </option>

        <option value="1">
          ⭐
        </option>


      </select>





      <textarea

        name="comment"

        placeholder="Share your experience"

        value={form.comment}

        onChange={handleChange}

      />





      <button
        className="btn btn-primary"
      >

        Submit Review

      </button>


    </form>

  );

}


export default ReviewForm;