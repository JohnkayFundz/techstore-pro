import PropTypes from "prop-types";

const steps = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
];

function OrderTimeline({ status }) {
  const currentStep = steps.indexOf(status);

  return (
    <div className="order-timeline">

      {steps.map((step, index) => {

        const completed = index <= currentStep;

        return (
          <div
            key={step}
            className={`timeline-step ${
              completed ? "completed" : ""
            }`}
          >

            <div className="timeline-circle">
              {completed ? "✓" : index + 1}
            </div>

            <p>{step}</p>

            {index !== steps.length - 1 && (
              <div
                className={`timeline-line ${
                  index < currentStep
                    ? "completed"
                    : ""
                }`}
              />
            )}

          </div>
        );
      })}

    </div>
  );
}

OrderTimeline.propTypes = {
  status: PropTypes.oneOf([
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
  ]).isRequired,
};

export default OrderTimeline;