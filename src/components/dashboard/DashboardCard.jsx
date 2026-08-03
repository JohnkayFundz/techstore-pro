import PropTypes from "prop-types";


function DashboardCard({
  title,
  value,
  icon,
  description,
}) {

  return (

    <div className="dashboard-card">

      <div className="dashboard-card-icon">
        {icon}
      </div>


      <div className="dashboard-card-content">

        <h3>
          {title}
        </h3>


        <h2>
          {value}
        </h2>


        <p>
          {description}
        </p>

      </div>

    </div>

  );

}


DashboardCard.propTypes = {

  title: PropTypes.string.isRequired,

  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,

  icon: PropTypes.node,

  description: PropTypes.string,

};


DashboardCard.defaultProps = {

  icon: "📊",

  description: "",

};


export default DashboardCard;