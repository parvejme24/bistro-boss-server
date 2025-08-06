const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  menu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Menu",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
}, { timestamps: true });

const paymentSchema = new mongoose.Schema({
  method: {
    type: String,
    enum: ["ssl_commerz", "cash_on_delivery", "bank_transfer"],
    default: "ssl_commerz",
  },
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "failed", "cancelled", "refunded"],
    default: "pending",
  },
  transactionId: {
    type: String,
    required: false,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: "BDT",
  },
  gatewayResponse: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
  paidAt: {
    type: Date,
    required: false,
  },
}, { timestamps: true });

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    totalItems: {
      type: Number,
      required: true,
      min: 0,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingCharge: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    grandTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingAddress: {
      country: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },
    shippingMethod: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShippingMethod",
      required: false,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "refunded",
      ],
      default: "pending",
    },
    payment: paymentSchema,
    notes: {
      type: String,
      required: false,
    },
    estimatedDelivery: {
      type: Date,
      required: false,
    },
    deliveredAt: {
      type: Date,
      required: false,
    },
    cancelledAt: {
      type: Date,
      required: false,
    },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    cancellationReason: {
      type: String,
      required: false,
    },
  },
  { timestamps: true, versionKey: false }
);

// Generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Get count of orders for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const orderCount = await mongoose.model('Order').countDocuments({
      createdAt: { $gte: today, $lt: tomorrow }
    });
    
    const sequence = (orderCount + 1).toString().padStart(4, '0');
    this.orderNumber = `BB${year}${month}${day}${sequence}`;
  }
  next();
});

// Calculate totals
orderSchema.pre('save', function(next) {
  this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
  this.grandTotal = this.subtotal + this.shippingCharge;
  next();
});

module.exports = mongoose.model("Order", orderSchema); 