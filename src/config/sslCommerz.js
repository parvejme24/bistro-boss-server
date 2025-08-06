const axios = require('axios');
const crypto = require('crypto');

class SSLCommerz {
  constructor() {
    this.storeId = process.env.SSL_COMMERZ_STORE_ID;
    this.storePassword = process.env.SSL_COMMERZ_STORE_PASSWORD;
    this.isLive = process.env.SSL_COMMERZ_IS_LIVE === 'true';
    
    this.baseURL = this.isLive 
      ? 'https://securepay.sslcommerz.com'
      : 'https://sandbox.sslcommerz.com';
  }

  // Generate transaction ID
  generateTransactionId() {
    return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9);
  }

  // Create payment session
  async createSession(orderData) {
    try {
      const {
        orderNumber,
        amount,
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        customerCity,
        customerPostCode,
        customerCountry,
        successUrl,
        failUrl,
        cancelUrl,
        ipnUrl
      } = orderData;

      const transactionId = this.generateTransactionId();
      
      const postData = {
        store_id: this.storeId,
        store_passwd: this.storePassword,
        total_amount: amount,
        currency: 'BDT',
        tran_id: transactionId,
        product_category: 'Food',
        cus_name: customerName,
        cus_email: customerEmail,
        cus_add1: customerAddress,
        cus_city: customerCity,
        cus_postcode: customerPostCode,
        cus_country: customerCountry,
        cus_phone: customerPhone,
        ship_name: customerName,
        ship_add1: customerAddress,
        ship_city: customerCity,
        ship_postcode: customerPostCode,
        ship_country: customerCountry,
        success_url: successUrl,
        fail_url: failUrl,
        cancel_url: cancelUrl,
        ipn_url: ipnUrl,
        multi_card_name: '',
        value_a: orderNumber, // Order number
        value_b: 'bistro_boss',
        value_c: 'order_payment',
        value_d: 'web'
      };

      const response = await axios.post(
        `${this.baseURL}/gwprocess/v4/api.php`,
        postData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      return {
        success: true,
        transactionId: transactionId,
        gatewayPageURL: response.data.GatewayPageURL,
        sessionKey: response.data.sessionkey,
        response: response.data
      };

    } catch (error) {
      console.error('SSL Commerz Session Creation Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Validate payment
  async validatePayment(transactionId, amount, currency = 'BDT') {
    try {
      const postData = {
        store_id: this.storeId,
        store_passwd: this.storePassword,
        val_id: transactionId,
        amount: amount,
        currency: currency
      };

      const response = await axios.post(
        `${this.baseURL}/validator/api/validationserverAPI.php`,
        postData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      return {
        success: true,
        data: response.data
      };

    } catch (error) {
      console.error('SSL Commerz Validation Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Verify transaction
  async verifyTransaction(transactionId) {
    try {
      const postData = {
        store_id: this.storeId,
        store_passwd: this.storePassword,
        tran_id: transactionId
      };

      const response = await axios.post(
        `${this.baseURL}/validator/api/merchantTransIDvalidationAPI.php`,
        postData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      return {
        success: true,
        data: response.data
      };

    } catch (error) {
      console.error('SSL Commerz Verification Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Refund transaction
  async refundTransaction(transactionId, amount, refundRemark = '') {
    try {
      const postData = {
        store_id: this.storeId,
        store_passwd: this.storePassword,
        tran_id: transactionId,
        amount: amount,
        refund_remark: refundRemark
      };

      const response = await axios.post(
        `${this.baseURL}/validator/api/merchantTransIDvalidationAPI.php`,
        postData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      return {
        success: true,
        data: response.data
      };

    } catch (error) {
      console.error('SSL Commerz Refund Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new SSLCommerz(); 