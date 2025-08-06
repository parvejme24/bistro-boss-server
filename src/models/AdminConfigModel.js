const mongoose = require("mongoose");

const adminConfigSchema = new mongoose.Schema(
  {
    // SSL Commerz Configuration
    sslCommerz: {
      storeId: {
        type: String,
        required: true,
        default: "testbox",
      },
      storePassword: {
        type: String,
        required: true,
        default: "qwerty",
      },
      isLive: {
        type: Boolean,
        default: false,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
    },

    // Payment Collection Settings
    paymentCollection: {
      phoneNumber: {
        type: String,
        required: true,
        default: "01712345678",
      },
      whatsappNumber: {
        type: String,
        required: false,
      },
      bankAccount: {
        accountNumber: {
          type: String,
          required: false,
        },
        accountName: {
          type: String,
          required: false,
        },
        bankName: {
          type: String,
          required: false,
        },
        branchName: {
          type: String,
          required: false,
        },
      },
      isActive: {
        type: Boolean,
        default: true,
      },
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
    },

    // General Settings
    general: {
      siteName: {
        type: String,
        default: "Bistro Boss",
      },
      siteDescription: {
        type: String,
        default: "Delicious food delivery service",
      },
      contactEmail: {
        type: String,
        default: "info@bistroboss.com",
      },
      supportPhone: {
        type: String,
        default: "01712345678",
      },
      businessHours: {
        type: String,
        default: "9:00 AM - 10:00 PM",
      },
      minimumOrderAmount: {
        type: Number,
        default: 100,
        min: 0,
      },
      deliveryRadius: {
        type: Number,
        default: 10, // in kilometers
        min: 0,
      },
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
    },

    // Notification Settings
    notifications: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      smsNotifications: {
        type: Boolean,
        default: true,
      },
      pushNotifications: {
        type: Boolean,
        default: true,
      },
      orderConfirmationEmail: {
        type: Boolean,
        default: true,
      },
      orderStatusUpdateEmail: {
        type: Boolean,
        default: true,
      },
      paymentConfirmationEmail: {
        type: Boolean,
        default: true,
      },
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
    },

    // Maintenance Mode
    maintenance: {
      isEnabled: {
        type: Boolean,
        default: false,
      },
      message: {
        type: String,
        default: "We are currently under maintenance. Please try again later.",
      },
      allowedIPs: [{
        type: String,
      }],
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
    },
  },
  { timestamps: true, versionKey: false }
);

// Ensure only one config document exists
adminConfigSchema.statics.getConfig = async function() {
  let config = await this.findOne();
  if (!config) {
    config = new this();
    await config.save();
  }
  return config;
};

// Update SSL Commerz settings
adminConfigSchema.methods.updateSSLCommerz = async function(sslCommerzData) {
  this.sslCommerz = {
    ...this.sslCommerz,
    ...sslCommerzData,
    lastUpdated: new Date(),
  };
  return await this.save();
};

// Update payment collection settings
adminConfigSchema.methods.updatePaymentCollection = async function(paymentData) {
  this.paymentCollection = {
    ...this.paymentCollection,
    ...paymentData,
    lastUpdated: new Date(),
  };
  return await this.save();
};

// Update general settings
adminConfigSchema.methods.updateGeneral = async function(generalData) {
  this.general = {
    ...this.general,
    ...generalData,
    lastUpdated: new Date(),
  };
  return await this.save();
};

// Update notification settings
adminConfigSchema.methods.updateNotifications = async function(notificationData) {
  this.notifications = {
    ...this.notifications,
    ...notificationData,
    lastUpdated: new Date(),
  };
  return await this.save();
};

// Update maintenance mode
adminConfigSchema.methods.updateMaintenance = async function(maintenanceData) {
  this.maintenance = {
    ...this.maintenance,
    ...maintenanceData,
    lastUpdated: new Date(),
  };
  return await this.save();
};

module.exports = mongoose.model("AdminConfig", adminConfigSchema); 