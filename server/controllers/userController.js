import User from "../models/User.js";
import Order from "../models/Order.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    const totalSpent = orders.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );

    res.json({
      success: true,
      user,
      stats: {
        orders: orders.length,
        totalSpent,
      },
      recentOrders: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};