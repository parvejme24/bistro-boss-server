const User = require("../models/UserModel");
const Menu = require("../models/MenuModel");
const Order = require("../models/OrderModel");
const Cart = require("../models/CartModel");
const Review = require("../models/ReviewModel");
const Blog = require("../models/BlogModel");

// Get Dashboard Overview Statistics (Admin Only)
exports.getDashboardStats = async (req, res) => {
  try {
    // Get current date for today's calculations
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

    // Get last 30 days for monthly calculations
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));

    // User Statistics
    const totalCustomers = await User.countDocuments({ role: "customer" });
    const totalChefs = await User.countDocuments({ role: "chef" });
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalUsers = totalCustomers + totalChefs + totalAdmins;

    // Menu Statistics
    const totalMenus = await Menu.countDocuments({});
    const totalCategories = await Menu.distinct("category").countDocuments();

    // Order Statistics (if Order model exists)
    let totalOrders = 0;
    let totalSales = 0;
    let todaysOrders = 0;
    let todaysSales = 0;
    let monthlyOrders = 0;
    let monthlySales = 0;

    try {
      // Check if Order model exists and has data
      const orderCount = await Order.countDocuments({});
      if (orderCount > 0) {
        totalOrders = orderCount;
        
        // Calculate total sales
        const orders = await Order.find({});
        totalSales = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        // Today's orders and sales
        const todaysOrderData = await Order.find({
          createdAt: { $gte: startOfDay, $lte: endOfDay }
        });
        todaysOrders = todaysOrderData.length;
        todaysSales = todaysOrderData.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        // Monthly orders and sales
        const monthlyOrderData = await Order.find({
          createdAt: { $gte: thirtyDaysAgo }
        });
        monthlyOrders = monthlyOrderData.length;
        monthlySales = monthlyOrderData.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      }
    } catch (error) {
      // Order model might not exist yet
      console.log("Order model not available:", error.message);
    }

    // Review Statistics
    const totalReviews = await Review.countDocuments({});
    const totalBlogReviews = await require("../models/BlogReviewModel").countDocuments({});

    // Blog Statistics
    const totalBlogs = await Blog.countDocuments({});

    // Cart Statistics (active carts)
    const activeCarts = await Cart.countDocuments({});

    // Recent Activity (last 7 days)
    const sevenDaysAgo = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
    
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    const recentMenus = await Menu.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    const recentReviews = await Review.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    const recentBlogs = await Blog.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    res.status(200).json({
      message: "Dashboard statistics retrieved",
      stats: {
        users: {
          total: totalUsers,
          customers: totalCustomers,
          chefs: totalChefs,
          admins: totalAdmins
        },
        content: {
          menus: totalMenus,
          categories: totalCategories,
          blogs: totalBlogs,
          reviews: totalReviews + totalBlogReviews
        },
        orders: {
          total: totalOrders,
          totalSales: Math.round(totalSales * 100) / 100,
          todaysOrders,
          todaysSales: Math.round(todaysSales * 100) / 100,
          monthlyOrders,
          monthlySales: Math.round(monthlySales * 100) / 100
        },
        activity: {
          activeCarts,
          recentUsers,
          recentMenus,
          recentReviews,
          recentBlogs
        }
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get User Statistics (Admin Only)
exports.getUserStats = async (req, res) => {
  try {
    const { period = "all" } = req.query;
    let dateFilter = {};

    if (period === "today") {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
      dateFilter = { createdAt: { $gte: startOfDay, $lte: endOfDay } };
    } else if (period === "week") {
      const sevenDaysAgo = new Date(Date.now() - (7 * 24 * 60 * 60 * 1000));
      dateFilter = { createdAt: { $gte: sevenDaysAgo } };
    } else if (period === "month") {
      const thirtyDaysAgo = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000));
      dateFilter = { createdAt: { $gte: thirtyDaysAgo } };
    }

    const customers = await User.countDocuments({ role: "customer", ...dateFilter });
    const chefs = await User.countDocuments({ role: "chef", ...dateFilter });
    const admins = await User.countDocuments({ role: "admin", ...dateFilter });

    // Get recent users
    const recentUsers = await User.find({ ...dateFilter })
      .select("name email role createdAt")
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      message: "User statistics retrieved",
      stats: {
        period,
        counts: {
          customers,
          chefs,
          admins,
          total: customers + chefs + admins
        },
        recentUsers
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get Sales Statistics (Admin Only)
exports.getSalesStats = async (req, res) => {
  try {
    const { period = "all" } = req.query;
    let dateFilter = {};

    if (period === "today") {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
      dateFilter = { createdAt: { $gte: startOfDay, $lte: endOfDay } };
    } else if (period === "week") {
      const sevenDaysAgo = new Date(Date.now() - (7 * 24 * 60 * 60 * 1000));
      dateFilter = { createdAt: { $gte: sevenDaysAgo } };
    } else if (period === "month") {
      const thirtyDaysAgo = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000));
      dateFilter = { createdAt: { $gte: thirtyDaysAgo } };
    }

    let orders = [];
    let totalSales = 0;
    let orderCount = 0;

    try {
      // Check if Order model exists
      const orderExists = await Order.countDocuments({});
      if (orderExists > 0) {
        orders = await Order.find({ ...dateFilter }).sort({ createdAt: -1 });
        orderCount = orders.length;
        totalSales = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      }
    } catch (error) {
      console.log("Order model not available:", error.message);
    }

    // Get top selling menus (based on reviews/ratings)
    const topMenus = await Menu.aggregate([
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "menu",
          as: "reviews"
        }
      },
      {
        $addFields: {
          averageRating: { $avg: "$reviews.rating" },
          reviewCount: { $size: "$reviews" }
        }
      },
      {
        $sort: { averageRating: -1, reviewCount: -1 }
      },
      {
        $limit: 5
      },
      {
        $project: {
          name: 1,
          price: 1,
          averageRating: 1,
          reviewCount: 1,
          image: 1
        }
      }
    ]);

    res.status(200).json({
      message: "Sales statistics retrieved",
      stats: {
        period,
        orders: {
          count: orderCount,
          totalSales: Math.round(totalSales * 100) / 100,
          averageOrderValue: orderCount > 0 ? Math.round((totalSales / orderCount) * 100) / 100 : 0
        },
        topMenus,
        recentOrders: orders.slice(0, 10)
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get Content Statistics (Admin Only)
exports.getContentStats = async (req, res) => {
  try {
    const { period = "all" } = req.query;
    let dateFilter = {};

    if (period === "today") {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
      dateFilter = { createdAt: { $gte: startOfDay, $lte: endOfDay } };
    } else if (period === "week") {
      const sevenDaysAgo = new Date(Date.now() - (7 * 24 * 60 * 60 * 1000));
      dateFilter = { createdAt: { $gte: sevenDaysAgo } };
    } else if (period === "month") {
      const thirtyDaysAgo = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000));
      dateFilter = { createdAt: { $gte: thirtyDaysAgo } };
    }

    // Menu statistics
    const totalMenus = await Menu.countDocuments({});
    const periodMenus = await Menu.countDocuments({ ...dateFilter });
    const menusByCategory = await Menu.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryInfo"
        }
      },
      {
        $project: {
          categoryName: { $arrayElemAt: ["$categoryInfo.name", 0] },
          count: 1
        }
      }
    ]);

    // Blog statistics
    const totalBlogs = await Blog.countDocuments({});
    const periodBlogs = await Blog.countDocuments({ ...dateFilter });
    const blogsByAuthor = await Blog.aggregate([
      {
        $group: {
          _id: "$author",
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "authorInfo"
        }
      },
      {
        $project: {
          authorName: { $arrayElemAt: ["$authorInfo.name", 0] },
          count: 1
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      }
    ]);

    // Review statistics
    const totalReviews = await Review.countDocuments({});
    const periodReviews = await Review.countDocuments({ ...dateFilter });
    const totalBlogReviews = await require("../models/BlogReviewModel").countDocuments({});

    // Recent content
    const recentMenus = await Menu.find({ ...dateFilter })
      .populate("category", "name")
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentBlogs = await Blog.find({ ...dateFilter })
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      message: "Content statistics retrieved",
      stats: {
        period,
        menus: {
          total: totalMenus,
          period: periodMenus,
          byCategory: menusByCategory
        },
        blogs: {
          total: totalBlogs,
          period: periodBlogs,
          byAuthor: blogsByAuthor
        },
        reviews: {
          total: totalReviews + totalBlogReviews,
          period: periodReviews
        },
        recent: {
          menus: recentMenus,
          blogs: recentBlogs
        }
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get System Health (Admin Only)
exports.getSystemHealth = async (req, res) => {
  try {
    // Database connection status
    const dbStatus = "connected"; // You can add actual DB health check here

    // Get system metrics
    const totalUsers = await User.countDocuments({});
    const totalMenus = await Menu.countDocuments({});
    const totalOrders = await Order.countDocuments({}).catch(() => 0);
    const totalReviews = await Review.countDocuments({});
    const totalBlogs = await Blog.countDocuments({});

    // Get recent activity (last 24 hours)
    const yesterday = new Date(Date.now() - (24 * 60 * 60 * 1000));
    
    const newUsers = await User.countDocuments({ createdAt: { $gte: yesterday } });
    const newMenus = await Menu.countDocuments({ createdAt: { $gte: yesterday } });
    const newReviews = await Review.countDocuments({ createdAt: { $gte: yesterday } });
    const newBlogs = await Blog.countDocuments({ createdAt: { $gte: yesterday } });

    res.status(200).json({
      message: "System health retrieved",
      health: {
        database: dbStatus,
        metrics: {
          totalUsers,
          totalMenus,
          totalOrders,
          totalReviews,
          totalBlogs
        },
        recentActivity: {
          newUsers,
          newMenus,
          newReviews,
          newBlogs
        },
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}; 