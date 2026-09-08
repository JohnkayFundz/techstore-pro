import User from "../models/User.js";
import Order from "../models/Order.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const totalSpent = orders.reduce(
      (sum, order) => sum + Number(order.totalAmount || 0),
      0
    );

    return res.status(200).json({
      success: true,
      user,
      stats: {
        orders: orders.length,
        totalSpent: Math.round(totalSpent * 100) / 100,
      },
      recentOrders: orders,
    });
  } catch (error) {
    console.error("Failed to load user dashboard:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard.",
    });
  }
};