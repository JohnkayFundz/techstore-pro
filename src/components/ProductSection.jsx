import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import ProductGrid from "./ProductGrid";

import "./ProductSection.css";


function ProductSection({
  title,
  subtitle = "Explore our latest premium technology products.",
  products = [],
  link = "/products",
}) {


  // Prevent empty sections

  if (!products.length) {
    return null;
  }



  return (

    <section

      className="product-section-home"

      aria-labelledby={`${title}-heading`}

    >


      <div className="container">


        <div className="section-header">


          <div>


            <h2 id={`${title}-heading`}>

              {title}

            </h2>



            {
              subtitle && (

                <p>

                  {subtitle}

                </p>

              )
            }


          </div>





          <Link

            to={link}

            className="view-all"

            aria-label={`View all ${title}`}

          >

            View All →

          </Link>


        </div>





        <ProductGrid

          products={products}

        />


      </div>


    </section>

  );

}





ProductSection.propTypes = {

  title:

    PropTypes.string.isRequired,


  subtitle:

    PropTypes.string,


  products:

    PropTypes.arrayOf(

      PropTypes.object

    ),


  link:

    PropTypes.string,

};





export default ProductSection;