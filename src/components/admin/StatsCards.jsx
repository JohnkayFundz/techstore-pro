import PropTypes from "prop-types";

import {
  FiDollarSign,
  FiShoppingBag,
  FiPackage,
  FiUsers,
  FiTrendingUp,
} from "react-icons/fi";


function StatsCards({ stats }) {


  const dashboardStats = [

    {
      id: 1,
      title: "Revenue",
      value:
        `₦${Number(stats.revenue || 0)
          .toLocaleString("en-NG")}`,
      change: "Updated",
      icon: FiDollarSign,
    },


    {
      id: 2,
      title: "Orders",
      value:
        Number(stats.totalOrders || 0)
          .toLocaleString("en-NG"),
      change: "Updated",
      icon: FiShoppingBag,
    },


    {
      id: 3,
      title: "Products",
      value:
        Number(stats.totalProducts || 0)
          .toLocaleString("en-NG"),
      change: "Updated",
      icon: FiPackage,
    },


    {
      id: 4,
      title: "Users",
      value:
        Number(stats.totalUsers || 0)
          .toLocaleString("en-NG"),
      change: "Updated",
      icon: FiUsers,
    },

  ];



  return (

    <section className="stats-grid">

      {dashboardStats.map((item) => {

        const Icon = item.icon;


        return (

          <article
            key={item.id}
            className="stats-card"
          >

            <div className="stats-card-top">


              <div className="stats-icon">

                <Icon size={28}/>

              </div>



              <div className="stats-change">

                <FiTrendingUp size={16}/>

                <span>
                  {item.change}
                </span>

              </div>


            </div>



            <div className="stats-card-body">

              <h3>
                {item.value}
              </h3>


              <p>
                {item.title}
              </p>


            </div>


          </article>

        );

      })}

    </section>

  );

}



StatsCards.propTypes = {

  stats: PropTypes.shape({

    revenue:
      PropTypes.number,

    totalOrders:
      PropTypes.number,

    totalProducts:
      PropTypes.number,

    totalUsers:
      PropTypes.number,

  }).isRequired,

};



export default StatsCards;