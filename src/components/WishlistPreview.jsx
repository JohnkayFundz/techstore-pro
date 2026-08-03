import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { useWishlist } from "../../context/WishlistContext";

function WishlistPreview() {
  const { wishlist } = useWishlist();

  const previewItems = wishlist.slice(0, 3);

  return (
    <div className="dashboard-panel">
      <div className="panel-header">
        <h3>Wishlist</h3>

        <Link to="/wishlist" className="view-all">
          View All
        </Link>
      </div>

      {previewItems.length === 0 ? (
        <div className="empty-dashboard">
          <FiHeart size={40} />

          <h4>Your wishlist is empty</h4>

          <p>Save products you love and they'll appear here.</p>

          <Link to="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="wishlist-preview">
          {previewItems.map((item) => (
            <div className="wishlist-item" key={item.id}>
              <img
                src={item.image}
                alt={item.name}
                className="wishlist-image"
              />

              <div className="wishlist-info">
                <h4>{item.name}</h4>
                <p>${item.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WishlistPreview;