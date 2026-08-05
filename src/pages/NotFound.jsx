import { Link } from "react-router-dom";


function NotFound() {


  return (

    <section className="container not-found">

      <div className="not-found-content">


        <h1>
          404
        </h1>


        <h2>
          Page Not Found
        </h2>


        <p>
          Sorry, the page you're looking for
          doesn't exist or may have been moved.
        </p>



        <div className="not-found-actions">


          <Link
            to="/"
            className="btn btn-primary"
            aria-label="Return to homepage"
          >

            Back to Home

          </Link>




          <Link
            to="/products"
            className="btn btn-secondary"
            aria-label="Browse available products"
          >

            Browse Products

          </Link>


        </div>


      </div>


    </section>

  );

}


export default NotFound;