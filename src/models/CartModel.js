const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  menu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Menu",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
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
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    totalItems: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    shippingAddress: {
      country: {
        type: String,
        required: false,
      },
      state: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: false,
      },
      zipCode: {
        type: String,
        required: false,
      },
      address: {
        type: String,
        required: false,
      },
    },
    selectedShippingMethod: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShippingMethod",
      required: false,
    },
    shippingCharge: {
      type: Number,
      default: 0,
    },
    grandTotal: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false }
);

// Pre-save middleware to calculate totals
cartSchema.pre('save', function(next) {
  this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.totalPrice = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
  this.grandTotal = this.totalPrice + this.shippingCharge;
  next();
});

// Method to add item to cart (only for new items)
cartSchema.methods.addItem = function(menuId, quantity = 1, price) {
  // This method now only adds new items, existing items are handled by updateItemQuantity
  this.items.push({
    menu: menuId,
    quantity: quantity,
    price: price,
    totalPrice: quantity * price,
  });
  
  this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.totalPrice = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
};

// Method to update item quantity
cartSchema.methods.updateItemQuantity = function(menuId, quantity) {
  const item = this.items.find(item => item.menu.toString() === menuId.toString());
  
  if (item) {
    item.quantity = quantity;
    item.totalPrice = quantity * item.price;
    this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
    this.totalPrice = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
    return true;
  }
  return false;
};

// Method to remove item from cart
cartSchema.methods.removeItem = function(menuId) {
  const index = this.items.findIndex(item => item.menu.toString() === menuId.toString());
  
  if (index > -1) {
    this.items.splice(index, 1);
    this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
    this.totalPrice = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
    return true;
  }
  return false;
};

// Method to clear cart
cartSchema.methods.clearCart = function() {
  this.items = [];
  this.totalItems = 0;
  this.totalPrice = 0;
};

module.exports = mongoose.model("Cart", cartSchema);
