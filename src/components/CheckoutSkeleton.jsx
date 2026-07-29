import Skeleton from "./Skeleton";

function CheckoutSkeleton() {
  return (
    <section
      className="checkout-skeleton"
      aria-label="Loading checkout"
      aria-busy="true"
    >
      <div className="checkout-layout">
        {/* Checkout Form */}
        <div className="checkout-form-skeleton">
          <Skeleton
            width="220px"
            height="34px"
            className="mb-24"
          />

          <Skeleton
            width="100%"
            height="52px"
            className="mb-16"
          />

          <Skeleton
            width="100%"
            height="52px"
            className="mb-16"
          />

          <Skeleton
            width="100%"
            height="52px"
            className="mb-16"
          />

          <Skeleton
            width="100%"
            height="52px"
            className="mb-16"
          />

          <Skeleton
            width="100%"
            height="120px"
            className="mb-24"
          />

          <Skeleton
            width="220px"
            height="50px"
          />
        </div>

        {/* Order Summary */}
        <aside className="checkout-summary-skeleton">
          <Skeleton
            width="160px"
            height="28px"
            className="mb-24"
          />

          <Skeleton
            width="100%"
            height="18px"
            className="mb-16"
          />

          <Skeleton
            width="100%"
            height="18px"
            className="mb-16"
          />

          <Skeleton
            width="100%"
            height="18px"
            className="mb-16"
          />

          <Skeleton
            width="100%"
            height="60px"
            className="mb-24"
          />

          <Skeleton
            width="100%"
            height="48px"
          />
        </aside>
      </div>
    </section>
  );
}

export default CheckoutSkeleton;