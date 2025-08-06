const Order = require("../models/OrderModel");
const Cart = require("../models/CartModel");
const User = require("../models/UserModel");
const sslCommerz = require("../config/sslCommerz");

// Create order from cart (authenticated users)
const createOrder = async (req, res) => {
  try {
    const { notes, paymentMethod = "ssl_commerz" } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id, isActive: true })
      .populate({
        path: 'items.menu',
        select: 'name image price category description',
        populate: {
          path: 'category',
          select: 'name'
        }
      })
      .populate('selectedShippingMethod', 'name description estimatedDays');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Check if shipping address is set
    if (!cart.shippingAddress.country) {
      return res.status(400).json({ message: "Please set shipping address first" });
    }

    // Check if shipping method is selected
    if (!cart.selectedShippingMethod) {
      return res.status(400).json({ message: "Please select shipping method first" });
    }

    // Create order items from cart
    const orderItems = cart.items.map(item => ({
      menu: item.menu._id,
      quantity: item.quantity,
      price: item.price,
      totalPrice: item.totalPrice,
    }));

    // Create order
    const order = new Order({
      user: req.user._id,
      items: orderItems,
      totalItems: cart.totalItems,
      subtotal: cart.totalPrice,
      shippingCharge: cart.shippingCharge,
      grandTotal: cart.grandTotal,
      shippingAddress: cart.shippingAddress,
      shippingMethod: cart.selectedShippingMethod._id,
      payment: {
        method: paymentMethod,
        status: paymentMethod === "ssl_commerz" ? "pending" : "completed",
        amount: cart.grandTotal,
      },
      notes: notes || "",
    });

    await order.save();

    // Clear cart after order creation
    cart.clearCart();
    await cart.save();

    // Populate order details
    await order.populate({
      path: 'items.menu',
      select: 'name image price category description',
      populate: {
        path: 'category',
        select: 'name'
      }
    });
    await order.populate('shippingMethod', 'name description estimatedDays');
    await order.populate('user', 'name email phone');

    // If SSL Commerz payment, create payment session
    if (paymentMethod === "ssl_commerz") {
      const user = await User.findById(req.user._id);
      
      const paymentData = {
        orderNumber: order.orderNumber,
        amount: order.grandTotal,
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone || "",
        customerAddress: order.shippingAddress.address,
        customerCity: order.shippingAddress.city,
        customerPostCode: order.shippingAddress.zipCode,
        customerCountry: order.shippingAddress.country,
        successUrl: `${process.env.FRONTEND_URL}/payment/success?orderId=${order._id}`,
        failUrl: `${process.env.FRONTEND_URL}/payment/fail?orderId=${order._id}`,
        cancelUrl: `${process.env.FRONTEND_URL}/payment/cancel?orderId=${order._id}`,
        ipnUrl: `${process.env.BACKEND_URL}/api/v1/orders/payment/ipn`,
      };

      const paymentSession = await sslCommerz.createSession(paymentData);

      if (paymentSession.success) {
        // Update order with transaction ID
        order.payment.transactionId = paymentSession.transactionId;
        order.payment.gatewayResponse = paymentSession.response;
        await order.save();

        return res.status(201).json({
          message: "Order created successfully",
          order,
          payment: {
            gatewayPageURL: paymentSession.gatewayPageURL,
            transactionId: paymentSession.transactionId,
            sessionKey: paymentSession.sessionKey,
          },
        });
      } else {
        return res.status(500).json({
          message: "Order created but payment session failed",
          order,
          error: paymentSession.error,
        });
      }
    }

    // For cash on delivery or other methods
    res.status(201).json({
      message: "Order created successfully",
      order,
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
};

// Get user's orders (authenticated users)
const getUserOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = { user: req.user._id };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate({
        path: 'items.menu',
        select: 'name image price category description',
        populate: {
          path: 'category',
          select: 'name'
        }
      })
      .populate('shippingMethod', 'name description estimatedDays')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.status(200).json({
      message: "Orders retrieved successfully",
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get orders", error: error.message });
  }
};

// Get order by ID (authenticated users)
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ _id: orderId, user: req.user._id })
      .populate({
        path: 'items.menu',
        select: 'name image price category description',
        populate: {
          path: 'category',
          select: 'name'
        }
      })
      .populate('shippingMethod', 'name description estimatedDays')
      .populate('user', 'name email phone')
      .populate('cancelledBy', 'name email');

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order retrieved successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get order", error: error.message });
  }
};

// Get all orders (admin only)
const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'user.name': { $regex: search, $options: 'i' } },
        { 'user.email': { $regex: search, $options: 'i' } },
      ];
    }

    const orders = await Order.find(query)
      .populate({
        path: 'items.menu',
        select: 'name image price category description',
        populate: {
          path: 'category',
          select: 'name'
        }
      })
      .populate('shippingMethod', 'name description estimatedDays')
      .populate('user', 'name email phone')
      .populate('cancelledBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.status(200).json({
      message: "Orders retrieved successfully",
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get orders", error: error.message });
  }
};

