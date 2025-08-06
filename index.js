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
      
      // Try to start server with error handling for port conflicts
      server.listen(server_port, () => {
        // Display beautiful startup banner
        displayStartupBanner(server_port, process.env.NODE_ENV || 'development');
      }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`❌ Port ${server_port} is already in use!`);
          console.log('🔧 Solutions:');
          console.log(`  1. Kill the process using port ${server_port}:`);
          console.log(`     netstat -ano | findstr :${server_port}`);
          console.log(`     taskkill /PID <PID> /F`);
          console.log(`  2. Or use a different port in your .env file:`);
          console.log(`     PORT=5001`);
          console.log('');
          console.log('💡 Try running: taskkill /IM node.exe /F');
        } else {
          console.error("❌ Server error:", err);
        }
      });
    } catch (error) {
      console.error("❌ Error starting the server:", error);
    }
  };

  main();
}
