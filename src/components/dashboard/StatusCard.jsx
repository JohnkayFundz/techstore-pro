import PropTypes from "prop-types";


function StatusCard({
  title,
  count,
  icon,
}) {


  return (

    <div className="status-card">

      <span className="status-icon">
        {icon}
      </span>


      <div>

        <h4>
          {title}
        </h4>


        <strong>
          {count}
        </strong>

      </div>


    </div>

  );

}



StatusCard.propTypes = {

  title: PropTypes.string.isRequired,

  count: PropTypes.number.isRequired,

  icon: PropTypes.node,

};


StatusCard.defaultProps = {

  icon: "📦",

};


export default StatusCard;