// Update order status (admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, estimatedDelivery, notes } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update status
    order.status = status;

    // Set delivery date when status changes to delivered
    if (status === "delivered" && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }

    // Update estimated delivery
    if (estimatedDelivery) {
      order.estimatedDelivery = new Date(estimatedDelivery);
    }

    // Update notes
    if (notes) {
      order.notes = notes;
    }

    await order.save();

    // Populate order details
    await order.populate({
      path: 'items.menu',
      select: 'name image price category description',
      populate: {
        path: 'category',
        select: 'name'
      }
    });
    await order.populate('shippingMethod', 'name description estimatedDays');
    await order.populate('user', 'name email phone');

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status", error: error.message });
  }
};

// Cancel order (authenticated users)
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await Order.findOne({ _id: orderId, user: req.user._id });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if order can be cancelled
    if (order.status === "delivered" || order.status === "cancelled") {
      return res.status(400).json({ message: "Order cannot be cancelled" });
    }

    // Update order
    order.status = "cancelled";
    order.cancelledAt = new Date();
    order.cancelledBy = req.user._id;
    order.cancellationReason = reason || "";

    await order.save();

    // Populate order details
    await order.populate({
      path: 'items.menu',
      select: 'name image price category description',
      populate: {
        path: 'category',
        select: 'name'
      }
    });
    await order.populate('shippingMethod', 'name description estimatedDays');
    await order.populate('user', 'name email phone');

    res.status(200).json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel order", error: error.message });
  }
};

// SSL Commerz payment success callback
const paymentSuccess = async (req, res) => {
  try {
    const { tran_id, val_id, amount, currency, status } = req.body;

    // Find order by transaction ID
    const order = await Order.findOne({ 'payment.transactionId': tran_id });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Validate payment with SSL Commerz
    const validation = await sslCommerz.validatePayment(val_id, amount, currency);
    
    if (validation.success && validation.data.status === 'VALID') {
      // Update order payment status
      order.payment.status = "completed";
      order.payment.paidAt = new Date();
      order.payment.gatewayResponse = validation.data;
      order.status = "confirmed";
      
      await order.save();

      res.status(200).json({
        message: "Payment successful",
        order: order.orderNumber,
        transactionId: tran_id,
      });
    } else {
      // Payment validation failed
      order.payment.status = "failed";
      order.payment.gatewayResponse = validation.data;
      await order.save();

      res.status(400).json({
        message: "Payment validation failed",
        error: validation.error,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Payment processing error", error: error.message });
  }
};

// SSL Commerz payment fail callback
const paymentFail = async (req, res) => {
  try {
    const { tran_id, error } = req.body;

    const order = await Order.findOne({ 'payment.transactionId': tran_id });
    if (order) {
      order.payment.status = "failed";
      order.payment.gatewayResponse = { error };
      await order.save();
    }

    res.status(200).json({
      message: "Payment failed",
      transactionId: tran_id,
      error,
    });
  } catch (error) {
    res.status(500).json({ message: "Payment fail processing error", error: error.message });
  }
};

// SSL Commerz payment cancel callback
const paymentCancel = async (req, res) => {
  try {
    const { tran_id } = req.body;

    const order = await Order.findOne({ 'payment.transactionId': tran_id });
    if (order) {
      order.payment.status = "cancelled";
      order.payment.gatewayResponse = { cancelled: true };
      await order.save();
    }

    res.status(200).json({
      message: "Payment cancelled",
      transactionId: tran_id,
    });
  } catch (error) {
    res.status(500).json({ message: "Payment cancel processing error", error: error.message });
  }
};

// SSL Commerz IPN (Instant Payment Notification)
const paymentIPN = async (req, res) => {
  try {
    const { tran_id, val_id, amount, currency, status } = req.body;

    const order = await Order.findOne({ 'payment.transactionId': tran_id });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (status === 'VALID') {
      order.payment.status = "completed";
      order.payment.paidAt = new Date();
      order.payment.gatewayResponse = req.body;
      order.status = "confirmed";
    } else {
      order.payment.status = "failed";
      order.payment.gatewayResponse = req.body;
    }

    await order.save();

    res.status(200).json({ message: "IPN processed successfully" });
  } catch (error) {
    res.status(500).json({ message: "IPN processing error", error: error.message });
  }
};

// Get order statistics (admin only)
const getOrderStats = async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const stats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$grandTotal' },
          averageOrderValue: { $avg: '$grandTotal' },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          confirmedOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          }
        }
      }
    ]);

    const dailyStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          orders: { $sum: 1 },
          revenue: { $sum: '$grandTotal' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.status(200).json({
      message: "Order statistics retrieved successfully",
      stats: stats[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        pendingOrders: 0,
        confirmedOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0
      },
      dailyStats,
      period: `${period} days`
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get order statistics", error: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentIPN,
  getOrderStats,
}; 