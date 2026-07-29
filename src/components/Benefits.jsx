function Benefits() {

  const benefits = [
    {
      icon: "🚚",
      title: "Fast Delivery",
      text: "Quick and reliable delivery straight to your door."
    },

    {
      icon: "🔒",
      title: "Secure Payment",
      text: "Safe and protected checkout experience."
    },

    {
      icon: "⭐",
      title: "Premium Quality",
      text: "Carefully selected products from trusted brands."
    },

    {
      icon: "💬",
      title: "Customer Support",
      text: "Friendly support whenever you need help."
    }
  ];


  return (

    <section className="benefits">

      <div className="container">


        <div className="section-title">

          <h2>
            Why Choose TechStore Pro?
          </h2>

          <p>
            We provide a simple, secure and enjoyable shopping experience.
          </p>

        </div>



        <div className="benefits-grid">


          {
            benefits.map((item,index)=>(

              <div
                key={index}
                className="benefit-card"
              >

                <div className="benefit-icon">
                  {item.icon}
                </div>


                <h3>
                  {item.title}
                </h3>


                <p>
                  {item.text}
                </p>


              </div>

            ))
          }


        </div>


      </div>


    </section>

  );

}


export default Benefits;