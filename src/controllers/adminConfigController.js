const AdminConfig = require("../models/AdminConfigModel");

// Get all admin configuration (admin only)
const getAdminConfig = async (req, res) => {
  try {
    const config = await AdminConfig.getConfig();
    
    res.status(200).json({
      message: "Admin configuration retrieved successfully",
      config,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get admin configuration", error: error.message });
  }
};

// Update SSL Commerz settings (admin only)
const updateSSLCommerz = async (req, res) => {
  try {
    const { storeId, storePassword, isLive, isActive } = req.body;

    // Validate required fields
    if (!storeId || !storePassword) {
      return res.status(400).json({ 
        message: "Store ID and Store Password are required" 
      });
    }

    const config = await AdminConfig.getConfig();
    await config.updateSSLCommerz({
      storeId,
      storePassword,
      isLive: isLive !== undefined ? isLive : config.sslCommerz.isLive,
      isActive: isActive !== undefined ? isActive : config.sslCommerz.isActive,
    });

    res.status(200).json({
      message: "SSL Commerz settings updated successfully",
      sslCommerz: config.sslCommerz,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update SSL Commerz settings", error: error.message });
  }
};

// Update payment collection settings (admin only)
const updatePaymentCollection = async (req, res) => {
  try {
    const { 
      phoneNumber, 
      whatsappNumber, 
      bankAccount, 
      isActive 
    } = req.body;

    // Validate required fields
    if (!phoneNumber) {
      return res.status(400).json({ 
        message: "Phone number is required" 
      });
    }

    // Validate phone number format (Bangladesh)
    const phoneRegex = /^(\+880|880|0)?1[3-9]\d{8}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ 
        message: "Please enter a valid Bangladesh phone number" 
      });
    }

    const config = await AdminConfig.getConfig();
    await config.updatePaymentCollection({
      phoneNumber,
      whatsappNumber,
      bankAccount,
      isActive: isActive !== undefined ? isActive : config.paymentCollection.isActive,
    });

    res.status(200).json({
      message: "Payment collection settings updated successfully",
      paymentCollection: config.paymentCollection,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update payment collection settings", error: error.message });
  }
};

// Update general settings (admin only)
const updateGeneral = async (req, res) => {
  try {
    const { 
      siteName, 
      siteDescription, 
      contactEmail, 
      supportPhone, 
      businessHours, 
      minimumOrderAmount, 
      deliveryRadius 
    } = req.body;

    const config = await AdminConfig.getConfig();
    await config.updateGeneral({
      siteName,
      siteDescription,
      contactEmail,
      supportPhone,
      businessHours,
      minimumOrderAmount,
      deliveryRadius,
    });

    res.status(200).json({
      message: "General settings updated successfully",
      general: config.general,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update general settings", error: error.message });
  }
};

// Update notification settings (admin only)
const updateNotifications = async (req, res) => {
  try {
    const { 
      emailNotifications, 
      smsNotifications, 
      pushNotifications, 
      orderConfirmationEmail, 
      orderStatusUpdateEmail, 
      paymentConfirmationEmail 
    } = req.body;

    const config = await AdminConfig.getConfig();
    await config.updateNotifications({
      emailNotifications,
      smsNotifications,
      pushNotifications,
      orderConfirmationEmail,
      orderStatusUpdateEmail,
      paymentConfirmationEmail,
    });

    res.status(200).json({
      message: "Notification settings updated successfully",
      notifications: config.notifications,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update notification settings", error: error.message });
  }
};

// Update maintenance mode (admin only)
const updateMaintenance = async (req, res) => {
  try {
    const { isEnabled, message, allowedIPs } = req.body;

    const config = await AdminConfig.getConfig();
    await config.updateMaintenance({
      isEnabled,
      message,
      allowedIPs,
    });

    res.status(200).json({
      message: "Maintenance mode updated successfully",
      maintenance: config.maintenance,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update maintenance mode", error: error.message });
  }
};

// Get public configuration (for frontend)
const getPublicConfig = async (req, res) => {
  try {
    const config = await AdminConfig.getConfig();
    
    // Only return public information
    const publicConfig = {
      general: {
        siteName: config.general.siteName,
        siteDescription: config.general.siteDescription,
        contactEmail: config.general.contactEmail,
        supportPhone: config.general.supportPhone,
        businessHours: config.general.businessHours,
        minimumOrderAmount: config.general.minimumOrderAmount,
        deliveryRadius: config.general.deliveryRadius,
      },
      paymentCollection: {
        phoneNumber: config.paymentCollection.phoneNumber,
        whatsappNumber: config.paymentCollection.whatsappNumber,
        bankAccount: config.paymentCollection.bankAccount,
        isActive: config.paymentCollection.isActive,
      },
      sslCommerz: {
        isActive: config.sslCommerz.isActive,
        isLive: config.sslCommerz.isLive,
      },
      maintenance: {
        isEnabled: config.maintenance.isEnabled,
        message: config.maintenance.message,
      },
    };

    res.status(200).json({
      message: "Public configuration retrieved successfully",
      config: publicConfig,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get public configuration", error: error.message });
  }
};

// Test SSL Commerz connection (admin only)
const testSSLCommerzConnection = async (req, res) => {
  try {
    const config = await AdminConfig.getConfig();
    
    if (!config.sslCommerz.isActive) {
      return res.status(400).json({ 
        message: "SSL Commerz is currently disabled" 
      });
    }

    // Import SSL Commerz dynamically to use updated config
    const sslCommerz = require("../config/sslCommerz");
    
    // Test with a minimal transaction
    const testData = {
      orderNumber: "TEST" + Date.now(),
      amount: 1.00,
      customerName: "Test Customer",
      customerEmail: "test@example.com",
      customerPhone: "01712345678",
      customerAddress: "Test Address",
      customerCity: "Dhaka",
      customerPostCode: "1200",
      customerCountry: "Bangladesh",
      successUrl: `${process.env.FRONTEND_URL}/test-success`,
      failUrl: `${process.env.FRONTEND_URL}/test-fail`,
      cancelUrl: `${process.env.FRONTEND_URL}/test-cancel`,
      ipnUrl: `${process.env.BACKEND_URL}/test-ipn`,
    };

    const result = await sslCommerz.createSession(testData);

    if (result.success) {
      res.status(200).json({
        message: "SSL Commerz connection test successful",
        testResult: {
          status: "success",
          transactionId: result.transactionId,
          gatewayPageURL: result.gatewayPageURL,
          environment: config.sslCommerz.isLive ? "Live" : "Sandbox",
        },
      });
    } else {
      res.status(400).json({
        message: "SSL Commerz connection test failed",
        testResult: {
          status: "failed",
          error: result.error,
          environment: config.sslCommerz.isLive ? "Live" : "Sandbox",
        },
      });
    }
  } catch (error) {
    res.status(500).json({ 
      message: "SSL Commerz connection test failed", 
      error: error.message 
    });
  }
};

// Reset configuration to defaults (admin only)
const resetConfig = async (req, res) => {
  try {
    const config = await AdminConfig.getConfig();
    
    // Reset to default values
    config.sslCommerz = {
      storeId: "testbox",
      storePassword: "qwerty",
      isLive: false,
      isActive: true,
      lastUpdated: new Date(),
    };

    config.paymentCollection = {
      phoneNumber: "01712345678",
      whatsappNumber: "",
      bankAccount: {
        accountNumber: "",
        accountName: "",
        bankName: "",
        branchName: "",
      },
      isActive: true,
      lastUpdated: new Date(),
    };

    config.general = {
      siteName: "Bistro Boss",
      siteDescription: "Delicious food delivery service",
      contactEmail: "info@bistroboss.com",
      supportPhone: "01712345678",
      businessHours: "9:00 AM - 10:00 PM",
      minimumOrderAmount: 100,
      deliveryRadius: 10,
      lastUpdated: new Date(),
    };

    config.notifications = {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
      orderConfirmationEmail: true,
      orderStatusUpdateEmail: true,
      paymentConfirmationEmail: true,
      lastUpdated: new Date(),
    };

    config.maintenance = {
      isEnabled: false,
      message: "We are currently under maintenance. Please try again later.",
      allowedIPs: [],
      lastUpdated: new Date(),
    };

    await config.save();

    res.status(200).json({
      message: "Configuration reset to defaults successfully",
      config,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to reset configuration", error: error.message });
  }
};

module.exports = {
  getAdminConfig,
  updateSSLCommerz,
  updatePaymentCollection,
  updateGeneral,
  updateNotifications,
  updateMaintenance,
  getPublicConfig,
  testSSLCommerzConnection,
  resetConfig,
}; 