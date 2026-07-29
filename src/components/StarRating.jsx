function StarRating({ rating }) {

  return (
    <div className="star-rating">

      {[1,2,3,4,5].map((star)=>(
        
        <span
          key={star}
          className={
            star <= rating
              ? "star active"
              : "star"
          }
        >
          ★
        </span>

      ))}

    </div>
  );
}

export default StarRating;