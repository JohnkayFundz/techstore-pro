import { useMemo } from "react";
import StarRating from "./StarRating";


function RatingSummary({ reviews }) {


  const summary = useMemo(() => {

    const total =
      reviews.length;


    const average =
      total === 0
        ? 0
        : (
            reviews.reduce(
              (sum, review) =>
                sum + review.rating,
              0
            ) / total
          ).toFixed(1);



    const distribution = {

      5: reviews.filter(
        review => review.rating === 5
      ).length,

      4: reviews.filter(
        review => review.rating === 4
      ).length,

      3: reviews.filter(
        review => review.rating === 3
      ).length,

      2: reviews.filter(
        review => review.rating === 2
      ).length,

      1: reviews.filter(
        review => review.rating === 1
      ).length,

    };


    return {
      total,
      average,
      distribution,
    };


  }, [reviews]);



  return (

    <div className="rating-summary">


      <div className="rating-score">

        <h2>
          {summary.average}
        </h2>

        <StarRating
          rating={
            Math.round(
              Number(summary.average)
            )
          }
        />

        <p>
          {summary.total}
          {" "}
          Reviews
        </p>

      </div>



      <div className="rating-bars">


        {
          [5,4,3,2,1].map(star => (

            <div
              key={star}
              className="rating-row"
            >

              <span>
                {star} ★
              </span>


              <div className="rating-bar">

                <div
                  className="rating-fill"
                  style={{
                    width:
                    `${
                      summary.total
                      ?
                      (
                        summary.distribution[star]
                        /
                        summary.total
                      )
                      *
                      100
                      :
                      0
                    }%`
                  }}
                />


              </div>


              <span>
                {
                  summary.distribution[star]
                }
              </span>


            </div>

          ))
        }


      </div>


    </div>

  );

}


export default RatingSummary;