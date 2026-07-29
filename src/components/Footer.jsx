import { Link } from "react-router-dom";


function Footer() {

  return (

    <footer className="footer">


      <div className="container footer-grid">


        {/* Brand */}

        <div className="footer-brand">

          <h2>
            TechStore <span>Pro</span>
          </h2>


          <p>
            Your one-stop shop for premium laptops,
            smartphones, and accessories at unbeatable prices.
          </p>



          <div className="footer-social">

            <a href="#">
              Facebook
            </a>

            <a href="#">
              Instagram
            </a>

            <a href="#">
              Twitter
            </a>

          </div>


        </div>




        {/* Shop */}

        <div className="footer-links">

          <h3>
            Shop
          </h3>


          <Link to="/">
            Home
          </Link>


          <Link to="/products">
            Products
          </Link>


          <Link to="/cart">
            Cart
          </Link>


          <Link to="/wishlist">
            Wishlist
          </Link>


          <Link to="/checkout">
            Checkout
          </Link>


        </div>





        {/* Company */}

        <div className="footer-links">


          <h3>
            Company
          </h3>


          <Link to="/about">
            About Us
          </Link>


          <Link to="/contact">
            Contact
          </Link>


          <Link to="/faq">
            FAQ
          </Link>


          <Link to="/privacy">
            Privacy Policy
          </Link>


        </div>





        {/* Contact */}

        <div className="footer-links">


          <h3>
            Contact
          </h3>


          <p>
            📧 support@techstorepro.com
          </p>


          <p>
            📞 +234 800 123 4567
          </p>


          <p>
            📍 Lagos, Nigeria
          </p>


        </div>



      </div>





      <div className="footer-bottom">

        <p>
          © {new Date().getFullYear()} TechStore Pro.
          All rights reserved.
        </p>

      </div>



    </footer>

  );

}


export default Footer;