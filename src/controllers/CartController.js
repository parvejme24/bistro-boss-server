const Cart = require("../models/CartModel");
const Menu = require("../models/MenuModel");

// Get Current User's Cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    let cart = await Cart.findOne({ user: userId })
      .populate({
        path: "items.menu",
        select: "name image price discount shortDescription",
        populate: {
          path: "category",
          select: "name"
        }
      });

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    // Calculate totals
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.items.reduce((sum, item) => {
      const price = item.menu.price - (item.menu.price * (item.menu.discount / 100));
      return sum + (price * item.quantity);
    }, 0);

    res.status(200).json({ 
      message: "Cart retrieved", 
      cart: {
        ...cart.toObject(),
        totalItems,
        totalPrice: Math.round(totalPrice * 100) / 100
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Add Item to Cart
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { menuId, quantity = 1 } = req.body;

    // Validate menu exists
    const menu = await Menu.findById(menuId);
    if (!menu) return res.status(404).json({ message: "Menu not found" });

    // Validate quantity
    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    let cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      // Create new cart if doesn't exist
      cart = await Cart.create({
        user: userId,
        items: [{ menu: menuId, quantity }]
      });
    } else {
      // Check if item already exists in cart
      const existingItemIndex = cart.items.findIndex(
        item => item.menu.toString() === menuId
      );

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        cart.items.push({ menu: menuId, quantity });
      }

      await cart.save();
    }

    // Populate and return updated cart
    const updatedCart = await Cart.findById(cart._id)
      .populate({
        path: "items.menu",
        select: "name image price discount shortDescription",
        populate: {
          path: "category",
          select: "name"
        }
      });

    // Calculate totals
    const totalItems = updatedCart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = updatedCart.items.reduce((sum, item) => {
      const price = item.menu.price - (item.menu.price * (item.menu.discount / 100));
      return sum + (price * item.quantity);
    }, 0);

    res.status(200).json({ 
      message: "Item added to cart", 
      cart: {
        ...updatedCart.toObject(),
        totalItems,
        totalPrice: Math.round(totalPrice * 100) / 100
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update Item Quantity in Cart
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    // Validate quantity
    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Find and update the item
    const itemIndex = cart.items.findIndex(
      item => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    // Populate and return updated cart
    const updatedCart = await Cart.findById(cart._id)
      .populate({
        path: "items.menu",
        select: "name image price discount shortDescription",
        populate: {
          path: "category",
          select: "name"
        }
      });

    // Calculate totals
    const totalItems = updatedCart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = updatedCart.items.reduce((sum, item) => {
      const price = item.menu.price - (item.menu.price * (item.menu.discount / 100));
      return sum + (price * item.quantity);
    }, 0);

    res.status(200).json({ 
      message: "Cart item updated", 
      cart: {
        ...updatedCart.toObject(),
        totalItems,
        totalPrice: Math.round(totalPrice * 100) / 100
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Remove Item from Cart
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Remove the item
    cart.items = cart.items.filter(
      item => item._id.toString() !== itemId
    );

    await cart.save();

    // Populate and return updated cart
    const updatedCart = await Cart.findById(cart._id)
      .populate({
        path: "items.menu",
        select: "name image price discount shortDescription",
        populate: {
          path: "category",
          select: "name"
        }
      });

    // Calculate totals
    const totalItems = updatedCart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = updatedCart.items.reduce((sum, item) => {
      const price = item.menu.price - (item.menu.price * (item.menu.discount / 100));
      return sum + (price * item.quantity);
    }, 0);

    res.status(200).json({ 
      message: "Item removed from cart", 
      cart: {
        ...updatedCart.toObject(),
        totalItems,
        totalPrice: Math.round(totalPrice * 100) / 100
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Clear Entire Cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    await cart.save();

    res.status(200).json({ 
      message: "Cart cleared", 
      cart: {
        ...cart.toObject(),
        totalItems: 0,
        totalPrice: 0
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}; 