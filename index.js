const app = require("./app");
const connectToDB = require("./src/config/db");

// Connect to database
connectToDB().catch(console.error);

// Check if running on Vercel (serverless) or locally
if (process.env.VERCEL) {
  // Vercel serverless environment
  console.log("🚀 Running on Vercel (Serverless)");
  module.exports = app;
} else {
  // Local development environment
  const http = require("http");
  const { server_port } = require("./src/utils/secret");
  const displayStartupBanner = require("./startup-banner");

  const server = http.createServer(app);

  const main = async () => {
    try {
      await connectToDB();
      server.listen(server_port, () => {
        // Display beautiful startup banner
        displayStartupBanner(server_port, process.env.NODE_ENV || 'development');
      });
    } catch (error) {
      console.error("❌ Error starting the server:", error);
    }
  };

  main();
}
