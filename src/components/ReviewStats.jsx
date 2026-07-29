import {
  useMemo,
} from "react";


function ReviewStats({
  reviews
}) {


  const stats =
    useMemo(()=>{


      const total =
        reviews.length;



      const average =
        total

        ?

        (
          reviews.reduce(
            (sum,item)=>
            sum + item.rating,
            0
          )
          /
          total

        ).toFixed(1)


        :

        0;





      return {

        total,

        average,

      };


    },[reviews]);





  return (

    <div className="review-stats">


      <div>

        <h3>
          {stats.average}/5
        </h3>

        <p>
          Average Rating
        </p>

      </div>




      <div>

        <h3>
          {stats.total}
        </h3>

        <p>
          Total Reviews
        </p>


      </div>


    </div>

  );

}


export default ReviewStats;