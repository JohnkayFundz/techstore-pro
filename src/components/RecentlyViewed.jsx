import {
 useRecentlyViewed
} from "../../context/RecentlyViewedContext";

import ProductCard from "./ProductCard";



function RecentlyViewed(){


 const {
  recentlyViewed
 } =
 useRecentlyViewed();




 if(
  recentlyViewed.length === 0
 ){

  return null;

 }



 return (

<section className="recently-viewed">


<h2>
 Recently Viewed
</h2>



<div className="product-grid">


{
recentlyViewed.map(product=>(

<ProductCard

key={product.id}

product={product}

/>

))

}


</div>


</section>

 );


}



export default RecentlyViewed;