const Cart = require("../models/CartModel");
const Menu = require("../models/MenuModel");
const { ShippingMethod } = require("../models/ShippingModel");

// Get user's cart (authenticated users)
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id, isActive: true })
      .populate({
        path: 'items.menu',
        select: 'name image price category description',
        populate: {
          path: 'category',
          select: 'name'
        }
      })
      .populate('user', 'name email');

    if (!cart) {
      // Create empty cart if it doesn't exist
      cart = new Cart({
        user: req.user._id,
        items: [],
        totalItems: 0,
        totalPrice: 0,
      });
      await cart.save();
    }

    res.status(200).json({
      message: "Cart retrieved successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get cart", error: error.message });
  }
};

// Add item to cart (authenticated users)
const addToCart = async (req, res) => {
  try {
    const { menuId, quantity = 1 } = req.body;

    // Validate quantity
    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    // Check if menu exists
    const menu = await Menu.findById(menuId);
    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user._id, isActive: true });
    
    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
        totalItems: 0,
        totalPrice: 0,
      });
    }

    // Check if item already exists in cart
    const existingItem = cart.items.find(item => item.menu.toString() === menuId.toString());
    if (existingItem) {
      return res.status(400).json({ 
        message: "Item already exists in cart. Use update quantity instead.",
        existingQuantity: existingItem.quantity
      });
    }

    // Add item to cart (only if it doesn't exist)
    cart.addItem(menuId, quantity, menu.price);
    await cart.save();

    // Populate cart with menu details
    await cart.populate({
      path: 'items.menu',
      select: 'name image price category description',
      populate: {
        path: 'category',
        select: 'name'
      }
    });

    res.status(200).json({
      message: "Item added to cart successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to add item to cart", error: error.message });
  }
};

// Update item quantity in cart (authenticated users)
const updateCartItem = async (req, res) => {
  try {
    const { menuId } = req.params;
    const { quantity } = req.body;

    // Validate quantity
    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    // Find cart
    const cart = await Cart.findOne({ user: req.user._id, isActive: true });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Update item quantity
    const updated = cart.updateItemQuantity(menuId, quantity);
    if (!updated) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    await cart.save();

    // Populate cart with menu details
    await cart.populate({
      path: 'items.menu',
      select: 'name image price category description',
      populate: {
        path: 'category',
        select: 'name'
      }
    });

    res.status(200).json({
      message: "Cart item updated successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update cart item", error: error.message });
  }
};

// Remove item from cart (authenticated users)
const removeFromCart = async (req, res) => {
  try {
    const { menuId } = req.params;

    // Find cart
    const cart = await Cart.findOne({ user: req.user._id, isActive: true });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Remove item
    const removed = cart.removeItem(menuId);
    if (!removed) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    await cart.save();

    // Populate cart with menu details
    await cart.populate({
      path: 'items.menu',
      select: 'name image price category description',
      populate: {
        path: 'category',
        select: 'name'
      }
    });

    res.status(200).json({
      message: "Item removed from cart successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove item from cart", error: error.message });
  }
};

// Clear cart (authenticated users)
const clearCart = async (req, res) => {
  try {
    // Find cart
    const cart = await Cart.findOne({ user: req.user._id, isActive: true });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Clear cart
    cart.clearCart();
    await cart.save();

    res.status(200).json({
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear cart", error: error.message });
  }
};

// Update shipping address (authenticated users)
const updateShippingAddress = async (req, res) => {
  try {
    const { country, state, city, zipCode, address } = req.body;

    // Find cart
    let cart = await Cart.findOne({ user: req.user._id, isActive: true });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Update shipping address
    cart.shippingAddress = {
      country,
      state,
      city,
      zipCode,
      address,
    };

    // Clear shipping method and charge when address changes
    cart.selectedShippingMethod = null;
    cart.shippingCharge = 0;

    await cart.save();

    // Populate cart with menu details
    await cart.populate({
      path: 'items.menu',
      select: 'name image price category description',
      populate: {
        path: 'category',
        select: 'name'
      }
    });

    res.status(200).json({
      message: "Shipping address updated successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update shipping address", error: error.message });
  }
};

// Apply shipping method to cart (authenticated users)
const applyShippingMethod = async (req, res) => {
  try {
    const { methodId } = req.body;

    if (!methodId) {
      return res.status(400).json({ message: "Shipping method ID is required" });
    }

    // Find cart
    const cart = await Cart.findOne({ user: req.user._id, isActive: true });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Check if shipping address is set
    if (!cart.shippingAddress.country) {
      return res.status(400).json({ message: "Please set shipping address first" });
    }

    // Find shipping method
    const shippingMethod = await ShippingMethod.findById(methodId);
    if (!shippingMethod) {
      return res.status(404).json({ message: "Shipping method not found" });
    }

    if (!shippingMethod.isActive) {
      return res.status(400).json({ message: "Shipping method is not available" });
    }

    // Calculate shipping charge
    let shippingCharge = 0;

    switch (shippingMethod.pricingType) {
      case "fixed":
        shippingCharge = shippingMethod.basePrice;
        break;

      case "percentage":
        shippingCharge = (cart.totalPrice * shippingMethod.percentageRate) / 100;
        break;

      case "weight_based":
        // For now, using a simple weight calculation based on item count
        const estimatedWeight = cart.totalItems * 0.5; // 0.5kg per item
        shippingCharge = shippingMethod.basePrice + (estimatedWeight * shippingMethod.weightRate);
        break;

      case "free_shipping_threshold":
        if (cart.totalPrice >= shippingMethod.freeShippingThreshold) {
          shippingCharge = 0;
        } else {
          shippingCharge = shippingMethod.basePrice;
        }
        break;

      default:
        shippingCharge = shippingMethod.basePrice;
    }

    // Update cart with shipping method and charge
    cart.selectedShippingMethod = methodId;
    cart.shippingCharge = Math.round(shippingCharge * 100) / 100; // Round to 2 decimal places
    await cart.save();

    // Populate cart with menu details and shipping method
    await cart.populate({
      path: 'items.menu',
      select: 'name image price category description',
      populate: {
        path: 'category',
        select: 'name'
      }
    });
    await cart.populate('selectedShippingMethod', 'name description estimatedDays');

    res.status(200).json({
      message: "Shipping method applied successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to apply shipping method", error: error.message });
  }
};

// Remove shipping method from cart (authenticated users)
const removeShippingMethod = async (req, res) => {
  try {
    // Find cart
    const cart = await Cart.findOne({ user: req.user._id, isActive: true });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Remove shipping method and charge
    cart.selectedShippingMethod = null;
    cart.shippingCharge = 0;
    await cart.save();

    // Populate cart with menu details
    await cart.populate({
      path: 'items.menu',
      select: 'name image price category description',
      populate: {
        path: 'category',
        select: 'name'
      }
    });

    res.status(200).json({
      message: "Shipping method removed successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove shipping method", error: error.message });
  }
};



module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  updateShippingAddress,
  applyShippingMethod,
  removeShippingMethod,
}; 